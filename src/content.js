// Works around the fact we can't hit the clipboard from background workers

chrome.runtime.onMessage.addListener( // this is the message listener
    function(request, sender, sendResponse) {
        if (request.message === "copyText") {
            copyToTheClipboard(request.textToCopy);
            sendResponse();
        }
    }
);

async function copyToTheClipboard(textToCopy){
    navigator.clipboard.writeText(textToCopy);
}

