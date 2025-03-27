import { describe, it, before, after } from "jsr:@std/testing/bdd"
import { FakeTime } from 'https://deno.land/std/testing/time.ts'
import { assertEquals } from "@std/assert";

type StopWatch = {
    start: () => unknown
    display: () => number | null
}

const createStopWatch = (): StopWatch  => {
    let startTime: number | null = null
    return {
        start: () => startTime = Date.now(),
        display: () => !startTime ? null :(Date.now() - startTime) / 1000 
    }
}

describe(`Given a new stopwatch with a main and lap slot`, () => {
    let sw: StopWatch = null as any
    let time : FakeTime = null as any
    before(() => { time = new FakeTime() })
    after(() => {time[Symbol.dispose]()})
    before(() => {sw = createStopWatch()})

    it(`reads empty`, () => assertEquals(sw.display(), null))
    describe(`When timer started`, () => {
        before(() => { sw.start() })
        it(`reads 0`, () => assertEquals(sw.display(), 0))

        describe(`When 10s have passed`, () => {
            before(() => time.tick(10*1000))
            it(`displays 10s`, () => assertEquals(sw.display(), 10))
        })
    })
})
