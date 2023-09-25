// Initialize an object to keep track of open tabs
let openTabs = {};

// Function to update the openTabs array with the currently open tabs
function updateOpenTabs(callback) {
  chrome.tabs.query({}, (tabs) => {
    tabs.forEach((tab) => {
      addOpenTab(tab.id);
    });
    console.log("function updateOpenTabs");
    callback();
  });
}

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

// Function to get the length of openTabs and execute a callback
function getLengthOpenTabs(callback) {
  chrome.storage.local.get("openTabs", (result) => {
    // Assuming openTabs is stored in result.openTabs
    const openTabs = result.openTabs || {};
    const openTabsLength = Object.keys(openTabs).length;
    console.log("function getLengthOpenTabs:", openTabsLength);
    callback(openTabsLength);
  });
}

// Listen for the creation of a new tab
chrome.tabs.onCreated.addListener((tab) => {
  updateOpenTabs(() => {
    // Pass a callback to updateOpenTabs
    getLengthOpenTabs((lengthOpenTabs) => {
      console.log("anonymous function lengthOpenTabs: ", lengthOpenTabs);
      if (lengthOpenTabs > 5) {
        // If the limit is reached, close the newly created tab
        chrome.tabs.remove(tab.id);
        removeClosedTab(tab.id);
        console.log("lengthOpenTabs (" + lengthOpenTabs + ") > 5 - Removing " + tabId);
      } else {
        // If the limit is not reached, add the new tab's ID to the openTabs object
        console.log("lengthOpenTabs (" + lengthOpenTabs + ") < 5");
        addOpenTab(tab.id);
      }
    });
  });
});

// Listen for the removal of a tab
chrome.tabs.onRemoved.addListener((tabId) => {
  updateOpenTabs(() => {
    removeClosedTab(tabId);
    console.log("Removing Closed Tab " + tabId);
  });
});
