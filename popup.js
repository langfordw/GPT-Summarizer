console.log('popup loaded')
// Set the width of the popup window to a fixed value
// window.innerWidth = 500;

document.getElementById('summarize-button').addEventListener('click', function () {

    // Show the loading animation
    document.getElementById('loading').style.display = 'block';
    document.getElementById('spinner').classList.add('visible');

    // Send a message to the content script requesting the rephrasing of the selected text
    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
        chrome.tabs.sendMessage(tabs[0].id, { type: 'summarize' });
    });

});

// Listen for a message from the background script
chrome.runtime.onMessage.addListener(function (message, sender, sendResponse) {
    console.log("popup received:", message);
    // If the message is the summarized text
    if (message.type === 'summarizedText') {
        // Update the output element with the rendered HTML
        document.getElementById('output').innerHTML = message.text;
        document.getElementById('copyButton').classList.add('visible');
        document.getElementById('output').classList.add('visible');

        // Hide the loading animation
        document.getElementById('loading').style.display = 'none';
        document.getElementById('spinner').classList.remove('visible');
    }
});

// Get the copy button and the summary element
const copyButton = document.getElementById('copyButton');
const summaryElement = document.getElementById('output');

// Add an event listener for the click event on the copy button
copyButton.addEventListener('click', function () {
    // Select the contents of the summary textarea
    // summaryElement.innherHTML().select();
    summaryElement

    // Copy the selected text to the clipboard using the Clipboard API
    navigator.clipboard.writeText(summaryElement.innerHTML)
        .then(function () {
            console.log('Summary copied to clipboard');
        })
        .catch(function (error) {
            console.error('Error copying summary to clipboard:', error);
        });
});