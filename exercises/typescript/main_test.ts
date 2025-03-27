import { describe, it, before } from "jsr:@std/testing/bdd"
import { assertEquals } from "@std/assert";

type StopWatch = {
    display: () => number | null
}

const createStopWatch = (): StopWatch  => {
    return {
        display: () => null
    }
}

describe(`Given a new stopwatch with a main and lap slot`, () => {
    let sw: StopWatch = null as any
    before(() => {sw = createStopWatch()})

    it(`reads empty`, () => assertEquals(sw.display(), null))
    describe(`When timer started`, () => {
        it(`reads 0`, () => assertEquals(sw.display(), 0))
    })
})
