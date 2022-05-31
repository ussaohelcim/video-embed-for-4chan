
chrome.runtime.onInstalled.addListener(()=>{})

chrome.tabs.onUpdated.addListener((id,info,tab)=>{
	if(info.status === 'complete'){
		chrome.scripting.executeScript({
			target:{tabId:id},
			func: init
		}).then((res)=>{
			console.log(tab.url)
        }).catch((err)=>{
			throw(err)
        })
	}
})

function init(){
	const config = getConfig()

	const replies = document.querySelectorAll(".postMessage")
	
	for (let replyIndex = 0; replyIndex < replies.length; replyIndex++) {
		const element = replies[replyIndex];
		let textLines = element.innerHTML.split("<br>")

		for (let lineIndex = 0; lineIndex < textLines.length; lineIndex++) {

			if(textLines[lineIndex].startsWith(config.protocol) ){
				for (const extension of config.extensions) {
					if(textLines[lineIndex].endsWith(extension)){
						addVideoToHTMLelement(element,textLines[lineIndex])
					}
				}
			}
		}
	}

	function addVideoToHTMLelement(element:Element,embedUrl:string)
	{
		let videoUrl = embedUrl.replace(config.protocol,"")

		if(videoUrl.includes("<wbr>")) videoUrl = videoUrl.replace("<wbr>","")

		console.log(videoUrl)
		console.log(embedUrl)

		const videoElement = document.createElement('video')
		const btn = document.createElement('button')
		btn.innerText = "Click to embed video."

		btn.addEventListener('click',()=>{

			videoElement.controls = true
			videoElement.muted = true
			videoElement.loop = true
			videoElement.autoplay = false
			videoElement.src = videoUrl
			
			element.innerHTML += "<br>"

			element.appendChild(videoElement)
		})
		
		element.innerHTML += "<br>"
		element.appendChild(btn)

	}

	function getConfig()
	{
		return {
			protocol:`embed://`,
			extensions: [".mp4",".webm",".avi"]
		}
	}
}
