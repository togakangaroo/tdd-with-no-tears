import { expect } from 'chai'
import { useFakeTimers } from 'sinon'

const createStopWatch = ({ setInterval, clearInterval, Date} = global) => {
    const createDisplays = (main, laps = []) => ({main, laps})
    let startTime
    let nextToggle
    let currentInterval = null

    const resume = () => {
        clearInterval(currentInterval)
        currentInterval = setInterval(() => {
            sw.displays.main = new Date() - startTime
        }, 10)
        nextToggle = pause
    }
    const pause = () => {
        clearInterval(currentInterval)
        nextToggle = resume
    }
    const start = () => {
        sw.displays = createDisplays(0)
        startTime = new Date()
        resume()
    }
    nextToggle = start

    const sw = {
        displays: createDisplays(null),
        toggle: () => nextToggle(),
        lap: () => {
            sw.displays.laps.push(sw.displays.main)
        },
        reset: () => {
            startTime = new Date()
            sw.displays = createDisplays(0, [])
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
        beforeEach(() => sw = createStopWatch(clock))

        const main_and_laps_should_display = (mainMs, lapMss) => {
            it(`shows ${null === mainMs ? `nothing` : toSec(mainMs) } on main display`, () =>
               expect(sw.displays.main).to.equal(mainMs))
            it(`shows ${!lapMss.length ? `no laps` : `laps: ${lapMss.map(toSec).join(` `)}`}`, () =>
               expect(sw.displays.laps).to.deep.equal(lapMss))
        }
        const elapses = (ms, inner) => {
            describe(`${toSec(ms)} elapses`, () => {
                beforeEach(() => clock.tick(ms))
                inner()
            })
        }

        main_and_laps_should_display(null, [])

        elapses(1000, () => {
            main_and_laps_should_display(null, [])
        })

        describe(`started`, () => {
            beforeEach(() => sw.toggle())
            main_and_laps_should_display(0, [])

            elapses(10000, () => {
                main_and_laps_should_display(10000, [])

                elapses(1000, () => {
                    main_and_laps_should_display(11000, [])
                })

                describe(`lap hit`, () => {
                    beforeEach(() => sw.lap())
                    main_and_laps_should_display(10000, [10000])

                    elapses(1000, () => {
                        main_and_laps_should_display(11000, [10000])

                        describe(`lap hit`, () => {
                            beforeEach(() => sw.lap())
                            main_and_laps_should_display(11000, [10000, 11000])

                            elapses(2000, () => {
                                main_and_laps_should_display(13000, [10000, 11000])
                            })

                            describe(`reset`, () => {
                                beforeEach(() => sw.reset())
                                main_and_laps_should_display(0, [])
                            })
                        })
                    })
                })

                describe(`reset`, () => {
                    beforeEach(() => sw.reset())
                    main_and_laps_should_display(0, [])

                    elapses(2000, () => {
                        main_and_laps_should_display(2000, [])
                    })
                })

                describe(`paused`, () => {
                    beforeEach(() => sw.toggle())
                    main_and_laps_should_display(10000, [])

                    elapses(2000, () => {
                        main_and_laps_should_display(10000, [])
                    })
                })
            })
        })
    })
})
