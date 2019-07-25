import { expect } from 'chai'
import { useFakeTimers } from 'sinon'

const createStopWatch = () => {
    const createDisplays = (main, laps = []) => ({main, laps})
    let startTime
    const sw = {
        displays: createDisplays(null),
        toggle: () => {
            sw.displays = createDisplays(0)
            startTime = new Date()
            setInterval(() => {
                sw.displays.main = new Date() - startTime
            }, 10)
        },
    }
    return sw
}

const toSec = ms => `${ms/1000}s`

describe(`Stopwatch`, () => {
    let clock
    beforeEach(() => clock = useFakeTimers())
    afterEach(() => clock.restore())

    describe(`new instance`, () => {
        let sw
        beforeEach(() => sw = createStopWatch())

        const main_and_laps_should_display = (mainMs, lapMss) => {
            it(`shows ${null === mainMs ? `nothing` : toSec(mainMs) } on main display`, () =>
               expect(sw.displays.main).to.equal(mainMs))
            it(`shows ${!lapMss.length ? `no laps` : lapMss.map(toSec)}`, () =>
               expect(sw.displays.laps).to.deep.equal(lapMss))
        }

        main_and_laps_should_display(null, [])

        describe(`1s elapses`, () => {
            beforeEach(() => clock.tick(1000))
            main_and_laps_should_display(null, [])
        })

        describe(`started`, () => {
            beforeEach(() => sw.toggle())
            main_and_laps_should_display(0, [])

            describe(`10s elsapses`, () => {
                beforeEach(() => clock.tick(10000))
                main_and_laps_should_display(10000, [])

                describe(`1s elapses`, () => {
                    beforeEach(() => clock.tick(1000))
                    main_and_laps_should_display(11000, [])
                })
            })
        })
    })
})
