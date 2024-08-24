async function getCurrentTab() {
	const options = { active: true, lastFocusedWindow: true }
	console.log(chrome)
	const [tab]	= await chrome.tabs.query(options)
	return tab;
}

async function loadConfiguration() {
	let storage = await chrome.storage.local.get(["ytautoskipad_active", "ytautoskipad_imediateskip"])

	if (storage && storage?.ytautoskipad_active) {
		let button = document.querySelector('button')
		await startOp(button)
	}

	// defining checkbox state based on storage.ytautoskipad_imediateskip
	let imediateSkip = document.querySelector('input[type=checkbox]')
	imediateSkip.checked = storage?.ytautoskipad_imediateskip || false;
}

window.onload = loadConfiguration

const button = document.querySelector('button')
const imediateSkip = document.querySelector('input[type=checkbox]')

button.onclick = async event => {
	const el = event.target;
	switch (el.innerText.toLowerCase()) {
		case "start":
			await startOp(el)
			break;
		case "stop":
			await stopOp(el)
			break;
	}
}

imediateSkip.onclick = async (event) => {
	await updateImediateSkip()
}

async function startOp(el) {
	el.innerText = "Stop"
	el.style.backgroundColor = 'red'
	await chrome.storage.local.set({ytautoskipad_active: true})

	const tab = await getCurrentTab()

	chrome.scripting.executeScript({
		target: { tabId: tab.id },
		files: ["skipper.js"]
	})
	.then(() => console.log('skipper called'))
}

async function stopOp(el) {
	el.innerText = "Start"
	el.style.backgroundColor = 'dodgerblue'
	await chrome.storage.local.set({ytautoskipad_active: false})
}

async function updateImediateSkip() {
	let state = imediateSkip.checked;
	console.log('checkbox', state)

	await chrome.storage.local.set({
		ytautoskipad_imediateskip: state,
	})
}