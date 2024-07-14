async function getCurrentTab() {
	const options = { active: true, lastFocusedWindow: true }
	const [tab]	= await chrome.tabs.query(options)
	return tab;
}

async function loadConfiguration() {
	let storage = await chrome.storage.local.get(["ytautoskipad_active"])

	if (storage && storage.ytautoskipad_active) {
		let button = document.querySelector('button')
		button.innerText = 'Stop'
		button.style.backgroundColor = 'red'
	}
}

window.onload = loadConfiguration

const button = document.querySelector('button')

button.onclick = async (event) => {
	const el = event.target;
	switch (el.innerText.toLowerCase()) {
		case "start":
			el.innerText = "Stop"
			el.style.backgroundColor = 'red'
			await chrome.storage.local.set({ytautoskipad_active: true})

			const tab = await getCurrentTab()

			chrome.scripting.executeScript({
				target: { tabId: tab.id },
				files: ["skipper.js"]
			})
			.then(() => console.log('skipper called'))
			break;
		case "stop":
			el.innerText = "Start"
			el.style.backgroundColor = 'dodgerblue'
			await chrome.storage.local.set({ytautoskipad_active: false})
			break;
	}
}
