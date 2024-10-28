import { expect } from 'chai';
import { JSDOM } from 'jsdom';
import { setTimeLength } from '../src/index';

describe('break time checker', () => {
    let dom: JSDOM;
    let document: Document;
    let breakTimeLength = {hours: Number(), minutes: Number(), seconds: Number()}

    beforeEach(() => {
        
        
    });

    it('should set a break time of 2 hours', () => {
        dom = new JSDOM(`
            <!DOCTYPE html>
            <html>
            <body>
                <input type="number" id="break-length"/>
                <input type="number" id="work-length"/>
            </body>
            </html>
        `);
        document = dom.window.document;
        breakTimeLength = { hours: 0, minutes: 0, seconds: 0 };
        
        const breakInput = document.querySelector<HTMLInputElement>("#break-length");
        const workInput = document.querySelector<HTMLInputElement>("#work-length");
        breakInput!.value="120"
        workInput!.value="120"
        setTimeLength();
        expect(breakTimeLength).to.deep.equal({ hours: 2, minutes: 0, seconds: 0 });
    });

    // it('should set a work time of 30 minutes', () => {
    //     breakTime = 30;
    //     setTimeLength();
    //     expect(breakTimeLength).to.deep.equal({ hours: 0, minutes: 30, seconds: 0 });
    // });

    // it('should set a work time of 30 seconds', () => {
    //     breakTime = .5;
    //     setTimeLength();
    //     expect(breakTimeLength).to.deep.equal({ hours: 0, minutes: 0, seconds: 30 });
    // });
});