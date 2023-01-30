import { parsePhoneNumberWithError } from 'libphonenumber-js';

// To be injected to the active tab
function contentCopy(text) {
  navigator.clipboard.writeText(text);
}

async function getWhatsAppLink(text) {
  const countryStruct = await chrome.storage.sync.get('country');
  const country = countryStruct.country || 'IL';
  const numberObject = parsePhoneNumberWithError(text, country);
  const number = numberObject.formatInternational().replace(/\D/g, '');
  const link = `https://wa.me/${number}`;
  return link;
}

function notify(title, message) {
  chrome.notifications.create({
    iconUrl: 'assets/img/128x128.png',
    type: 'basic',
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
  chrome.scripting.executeScript({
    target: { tabId: tab.id },
    func: contentCopy,
    args: [link],
  });
  notify(
    'Copied WhatsApp link',
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
  try {
    switch (source) {
      case 'copyLink':
        await copyLink(selection, tab);
        break;
      case 'openChat':
        await openTab(selection, tab);
        break;
      default:
        throw new Error(`Uknnown source tab ${source}`);
    }
  } catch (e) {
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

chrome.runtime.onInstalled.addListener(() => {
  setUpContextMenus();
});

chrome.contextMenus.onClicked.addListener(processClick);
