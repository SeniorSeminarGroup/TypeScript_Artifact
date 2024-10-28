import { expect } from 'chai';
import { JSDOM } from 'jsdom';
import { setTimeLength, returnWorkInterval } from '../src/index';
import { formatTime, toSeconds, fromSeconds, TimeInterval } from '../src/TimeInterval';
import { Timer } from '../src/Timer';

describe('Timer functionality', () => {
    let dom: JSDOM;
    let document: Document;
    let newTimer: Timer;
    let clock: HTMLSpanElement | null;

    beforeEach(() => {
        dom = new JSDOM(`
            <!DOCTYPE html>
            <html>
            <body>
                <input type="number" id="break-length"/>
                <input type="number" id="work-length"/>
                <span id="clock-time"></span>
                <canvas id="timerCanvas"></canvas>
            </body>
            </html>
        `);
        document = dom.window.document;
        global.document = document;

        // Mock the getContext method of the canvas element
        const canvas = document.querySelector<HTMLCanvasElement>('#timerCanvas');
        if (canvas) {
            canvas.getContext = ((contextId: string) => {
                if (contextId === '2d') {
                    return {
                        fillRect: () => {},
                        clearRect: () => {},
                        getImageData: (x: number, y: number, w: number, h: number) => {
                            return {
                                data: new Array(w * h * 4)
                            };
                        },
                        putImageData: () => {},
                        createImageData: () => [],
                        setTransform: () => {},
                        drawImage: () => {},
                        save: () => {},
                        fillText: () => {},
                        restore: () => {},
                        beginPath: () => {},
                        moveTo: () => {},
                        lineTo: () => {},
                        closePath: () => {},
                        stroke: () => {},
                        translate: () => {},
                        scale: () => {},
                        rotate: () => {},
                        arc: () => {},
                        fill: () => {},
                        measureText: () => {
                            return { width: 0 };
                        },
                        transform: () => {},
                        rect: () => {},
                        clip: () => {},
                        canvas: canvas,
                        getContextAttributes: () => ({}),
                        globalAlpha: 1.0,
                        globalCompositeOperation: 'source-over',
                        imageSmoothingEnabled: true,
                        imageSmoothingQuality: 'low',
                        lineCap: 'butt',
                        lineDashOffset: 0.0,
                        lineJoin: 'miter',
                        lineWidth: 1.0,
                        miterLimit: 10.0,
                        shadowBlur: 0,
                        shadowColor: 'rgba(0, 0, 0, 0)',
                        shadowOffsetX: 0,
                        shadowOffsetY: 0,
                        strokeStyle: '#000000',
                        textAlign: 'start',
                        textBaseline: 'alphabetic',
                        direction: 'inherit',
                        font: '10px sans-serif',
                        fillStyle: '#000000',
                        filter: 'none',
                        createLinearGradient: () => ({}),
                        createPattern: () => null,
                        createRadialGradient: () => ({}),
                        getLineDash: () => [],
                        setLineDash: () => {},
                        clearShadow: () => {},
                        drawFocusIfNeeded: () => {},
                        isPointInPath: () => false,
                        isPointInStroke: () => false,
                        resetTransform: () => {},
                        scrollPathIntoView: () => {},
                    } as unknown as CanvasRenderingContext2D;
                }
                return null;
            }) as HTMLCanvasElement['getContext'];
        }

        // Initialize newTimer and clock
        clock = document.querySelector<HTMLSpanElement>('#clock-time');
        const newWorkTime: TimeInterval = returnWorkInterval(document);
        const newBreakTime: TimeInterval = { hours: 0, minutes: 1, seconds: 0 };
        newTimer = new Timer(newWorkTime, newBreakTime, clock!, () => {}, canvas!);

        // Mock the global newTimer and clock variables
        (global as any).newTimer = newTimer;
        (global as any).clock = clock;
    });

    it('should set a break time of 2 hours', () => {
        const breakInput = document.querySelector<HTMLInputElement>("#break-length");
        const workInput = document.querySelector<HTMLInputElement>("#work-length");
        breakInput!.value = "120";
        workInput!.value = "120";
        const { breakTimeLength } = setTimeLength(document)!;
        expect(breakTimeLength).to.deep.equal({ hours: 2, minutes: 0, seconds: 0 });
    });

    it('should set a break time of 30 minutes', () => {
        const breakInput = document.querySelector<HTMLInputElement>("#break-length");
        breakInput!.value = "30";
        const { breakTimeLength } = setTimeLength(document)!;
        expect(breakTimeLength).to.deep.equal({ hours: 0, minutes: 30, seconds: 0 });
    });

    it('should set a break time of 30 seconds', () => {
        const breakInput = document.querySelector<HTMLInputElement>("#break-length");
        breakInput!.value = "0.5";
        const { breakTimeLength } = setTimeLength(document)!;
        expect(breakTimeLength).to.deep.equal({ hours: 0, minutes: 0, seconds: 30 });
    });

    it('should format time correctly', () => {
        const time: TimeInterval = { hours: 1, minutes: 5, seconds: 9 };
        const formattedTime = formatTime(time);
        expect(formattedTime).to.equal('01:05:09');
    });

    it('should convert TimeInterval to seconds correctly', () => {
        const time: TimeInterval = { hours: 1, minutes: 1, seconds: 1 };
        const seconds = toSeconds(time);
        expect(seconds).to.equal(3661);
    });

    it('should convert seconds to TimeInterval correctly', () => {
        const totalSeconds = 3661;
        const time = fromSeconds(totalSeconds);
        expect(time).to.deep.equal({ hours: 1, minutes: 1, seconds: 1 });
    });

    it('should update clock display correctly', () => {
        const clock = document.querySelector<HTMLSpanElement>('#clock-time');
        const time: TimeInterval = { hours: 0, minutes: 1, seconds: 30 };
        clock!.innerHTML = formatTime(time);
        expect(clock!.innerHTML).to.equal('00:01:30');
    });
});