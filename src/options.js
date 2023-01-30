function save_options() {
  var selectedCountry = document.getElementById('country').value;
  console.log("fffff", selectedCountry);
  chrome.storage.sync.set({
    country: selectedCountry,
  }, function() {
    // Update status to let user know options were saved.
    var status = document.getElementById('status');
    status.textContent = 'Options saved.';
    setTimeout(function() {
      status.textContent = '';
    }, 750);
  });
}

function restore_options() {
  chrome.storage.sync.get({
    country: 'IL',
  }, function(items) {
    document.getElementById('country').value = items.country;
  });
}
document.addEventListener('DOMContentLoaded', restore_options);
document.getElementById('save').addEventListener('click',
    save_options);
