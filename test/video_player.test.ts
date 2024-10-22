import { expect } from 'chai';
import { JSDOM } from 'jsdom';
import sinon from 'sinon'; // Import Sinon
import { VideoPlayer } from '../src/video_player/VideoPlayer';

describe('VideoPlayer', () => {
    let dom: JSDOM;
    let document: Document;
    let videoPlayer: VideoPlayer;

    beforeEach(() => {
        dom = new JSDOM(`
            <!DOCTYPE html>
            <html>
            <body>
                <video id="video"></video>
                <button id="playButton">Play</button>
                <button id="pauseButton">Pause</button>
                <button id="stopButton">Stop</button>
                <button id="loopButton">Toggle Loop</button>
            </body>
            </html>
        `);
        document = dom.window.document;
        videoPlayer = new VideoPlayer('video', 'playButton', 'pauseButton', 'stopButton', 'loopButton');
    });

    it('should play the video', () => {
        const playSpy = sinon.spy(videoPlayer['videoElement'], 'play');
        videoPlayer['playButton'].click();
        expect(playSpy.calledOnce).to.be.true;
    });

    it('should pause the video', () => {
        const pauseSpy = sinon.spy(videoPlayer['videoElement'], 'pause');
        videoPlayer['pauseButton'].click();
        expect(pauseSpy.calledOnce).to.be.true;
    });

    it('should stop the video', () => {
        const pauseSpy = sinon.spy(videoPlayer['videoElement'], 'pause');
        videoPlayer['videoElement'].currentTime = 10;
        videoPlayer['stopButton'].click();
        expect(pauseSpy.calledOnce).to.be.true;
        expect(videoPlayer['videoElement'].currentTime).to.equal(0);
    });

    it('should toggle loop', () => {
        videoPlayer['loopButton'].click();
        expect(videoPlayer['videoElement'].loop).to.be.true;
        videoPlayer['loopButton'].click();
        expect(videoPlayer['videoElement'].loop).to.be.false;
    });
});