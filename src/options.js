import { getCountries } from 'libphonenumber-js';

function saveOptions() {
  const selectedCountry = document.getElementById('country').value;
  chrome.storage.sync.set({
    country: selectedCountry,
  }, () => {
    // Update status to let user know options were saved.
    const status = document.getElementById('status');
    status.textContent = 'Options saved.';
    setTimeout(() => {
      status.textContent = '';
    }, 750);
  });
}

function restoreOptions() {
  const countrySelector = document.getElementById('country');
  getCountries().forEach((c) => {
    const opt = document.createElement('option');
    opt.value = c;
    opt.innerHTML = c;
    countrySelector.appendChild(opt);
  });
  chrome.storage.sync.get({
    country: 'IL',
  }, (items) => {
    document.getElementById('country').value = items.country;
  });
}
document.addEventListener('DOMContentLoaded', restoreOptions);
document.getElementById('save').addEventListener(
  'click',
  saveOptions,
);
