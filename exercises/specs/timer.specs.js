import { expect } from 'chai'

describe(`Given a stopwatch`, () => {
    let sw
    beforeEach(() => sw = createStopWatch())
    it(`shows nothing on main display`, () => expect(sw.displays.main).to.equal(null))
    it(`shows no laps`, () => expect(sw.displays.laps).to.deep.equal([]))
})
