function autoSkipYtAd() {
	console.log(window.ytobserver)
	if (window.ytobserver) return;

	const videoContainer = document.querySelector('div[aria-label="Player de vídeo do YouTube"]')

	async function callback(mutationList, observer) {
		await new Promise(resolve => setTimeout(resolve, 6.5 * 1000))

		for (const mutation of mutationList) {
			if (mutation.type == 'childList') {
				const skipButton = document.querySelector('button[id*="skip-button"')
				skipButton?.click()

				chrome.runtime.sendMessage({
					plusOne: true,
				})
			}

		}
	}

	const observer = new MutationObserver(callback)

	observer.observe(videoContainer, {
		childList: true,
	})

	window.ytobserver = {
		observer,
	}
}

autoSkipYtAd()
console.log('skipper activated')