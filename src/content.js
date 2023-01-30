// Works around the fact we can't hit the clipboard from background workers

async function copyToTheClipboard(textToCopy) {
  navigator.clipboard.writeText(textToCopy);
}

chrome.runtime.onMessage.addListener( // this is the message listener
  (request, sender, sendResponse) => {
    if (request.message === 'copyText') {
      copyToTheClipboard(request.textToCopy);
      sendResponse();
    }
  },
);
