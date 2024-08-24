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
		let {ytautoskipad_imediateskip: imediateState} = await storage.get(["ytautoskipad_imediateskip"]);
		let waitTime = imediateState ? 0 : 6

		const { href: url } = window.location;
		state = await storage.get(["ytautoskipad_active"])

		if (state.ytautoskipad_active != true) {
			console.log('stopping skipper...')
			break;
		}

		if (url.includes(window.ytautoskipadendpoint)) {
			// getting element that indicates an ad has started playing.
			const previewAdBtn = document.querySelector('div[id*="preview-ad"')

			if (previewAdBtn) {
				console.log('wait_time', waitTime)

				if (waitTime) await window.sleep(waitTime)

				console.log('skipping...')

				// as click on skip button are not working anymore, probably 
				// cause its an unstrusted click we acellerate the video ad.
				let video = document.querySelector('video')
				video.currentTime = video.duration;
			}
			else console.log('no ad')
		}
		else {
			console.log('invalid_url', location?.href)
		}

		await window.sleep(seconds)
	}
}

checkForSkippingAd(1)