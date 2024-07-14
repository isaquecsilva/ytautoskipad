async function onBrowserLoad() {
	const [tab] = await chrome.tabs.query({
		active: true
	})

	chrome.scripting.executeScript({
		target: {tabId: tab.id},
		files: ["skipper.js"]
	})
}

onBrowserLoad()