// Your OpenAI API key
const API_KEY = "<< YOUR API KEY HERE >>"; 
console.log('background loaded');

// Listen for a message from the content script
chrome.runtime.onMessage.addListener(function (message, sender, sendResponse) {
    console.log("background received:", message);
    // If the message is the selected text
    if (message.type === 'selectedText') {
        // Complete the text using the OpenAI Completions API
        fetch('https://api.openai.com/v1/completions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${API_KEY}`
            },
            body: JSON.stringify({
                "model": "text-davinci-003",
                "prompt": "Summarize the following text with a few full sentence bullet points. Uses dashes instead of bullets:\n\n" + message.text,
                "max_tokens": 250,
                "temperature": 0,
                "top_p": 1,
                "n": 1,
                "stream": false,
                "logprobs": null,
                "stop": ""

            })
        }).then(response => {
            console.log("got response: ", response);
            return response.json();
        }).then(data => {
            console.log("got data back: ", data);
            // Send a message to the content script containing the completed text
            chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
                if (data.choices[0].text) {
                    // chrome.tabs.sendMessage(tabs[0].id, { type: 'summarizedText', text: data.choices[0].text});
                    chrome.runtime.sendMessage(message = { type: 'summarizedText', text: data.choices[0].text.trimStart() });
                } else {
                    console.warn("invalid response received from openai")
                }
            });
        });
    }
});
