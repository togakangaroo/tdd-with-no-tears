import { describe, it, beforeEach, afterEach } from "jsr:@std/testing/bdd"
import { FakeTime } from 'https://deno.land/std/testing/time.ts'
import { assertEquals } from "@std/assert";

type StopWatch = {
    start: () => void
    display: () => number | null
    laps: () => number[]
    lap: () => void
}

const secSince = (startTime: number) => (Date.now() - startTime) / 1000

const createStopWatch = (): StopWatch  => {
    let startTime: number | null = null
    let laps: number[] = []
    return {
        start: () => startTime = Date.now(),
        display: () => !startTime ? null : secSince(startTime),
        laps: () => laps,
        lap: () => laps = !startTime ? [] : [...laps, secSince(startTime)],
    }
}


describe(`Given a new stopwatch with a main and lap slot`, () => {
    let sw: StopWatch = null as any
    let time : FakeTime = null as any
    beforeEach(() => { time = new FakeTime() })
    afterEach(() => {time?.[Symbol.dispose]()})
    beforeEach(() => {sw = createStopWatch()})

    const displayShouldRead = (sec: number) =>
        it(`displays ${sec}s`, () => assertEquals(sw.display(), sec))

    it(`reads empty`, () => assertEquals(sw.display(), null))

    describe(`when timer started`, () => {
        beforeEach(() => { sw.start() })
        displayShouldRead(0)

        describe(`when 10s have passed`, () => {
            beforeEach(() => time.tick(10 * 1000))
            displayShouldRead(10)
            it(`There are no laps recorded`, () => assertEquals(sw.laps(), []))

            describe(`when 1s has passed`, () => {
                beforeEach(() => time.tick(1*1000))
                displayShouldRead(11)
                it(`There are no laps recorded`, () => assertEquals(sw.laps(), []))
            })

            describe(`when lap hit`, () => {
                beforeEach(() => sw.lap())
                displayShouldRead(10)
                it(`Shows laps of 10s`, () => assertEquals(sw.laps(), [10]))
            })

        })
    })
})
