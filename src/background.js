import { parsePhoneNumberWithError } from 'libphonenumber-js';

const brow = chrome || browser;

async function getWhatsAppLink(text) {
  const countryStruct = await brow.storage.sync.get('country');
  const country = countryStruct.country || 'IL';
  const numberObject = parsePhoneNumberWithError(text, country);
  const number = numberObject.formatInternational().replace(/\D/g, '');
  const link = `https://api.whatsapp.com/send?phone=${number}`;
  return link;
}

function notify(title, message) {
  brow.notifications.create({
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

async function openChat(text, tab) {
  const link = await getWhatsAppLink(text);
  brow.tabs.create({
    openerTabId: tab.id,
    url: link,
  });
}

async function processClick(info, tab) {
  const selection = info.selectionText;
  const source = info.menuItemId;
  try {
    switch (source) {
      case 'openChat':
        await openChat(selection, tab);
        break;
      default:
        throw new Error(`Uknnown action ${source}`);
    }
  } catch (e) {
    reportError(e);
  }
}

function setUpContextMenus() {
  brow.contextMenus.create({
    title: 'Open WhatsApp Chat',
    type: 'normal',
    id: 'openChat',
    contexts: ['selection'],
  });
}

const isFirefox = !chrome;

if (isFirefox) {
  setUpContextMenus();
  browser.contextMenus.onClicked.addListener(processClick);
} else {
  chrome.runtime.onInstalled.addListener(() => {
    setUpContextMenus();
  });
  chrome.contextMenus.onClicked.addListener(processClick);
}
