export default class AudioManager {
	constructor() {
		this._list = [];
		this._appPath = this.__proto__.appPath;
	}

	add(name, path, volume = 100, isRepeating = false) {
		this._list.push({
			name: name,
			path: this._appPath + path,
			volume: volume/100,
			isRepeating: isRepeating,
			audio: new Audio()
		});
		const lastAudio = this._list[this._list.length-1];

		lastAudio.audio.src = lastAudio.path;
		lastAudio.audio.load();

		lastAudio.audio.addEventListener("ended", () => {
			if(lastAudio.isRepeating) {
				lastAudio.audio.currentTime = 0;
				lastAudio.audio.play();
			}
		}, false);
	}

	playAudio(name) {
		const selectedAudio = this._list[this._list.findIndex(e => e.name === name)].audio;

        selectedAudio.volume = this._list[this._list.findIndex(e => e.name === name)].volume;
		selectedAudio.play();
	}

	pauseAudio(name) {
		this._list[this._list.findIndex(e => e.name === name)].audio.pause();
	}

	stopAudio(name) {
		this._list[this._list.findIndex(e => e.name === name)].audio.pause();
		this._list[this._list.findIndex(e => e.name === name)].audio.currentTime = 0;
	}

	getAudioByName(name) {
		return this._list[this._list.findIndex(e => e.name === name)];
    }
    
    get list() { return this._list }
}