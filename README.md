# Multilingual Sentiment Analysis Web Application

This is a web-based sentiment analysis application that supports multilingual input. It uses FastAPI as the backend and KeyBERT for keyword extraction. The sentiment is analyzed using Ollama's API, and the results are displayed in a user-friendly interface.

## Features

* **Multilingual Support:** You can analyze sentiment in both English and Hindi.
* **Sentiment Analysis:** The app classifies the sentiment as Positive, Negative, or Neutral.
* **Keyword Extraction:** Extracts relevant keywords from the input text.
* **Impact Estimation:** Provides an impact level based on sentiment and trigger words.
* **Dark Mode/Light Mode:** A toggle allows you to switch between dark and light mode. Your preference is stored and persists across page reloads.
* **History:** Displays the analysis history for previous entries.

## Tech Stack

* **Backend:** FastAPI
* **Frontend:** HTML, CSS (TailwindCSS)
* **Sentiment Analysis:** Ollama (Llama3.2 model)
* **Keyword Extraction:** KeyBERT (DistilBERT model)
* **Local Storage:** Used for saving dark/light mode preference

## Requirements

To run this application, you need the following:

* Python 3.8+ for the backend.
* Node.js (if you need to modify or build the frontend).
* FastAPI (installed via `pip install fastapi`).
* Uvicorn (installed via `pip install uvicorn`).
* KeyBERT (installed via `pip install keybert`).
* Ollama library (installed via `pip install ollama`).
* TailwindCSS for styling (via CDN in the frontend).

## Installation & Setup

1.  **Clone the Repository:**

    ```bash
    git clone [https://github.com/yourusername/sentiment-analyzer.git](https://github.com/yourusername/sentiment-analyzer.git)
    cd sentiment-analyzer
    ```

2.  **Backend Setup:**

    * Install the required Python libraries:

        ```bash
        pip install -r requirements.txt
        ```

    * If you don’t have the necessary libraries, you can manually install them:

        ```bash
        pip install fastapi uvicorn keybert ollama
        ```

3.  **Run the FastAPI Backend:**

    * Start the FastAPI server:

        ```bash
        uvicorn app:app --reload
        ```

    * The API should now be running at `http://127.0.0.1:8000`.

4.  **Frontend Setup:**

    * The frontend files (`index.html`, `script.js`, etc.) are already set up. You don’t need additional setup for the frontend.
    * The frontend is designed with TailwindCSS via CDN for styling.

5.  **Access the Application:**

    * Open your web browser and go to `http://127.0.0.1:8000` to access the app.

## Usage

1.  **Enter Text:** Type your message into the provided text box. The text can be up to 25,000 characters long.
2.  **Select Language:** Choose the language (English or Hindi) for analysis.
3.  **Analyze:** Click the "Analyze" button to get the sentiment, keywords, and impact level.
4.  **View History:** The application will store and display a history of previous analyses below the result section.

## Dark Mode/Light Mode Toggle

* Click the 🌙 button at the top-right corner to toggle between dark and light mode.
* Your theme preference will be stored in `localStorage` and applied automatically when you reload the page.

## Example Request

Here’s an example of how the backend is used:

**Request:**

```json
{
  "text": "This is a sample message to analyze sentiment.",
  "language": "en"
}
```

**Response:**
```json
{
  "sentiment": {
    "label": "POSITIVE",
    "color": "green"
  },
  "keywords": ["sample", "message", "analyze", "sentiment"],
  "impact_estimation": {
    "level": "Low",
    "color": "green"
  }
}
```



**Notes:**

* The `README.md` includes the necessary steps to install, run, and use the application.
* It assumes you're familiar with FastAPI and frontend development.
* You can further customize the `README` based on additional functionality or changes you make to the application.