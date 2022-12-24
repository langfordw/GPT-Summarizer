console.log("content script loaded")
// Listen for a message from the background script
chrome.runtime.onMessage.addListener(function(message, sender, sendResponse) {
    console.log("content received:",message)
    // If the message is a request to summarize the selected text
    if (message.type === 'summarize') {
      // Get the selected text
      var selectedText = window.getSelection().toString();
      console.log("content got selected text",selectedText)
      // Send a message to the background script containing the selected text
      chrome.runtime.sendMessage({ type: 'selectedText', text: selectedText });
    }
  });
  