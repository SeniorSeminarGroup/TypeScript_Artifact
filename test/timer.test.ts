import { expect } from 'chai';
import { JSDOM } from 'jsdom';
import { Timer } from '../src/Timer';
import { setTimeLength,returnWorkInterval } from '../src/index'


describe('Task Management', () => {
    let dom: JSDOM;
    let document: Document;

    beforeEach(() => {
        dom = new JSDOM(`
            <!DOCTYPE html>
            <html>
            <body>
                <form id="breaks">
                    <input type="number" id="work-length" class="form-control m-0" placeholder="25" />
                    <input type="number" id="break-length" class="form-control m-0" placeholder="5" />
                </form>
            </body>
            </html>
        `);
        document = dom.window.document;

    });
    it('should calculate work time length correctly', () =>{
        const input = document.querySelector<HTMLInputElement>('#work-length');
        input!.value = '90';

        setTimeLength()
        const outMoreThanHour = returnWorkInterval();
        console.log(outMoreThanHour);

        const inputHalfHour = document.querySelector<HTMLInputElement>('#work-length');
        inputHalfHour!.value = '30';

        const inputLessThanMinute = document.querySelector<HTMLInputElement>('#work-length');
        inputLessThanMinute!.value = '.5';

        
        //expect(outMoreThanHour)

    })
    
});
