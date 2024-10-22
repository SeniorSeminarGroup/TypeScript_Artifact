export class VideoPlayer {
    private videoElement: HTMLVideoElement;
    private playButton: HTMLButtonElement;
    private pauseButton: HTMLButtonElement;
    private stopButton: HTMLButtonElement;
    private loopButton: HTMLButtonElement;

    constructor(videoElementId: string, playButtonId: string, pauseButtonId: string, stopButtonId: string, loopButtonId: string) {
        this.videoElement = document.getElementById(videoElementId) as HTMLVideoElement;
        this.playButton = document.getElementById(playButtonId) as HTMLButtonElement;
        this.pauseButton = document.getElementById(pauseButtonId) as HTMLButtonElement;
        this.stopButton = document.getElementById(stopButtonId) as HTMLButtonElement;
        this.loopButton = document.getElementById(loopButtonId) as HTMLButtonElement; this.addEventListeners();
    }

    private addEventListeners(): void {
        this.playButton.addEventListener('click', () => this.playVideo());
        this.pauseButton.addEventListener('click', () => this.pauseVideo());
        this.stopButton.addEventListener('click', () => this.stopVideo());
        this.loopButton.addEventListener('click', () => this.toggleLoop());
    }

    private playVideo(): void {
        this.videoElement.play();
    }

    private pauseVideo(): void {
        this.videoElement.pause();
    }

    private stopVideo(): void {
        this.videoElement.pause();
        this.videoElement.currentTime = 0;
    }

    public loadVideo(videoPath: string): void {
        this.videoElement.src = videoPath;
        this.videoElement.load();
    }

    public toggleLoop(): void {
        this.videoElement.loop = !this.videoElement.loop;
    }
}