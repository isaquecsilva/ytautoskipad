if (window.sleep == undefined) {
	window.sleep = seconds => new Promise(resolve => setTimeout(resolve, 1000 * seconds))
}

if (window.ytautoskipadendpoint == undefined) {
	window.ytautoskipadendpoint = "https://www.youtube.com/watch"
}

function loadExtensionStorage() {
	return chrome.storage.local;
}

async function checkForSkippingAd(seconds) {
	console.log("skipper was called");
	var storage = loadExtensionStorage()
	var { ytautoskipad_active: state } = await storage.get(["ytautoskipad_active"])

	if (!state) {
		return;
	}

	while (true) {
		var {ytautoskipad_imediateskip: imediateState} = await storage.get(["ytautoskipad_imediateskip"]);
		let waitTime = imediateState ? 0 : 6
	
		const { href: url } = window.location;
		state = await storage.get(["ytautoskipad_active"])

		if (state.ytautoskipad_active != true) {
			console.log('stopping skipper...')
			break;
		}

		if (url.includes(window.ytautoskipadendpoint)) {
			const skipButton = document.querySelector('button[id*="skip-button"')

			if (skipButton) {
				console.log('wait_time', waitTime)

				if (waitTime) await window.sleep(waitTime)

				console.log('skipping...')
				skipButton?.click()
			}
			else console.log('skip button not found')
		}
		else {
			console.log('invalid_url', location?.href)
		}

		await window.sleep(seconds)
	}
}

checkForSkippingAd(1)