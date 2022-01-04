javascript:(
	async function downloadPlayingVideo() {
		function lastVideo(){
			let videos = document.querySelectorAll("video");
			return videos[videos.length - 1];
		}
		async function download(href, fileName){
			try {
				const resp = await fetch(href);
				const blob = await resp.blob();
				const url = window.URL.createObjectURL(blob);
				const a = document.createElement('a');
				a.style.display = 'none';
				a.href = url;
				a.download = `${fileName}.mp4`;
				document.body.appendChild(a);
				a.click();
				a.remove();
				window.URL.revokeObjectURL(url);
			} catch (e) {
				return alert('oh no!');
			}
		}
		let video = lastVideo();
		let post = video.parentElement.parentElement.parentElement.parentElement.parentElement.parentElement;
		let posterName = post.querySelector("[data-e2e=video-author-uniqueid]").innerText;
		await download(video.src, posterName);
	}()
)
