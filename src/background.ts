// Open the side panel when the extension button is clicked
chrome.sidePanel
  .setPanelBehavior({ openPanelOnActionClick: true })
  .catch(console.error)

// Add context menu item to open the side panel
chrome.runtime.onInstalled.addListener(function () {
  chrome.contextMenus.create({
    id: 'openSidePanel',
    title: 'Open side panel',
    contexts: ['all']
  })
})

// Open the side panel when the context menu item is clicked
chrome.contextMenus.onClicked.addListener(function (info, tab) {
  if (info.menuItemId === 'openSidePanel' && tab !== undefined) {
    chrome.sidePanel.open({ windowId: tab.windowId }).catch(console.error)
  }
})
