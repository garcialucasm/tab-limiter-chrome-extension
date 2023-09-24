// Initialize an object to keep track of open tabs
let openTabs = {};

// Function to add an open tab to openTabs
function addOpenTab(tabId) {
  openTabs[tabId] = true;
  chrome.storage.local.set({ openTabs });
}

// Function to remove a closed tab from openTabs
function removeClosedTab(tabId) {
  delete openTabs[tabId];
  chrome.storage.local.set({ openTabs });
}

// Function to update the openTabs array with the currently open tabs
function updateOpenTabs() {
  chrome.tabs.query({}, (tabs) => {
    tabs.forEach((tab) => {
      addOpenTab(tab.id);
    });
  });
  console.log(openTabs);
}

// Load the open tabs from local storage on extension startup
chrome.storage.local.get("openTabs", (result) => {
  // Listen for the creation of a new tab
  chrome.tabs.onCreated.addListener((tab) => {
    updateOpenTabs();
    if (Object.keys(openTabs).length >= 5) {
      // If the limit is reached, close the newly created tab
      chrome.tabs.remove(tab.id);
    } else {
      // If the limit is not reached, add the new tab's ID to the openTabs object
      addOpenTab(tab.id);
    }
  });

  // Listen for the removal of a tab
  chrome.tabs.onRemoved.addListener((tabId) => {
    updateOpenTabs();
    removeClosedTab(tabId);
  });
});
