var button;
var counter;

window.onload = () => {
	button = document.querySelector('button')

	button.onclick = async (event) => {
		if (button.innerText.toLowerCase() == 'start') {
			try {
				button.innerText = 'Stop';
				button.style.backgroundColor = 'red';
				localStorage.setItem('ytautoskipad_active', 'true')
			}
			catch (error) {
				errorElementGenerator("#container", error)
			}
		} else {
			try {
				button.innerText = 'Start';
				button.style.backgroundColor = 'dodgerblue';
				localStorage.setItem('ytautoskipad_active', 'false')

				await chrome.tabs.query({ active: true }, (tabs) => {
					tabs.forEach(tab => {
						chrome.scripting.executeScript({
							target: { tabId: tab.id },
							files: ["desactivate.js"]
						})
					})
				})
			}
			catch (error) {
				errorElementGenerator("#container", error)
			}
		}
	}

	if (localStorage.getItem('ytautoskipad_active') == 'true') {
		button.style.backgroundColor = 'red';
		button.innerText = 'Stop'
	}

	counter = document.querySelector('h1')
	counter.innerText = localStorage.getItem('ytauto_skipped_ads_count') || 0
}

chrome.runtime.onMessage.addListener(function(message, sender, sendResponse) {
	console.log('message received...')
	console.log(message)

	if (message.plusOne) {
		var adsSkipped = {}

		let count = localStorage.getItem('ytauto_skipped_ads_count')

		if (count == null) {
			localStorage.setItem('ytauto_skipped_ads_count', 1)
			adsSkipped.total = 1
		} else {
			adsSkipped.total = parseInt(count) + 1
			localStorage.setItem('ytauto_skipped_ads_count', adsSkipped.total)
		}

		counter.innerText = adsSkipped.total	
	}
})