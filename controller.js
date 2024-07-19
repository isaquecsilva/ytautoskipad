async function getCurrentTab() {
	const options = { active: true, lastFocusedWindow: true }
	const [tab]	= await chrome.tabs.query(options)
	return tab;
}

async function loadConfiguration() {
	let storage = await chrome.storage.local.get(["ytautoskipad_active", "ytautoskipad_imediateskip"])

	console.log(storage)

	if (storage && storage.ytautoskipad_active) {
		let button = document.querySelector('button')
		button.innerText = 'Stop'
		button.style.backgroundColor = 'red'
	}

	if (storage && storage.ytautoskipad_imediateskip == false) {
		let imediateSkip = document.querySelector('input[type=checkbox]')
		imediateSkip.checked = false;
	}
}

window.onload = loadConfiguration

const button = document.querySelector('button')
const imediateSkip = document.querySelector('input[type=checkbox]')

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

imediateSkip.onclick = async (event) => {
	let state = imediateSkip.checked;
	console.log('checkbox', state)

	await chrome.storage.local.set({
		ytautoskipad_imediateskip: state,
	})
}