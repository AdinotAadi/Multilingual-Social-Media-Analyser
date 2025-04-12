async function analyze() {
    const text = document.getElementById("message").value;
    const language = document.getElementById("language").value;
    const resultDiv = document.getElementById("result");
  
    if (!text.trim()) {
      alert("Please enter a message.");
      return;
    }
  
    if (text.length > 25000) {
      alert("Text exceeds 25,000 characters.");
      return;
    }
  
    resultDiv.classList.remove("hidden");
    resultDiv.innerHTML = `<p class="text-sm text-gray-600">Analyzing...</p>`;
  
    try {
      const res = await fetch("http://127.0.0.1:8000/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text, language })
      });
  
      const data = await res.json();
  
      if (data.error) {
        resultDiv.innerHTML = `<p class="text-red-600 font-semibold">Error: ${data.error}</p>`;
      } else {
        // Accessing the properties of the impact_estimation object
        const impact = data.impact_estimation;
        
        resultDiv.innerHTML = `
          <div class="space-y-3">
            <p><span class="font-semibold">Sentiment:</span> ${data.sentiment.label}</p>
            <p><span class="font-semibold">Keywords:</span> ${data.keywords.join(", ")}</p>
            <p><span class="font-semibold">Impact:</span> <span id="impact" style="color: ${impact.color};">${impact.level}</span></p>
          </div>
        `;

        // Save the result to localStorage for history
        saveToHistory(text, data);
      }
    } catch (error) {
      resultDiv.innerHTML = `<p class="text-red-600 font-semibold">Something went wrong. Check backend connection.</p>`;
    }
}

// Save the result to the history in reverse chronological order
function saveToHistory(text, data) {
    const history = JSON.parse(localStorage.getItem('history')) || [];
    const newHistory = {
        text,
        sentiment: data.sentiment.label,
        keywords: data.keywords,
        impact: data.impact_estimation.level,
        timestamp: new Date().toISOString(),
    };

    // Push new entry to the front of the history array to maintain reverse chronological order
    history.unshift(newHistory);
    localStorage.setItem('history', JSON.stringify(history));

    // Re-render the updated history
    renderHistory();
}

// Render the history from localStorage
function renderHistory() {
    const historyList = document.getElementById('historyList');
    const history = JSON.parse(localStorage.getItem('history')) || [];
    historyList.innerHTML = '';  // Clear the current history list

    history.forEach(item => {
        const historyItem = document.createElement('div');
        historyItem.classList.add('p-4', 'border', 'border-gray-300', 'rounded-md', 'shadow-sm');
        historyItem.innerHTML = `
            <p><strong>Text:</strong> ${item.text}</p>
            <p><strong>Sentiment:</strong> <span style="color: ${item.sentiment === 'POSITIVE' ? 'green' : item.sentiment === 'NEGATIVE' ? 'red' : 'gray'}">${item.sentiment}</span></p>
            <p><strong>Impact:</strong> ${item.impact}</p>
            <p><strong>Keywords:</strong> ${item.keywords.join(', ')}</p>
            <p><small><strong>Time:</strong> ${new Date(item.timestamp).toLocaleString()}</small></p>
        `;
        historyList.appendChild(historyItem);
    });
}

// On page load, render the history from localStorage
window.onload = function() {
    renderHistory();
};
