import { describe, it, beforeEach, afterEach } from "jsr:@std/testing/bdd";
import { FakeTime } from "https://deno.land/std/testing/time.ts";
import { assertEquals } from "@std/assert";

type StopWatch = {
  start: () => void;
  display: () => number | null;
  laps: () => number[];
  lap: () => void;
};

const secSince = (startTime: number) => (Date.now() - startTime) / 1000;

const createStopWatch = (): StopWatch => {
  let startTime: number | null = null;
  let laps: number[] = [];
  return {
    start: () => (startTime = Date.now()),
    display: () => (!startTime ? null : secSince(startTime)),
    laps: () => laps,
    lap: () => (laps = !startTime ? [] : [...laps, secSince(startTime)]),
  };
};

type Callback = () => void | Promise<void>;

describe(`Given a new stopwatch with a main and lap slot`, () => {
  let sw: StopWatch = null as any;
  let time: FakeTime = null as any;
  beforeEach(() => {
    time = new FakeTime();
  });
  afterEach(() => {
    time?.[Symbol.dispose]();
  });
  beforeEach(() => {
    sw = createStopWatch();
  });

  const displayShouldRead = (sec: number, laps: null | number[] = null) => {
    it(`displays ${sec}s`, () => assertEquals(sw.display(), sec));
    if (laps)
      it(
        !laps.length
          ? `there are no laps recorded`
          : `laps recorded are: ${laps.join()}`,
        () => assertEquals(sw.laps(), laps),
      );
  };

  const timePassed = (sec: number) => beforeEach(() => time.tick(sec * 1000));

  it(`reads empty`, () => assertEquals(sw.display(), null));

  describe(`when timer started`, () => {
    beforeEach(() => {
      sw.start();
    });
    displayShouldRead(0);

    describe(`when 10s have passed`, () => {
      timePassed(10);
      displayShouldRead(10, []);

      describe(`when 1s has passed`, () => {
        timePassed(1);
        displayShouldRead(11, []);
      });

      describe(`when lap hit`, () => {
        beforeEach(() => sw.lap());
        displayShouldRead(10, [10]);
      });
    });
  });
});
