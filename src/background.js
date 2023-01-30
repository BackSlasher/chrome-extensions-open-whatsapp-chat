import parsePhoneNumber from 'libphonenumber-js'

function getWhatsAppLink(text) {
  const numberObject = parsePhoneNumber(text,'IL');
  const number = numberObject.formatInternational().replace(/\D/g, "");
  const link=`https://wa.me/${number}`;
  return link;
}

function copyLink(text, tab) {
  // Format as a whatsapp link
  const link = getWhatsAppLink(text);
  // Ask the content.js in the tab to copy the text
  chrome.tabs.sendMessage(tab.id,
      {
          message: "copyText",
          textToCopy: link,
      }, function(response) {})
}

function openTab(text, tab) {
  const link = getWhatsAppLink(text);
  chrome.tabs.create({
    openerTabId: tab.id,
    url: link,
  });
}

function processClick(info, tab) {
  const selection = info.selectionText;
  const source = info.menuItemId;
  switch(source) {
    case "copyLink": 
      copyLink(selection, tab);
      break;
    case "openChat": 
      openTab(selection, tab);
      break;
    default:
      throw new Error(`Uknnown source tab ${source}`);
  }
}

function setUpContextMenus() {
  chrome.contextMenus.create({
    title: 'Copy WhatsApp Link',
    type: 'normal',
    id: 'copyLink',
    contexts: ['selection'],
  });
  chrome.contextMenus.create({
    title: 'Open WhatsApp Chat',
    type: 'normal',
    id: 'openChat',
    contexts: ['selection'],
  });
}

chrome.runtime.onInstalled.addListener(function() {
  setUpContextMenus();
});

chrome.contextMenus.onClicked.addListener(processClick);
