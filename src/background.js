import parsePhoneNumber from 'libphonenumber-js'

function copyWhatsAppLink(text, tab) {
  // Format as a whatsapp link
  const numberObject = parsePhoneNumber(text,'IL');
  const number = numberObject.formatInternational().replace(/\D/g, "");
  const link=`https://wa.me/${number}`;
  // Ask the content.js in the tab to copy the text
  chrome.tabs.sendMessage(tab.id,
      {
          message: "copyText",
          textToCopy: link,
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
