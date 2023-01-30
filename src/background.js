function copyWhatsAppLink(text, tab) {
  // Format as a whatsapp link
  // TODO ensure number format is full
  const number = text;
  const canonicalNumber = number.replace(/\D/, "");
  https://wa.me/972523214583
  // Ask the content.js in the tab to copy the text
  chrome.tabs.sendMessage(tab.id,
      {
          message: "copyText",
          textToCopy: text,
      }, function(response) {})
}

function processClick(info, tab) {
  const selection = info.selectionText;
  const source = info.menuItemId;
  switch(source) {
    case "copyLink": 
      copyWhatsAppLink(selection, tab);
      break;
    default:
      throw new Error(`Uknnown source tab ${source}`);
  }
}

function setUpContextMenus() {
  // https://developer.chrome.com/docs/extensions/reference/contextMenus/#type-ItemType
  const f = chrome.contextMenus.create({
    title: 'Copy WhatsApp Link',
    type: 'normal',
    id: 'copyLink',
    contexts: ['selection'],
  });
}

chrome.runtime.onInstalled.addListener(function() {
  setUpContextMenus();
});

chrome.contextMenus.onClicked.addListener(processClick);
