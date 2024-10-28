import { expect } from 'chai';
import { JSDOM } from 'jsdom';
import { setTimeLength } from '../src/index';

describe('break time checker', () => {
    let dom: JSDOM;
    let document: Document;
    let breakTime: number;
    let breakTimeLength = {hours: Number(), minutes: Number(), seconds: Number()}

    beforeEach(() => {
        dom = new JSDOM(`
            <!DOCTYPE html>
            <html>
            <body>
                <input type="number" id="break-length"/>
            </body>
            </html>
        `);
        document = dom.window.document;

        breakTimeLength = { hours: 0, minutes: 0, seconds: 0 };
        breakTime = Number(document.querySelector<HTMLInputElement>("#break-length")?.value) 
    });

    it('should set a break time of 2 hours', () => {
        breakTime = 120;
        setTimeLength();
        expect(breakTimeLength).to.deep.equal({ hours: 2, minutes: 0, seconds: 0 });
    });

    it('should set a work time of 30 minutes', () => {
        breakTime = 30;
        setTimeLength();
        expect(breakTimeLength).to.deep.equal({ hours: 0, minutes: 30, seconds: 0 });
    });

    it('should set a work time of 30 seconds', () => {
        breakTime = .5;
        setTimeLength();
        expect(breakTimeLength).to.deep.equal({ hours: 0, minutes: 0, seconds: 30 });
    });
});



