import { expect } from 'chai'
import { useFakeTimers } from 'sinon'

const createStopWatch = () => {
    const createDisplays = (main, laps = []) => ({main, laps})
    const sw = {
        displays: createDisplays(null)
    }
    return sw
}

describe(`Stopwatch`, () => {
    let clock
    beforeEach(() => clock = useFakeTimers())
    afterEach(() => clock.restore())

    describe(`new instance`, () => {
        let sw
        beforeEach(() => sw = createStopWatch())
        it(`shows nothing on main display`, () => expect(sw.displays.main).to.equal(null))
        it(`shows no laps`, () => expect(sw.displays.laps).to.deep.equal([]))

        describe(`1s elapses`, () => {
            beforeEach(() => clock.tick(1000))
            it(`shows nothing on main display`, () => expect(sw.displays.main).to.equal(null))
            it(`shows no laps`, () => expect(sw.displays.laps).to.deep.equal([]))
        })

        describe(`started`, () => {
            beforeEach(() => sw.toggle())
            it(`shows 0s on main display`, () => expect(sw.displays.main).to.equal(0))
            it(`shows no laps`, () => expect(sw.displays.laps).to.deep.equal([]))
        })
    })
})
