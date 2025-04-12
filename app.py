from fastapi import FastAPI
from pydantic import BaseModel
from keybert import KeyBERT
from fastapi.middleware.cors import CORSMiddleware
import ollama
import json
import re

app = FastAPI()

# Allow CORS for frontend integration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Adjust in production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize KeyBERT for keyword extraction
kw_model = KeyBERT(model='distilbert-base-nli-mean-tokens')

# Request body model
class MessageInput(BaseModel):
    text: str
    language: str  # 'en' or 'hi'

# Function to get sentiment from Ollama using direct model generation
def get_sentiment_from_ollama(text: str):
    try:
        output = ollama.generate(
            model="llama3.2:1b",
            prompt=f"""
            Analyze the sentiment of the following text.
            Return ONLY a JSON object containing a 'label' key, which can be 'POSITIVE', 'NEGATIVE', or 'NEUTRAL'.

            Text: {text}
            """
        )
        response_text = output['response'].strip()

        # Extract JSON object using regex
        match = re.search(r'\{.*?\}', response_text, re.DOTALL)
        if not match:
            return {"error": "Could not extract JSON from Ollama response."}

        json_part = match.group(0)
        sentiment = json.loads(json_part)
        return sentiment

    except Exception as e:
        return {"error": f"Failed to get sentiment from Ollama: {str(e)}"}

@app.post("/analyze")
def analyze_message(data: MessageInput):
    text = data.text[:25000]  # Limit to 25k characters
    lang = data.language.lower()

    # Sentiment analysis using Ollama
    sentiment_result = get_sentiment_from_ollama(text)
    print(sentiment_result)

    if 'error' in sentiment_result:
        return sentiment_result

    sentiment_label = sentiment_result.get('label')

    # Assign color to sentiment
    sentiment_color = {
        "POSITIVE": "green",
        "NEGATIVE": "red",
        "NEUTRAL": "gray"
    }.get(sentiment_label, "black")

    # Keyword extraction
    keywords = kw_model.extract_keywords(
        text,
        keyphrase_ngram_range=(1, 3),
        stop_words='english' if lang == 'en' else None,
        top_n=5
    )
    keyword_list = [kw[0] for kw in keywords]

    # Basic impact assessment (High if sentiment is negative or trigger words present)
    negative_trigger_words = ["violence", "protest", "hate", "riot"]
    is_negative = any(word in text.lower() for word in negative_trigger_words)
    impact_level = "High" if is_negative or sentiment_label in ["NEGATIVE", "1 star", "2 stars"] else "Medium"

    # Assign color to impact level
    impact_color = {
        "High": "red",
        "Medium": "orange",
        "Low": "green"
    }.get(impact_level, "black")

    return {
        "sentiment": {
            "label": sentiment_label,
            "color": sentiment_color
        },
        "keywords": keyword_list,
        "impact_estimation": {
            "level": impact_level,
            "color": impact_color
        }
    }
