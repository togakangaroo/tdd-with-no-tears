import { describe, it, beforeEach, afterEach } from "jsr:@std/testing/bdd";
import { FakeTime } from "https://deno.land/std/testing/time.ts";
import { assertEquals } from "@std/assert";

type StopWatch = {
  start: () => void;
  display: () => number | null;
  laps: () => number[];
  lap: () => void;
  reset: () => void;
};

const secSince = (startTime: number) => (Date.now() - startTime) / 1000;

const createStopWatch = (): StopWatch => {
  let startTime: number | null = null;
  let laps: number[] = [];
  const reset = () => {
    startTime = Date.now();
    laps = [];
  };
  return {
    start: reset,
    display: () => (!startTime ? null : secSince(startTime)),
    laps: () => laps,
    lap: () => (laps = !startTime ? [] : [...laps, secSince(startTime)]),
    reset,
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

  const timePassed = (sec: number, nested: Callback) =>
    describe(`when {sec}s have passed`, () => {
      beforeEach(() => time.tick(sec * 1000));
      nested();
    });

  it(`reads empty`, () => assertEquals(sw.display(), null));

  describe(`when timer started`, () => {
    beforeEach(() => {
      sw.start();
    });
    displayShouldRead(0);

    timePassed(10, () => {
      displayShouldRead(10, []);

      timePassed(1, () => {
        displayShouldRead(11, []);
      });

      describe(`when lap hit`, () => {
        beforeEach(() => sw.lap());
        displayShouldRead(10, [10]);

        timePassed(1, () => {
          displayShouldRead(11, [10]);

          describe(`when lap hit`, () => {
            beforeEach(() => sw.lap());
            displayShouldRead(11, [10, 11]);
            timePassed(2, () => displayShouldRead(13, [10, 11]));
          });
          describe(`when reset hit`, () => {
            beforeEach(() => sw.reset());
            displayShouldRead(0, []);
          });
        });
      });
    });
  });
});
