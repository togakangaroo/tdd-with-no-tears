import { describe, it, before, after } from "jsr:@std/testing/bdd"
import { FakeTime } from 'https://deno.land/std/testing/time.ts'
import { assertEquals } from "@std/assert";

type StopWatch = {
    start: () => unknown
    display: () => number | null
    laps: () => number[]
}

const createStopWatch = (): StopWatch  => {
    let startTime: number | null = null
    return {
        start: () => startTime = Date.now(),
        display: () => !startTime ? null :(Date.now() - startTime) / 1000,
        laps: () => []
    }
}


describe(`Given a new stopwatch with a main and lap slot`, () => {
    let sw: StopWatch = null as any
    let time : FakeTime = null as any
    before(() => { time = new FakeTime() })
    after(() => {time?.[Symbol.dispose]()})
    before(() => {sw = createStopWatch()})

    const displayShouldRead = (sec: number) =>
        it(`displays ${sec}s`, () => assertEquals(sw.display(), sec))

    it(`reads empty`, () => assertEquals(sw.display(), null))
    describe(`When timer started`, () => {
        before(() => { sw.start() })
        displayShouldRead(0)

        describe(`When 10s have passed`, () => {
            before(() => time.tick(10*1000))
            displayShouldRead(10)
            it(`There are no laps recorded`, () => assertEquals(sw.laps(), []))
        })
    })
})
