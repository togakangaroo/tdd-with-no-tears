import { describe, it, before } from "jsr:@std/testing/bdd"
import { assertEquals } from "@std/assert";

type StopWatch = {
    start: () => unknown
    display: () => number | null
}

const createStopWatch = (): StopWatch  => {
    let displayState: number | null = null
    return {
        start: () => displayState = 0,
        display: () => displayState,
    }
}

describe(`Given a new stopwatch with a main and lap slot`, () => {
    let sw: StopWatch = null as any
    before(() => {sw = createStopWatch()})

    it(`reads empty`, () => assertEquals(sw.display(), null))
    describe(`When timer started`, () => {
        before(() => { sw.start() })
        it(`reads 0`, () => assertEquals(sw.display(), 0))
    })
})
