
import { expect } from 'chai';
import { add } from '../src/calculator';

describe('Calculator', () => {
    it('should add two numbers correctly', () => {
        expect(add(2, 3)).to.equal(5);
    });
});