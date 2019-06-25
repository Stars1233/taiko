const rewire = require('rewire');
const expect = require('chai').expect;
const domHandler = rewire('../../../lib/domHandler');

describe('domHandler', () => {
    let calledWith = {};

    beforeEach(() => {
        calledWith = {};
        domHandler.setDOM({
            getBoxModel: async (param) => {
                calledWith = param;
                if (param.nodeId == 1) {
                    return { model: { border: [0, 1, 2, 3, 4, 5, 6, 7] } };
                }
                return { model: { border: [8, 9, 10, 11, 12, 13, 14, 15] } };
            }
        });
    });

    it('.setDOM should set the browser as global var', () => {
        domHandler.setDOM(new Object('DOM Instance'));
        let br = domHandler.__get__('dom');
        expect(br).to.instanceof(Object);
        expect(br.toString()).to.eq('DOM Instance');
    });

    it('.boundBox should set the browser as global var', async () => {
        let box = await domHandler.boundBox(1);
        expect(calledWith).to.be.eql({ nodeId: 1 });
        expect(box).to.be.eql({ height: 6, width: 6, x: 0, y: 1 });
    });

    it('.boundingBoxCenter should get the center of a box', async () => {
        let center = await domHandler.boundingBoxCenter(1);
        expect(calledWith).to.be.eql({ nodeId: 1 });
        expect(center).to.be.eql({ x: 3, y: 4 });
    });

    it('.getBoundingClientRect should get the rectangle', async () => {
        let rect = await domHandler.getBoundingClientRect(1);
        expect(calledWith).to.be.eql({ nodeId: 1 });
        expect(rect).to.be.eql({ bottom: 7, top: 1, left: 0, right: 6 });
    });

    it('.getPositionalDifference should get the rectangle', async () => {
        let diff = await domHandler.getPositionalDifference(1, 2);
        expect(diff).to.be.eql(32);
    });

    it('.calculateNewCenter should get the rectangle', async () => {
        let center = await domHandler.calculateNewCenter(1, { up: 1, down: 2, left: 3, right: 4 });
        expect(center).to.be.eql({ newBoundary: {bottom:8, left:1, right:7, top:2}, x: 4, y: 5 });
    });


});
