chrome.tabs.onUpdated.addListener(async (tabId, changeInfo, tab) => {
	const [ currentTab ] = await chrome.tabs.query({active: true, currentWindow: true})

	try {
		const { host, pathname } = new URL(currentTab.url)
		if (host != 'www.youtube.com' && pathname != '/watch') {
			return
		}	
	}
	catch (error) {
		console.log('ytautoskipad error:', error.message)
		return;
	}
	
	
	if (currentTab.id == tab.id) {
		chrome.scripting.executeScript({
			target: { tabId: currentTab.id },
			files: ["ytautoskipad.js"]
		})
	}
})