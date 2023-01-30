import { parsePhoneNumberWithError, ParseError } from 'libphonenumber-js'


async function getWhatsAppLink(text) {
  const country = await chrome.storage.sync.get("country");
  const numberObject = parsePhoneNumberWithError(text, country);
  const number = numberObject.formatInternational().replace(/\D/g, "");
  const link=`https://wa.me/${number}`;
  return link;
}

async function copyLink(text, tab) {
  // Format as a whatsapp link
  try {
    const link = await getWhatsAppLink(text);
  } catch (e) {
    chrome.notifications.create({
      iconUrl: "assets/img/128x128.png",
      type: "basic",
      title: "Can't create WhatsApp link",
      message: e.message,
    });
    return;
  }
  // Ask the content.js in the tab to copy the text
  chrome.tabs.sendMessage(tab.id,
      {
          message: "copyText",
          textToCopy: link,
      }, function(response) {})
}

async function openTab(text, tab) {
  try {
    const link = await getWhatsAppLink(text);
  } catch (e) {
    // TODO complete
  }
  chrome.tabs.create({
    openerTabId: tab.id,
    url: link,
  });
}

async function processClick(info, tab) {
  const selection = info.selectionText;
  const source = info.menuItemId;
  switch(source) {
    case "copyLink": 
      await copyLink(selection, tab);
      break;
    case "openChat": 
      await openTab(selection, tab);
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
