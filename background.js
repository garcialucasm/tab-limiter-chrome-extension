// Initialize an array to keep track of open tabs
let openTabs = [];

// Listen for the creation of a new tab
chrome.tabs.onCreated.addListener((tab) => {
  // Check if the number of open tabs has reached the limit (5)
  if (openTabs.length >= 5) {
    // If the limit is reached, close the newly created tab
    chrome.tabs.remove(tab.id);
  } else {
    // If the limit is not reached, add the new tab's ID to the openTabs array
    openTabs.push(tab.id);
  }
});
// Listen for the removal of a tab
chrome.tabs.onRemoved.addListener((tabId) => {
  // Remove the closed tab's ID from the openTabs array
  openTabs = openTabs.filter((id) => id !== tabId);
});
