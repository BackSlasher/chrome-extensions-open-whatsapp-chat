import { parsePhoneNumberWithError, ParseError } from 'libphonenumber-js'


async function getWhatsAppLink(text) {
  const countryStruct = await chrome.storage.sync.get("country");
  const country = countryStruct ? countryStruct.country : "IL";
  console.log("aaaa", country);
  const numberObject = parsePhoneNumberWithError(text, country);
  const number = numberObject.formatInternational().replace(/\D/g, "");
  const link=`https://wa.me/${number}`;
  return link;
}

function notify(title, message) {
    chrome.notifications.create({
      iconUrl: "assets/img/128x128.png",
      type: "basic",
      title,
      message,
    });
}

function reportError(exception) {
  notify(
    "Can't create WhatsApp link",
    exception.message,
  );
}

async function copyLink(text, tab) {
  // Format as a whatsapp link
  const link = await getWhatsAppLink(text);
  // Ask the content.js in the tab to copy the text
  chrome.tabs.sendMessage(tab.id,
      {
          message: "copyText",
          textToCopy: link,
      }, function(response) {});
  notify(
    "Copied WhatsApp link",
    link,
  );
}

async function openTab(text, tab) {
  const link = await getWhatsAppLink(text);
  chrome.tabs.create({
    openerTabId: tab.id,
    url: link,
  });
}

async function processClick(info, tab) {
  const selection = info.selectionText;
  const source = info.menuItemId;
  try{
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
  catch (e) {
    reportError(e);
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
