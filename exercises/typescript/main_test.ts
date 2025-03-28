import { describe, it, beforeEach, afterEach } from "jsr:@std/testing/bdd";
import { FakeTime } from "https://deno.land/std/testing/time.ts";
import { assertEquals } from "@std/assert";

type StopWatch = {
  start: () => void;
  stop: () => void;
  display: () => number | null;
  laps: () => number[];
  lap: () => void;
  reset: () => void;
};

const createStopWatch = (): StopWatch => {
  let startTime: number | null = null;
  let laps: number[] = [];

  let timeToOffset = 0;
  let pausedAt = null as null | number;

  const elapsed = () => {
    if (startTime === null) return null;
    let until: number = pausedAt === null ? Date.now() : pausedAt;
    return (until - startTime - timeToOffset) / 1000;
  };
  const reset = () => {
    startTime = Date.now();
    timeToOffset = 0;
    pausedAt = null;
    laps = [];
  };
  const resume = () => {
    if (pausedAt === null) return;
    timeToOffset += Date.now() - pausedAt;
    pausedAt = null;
  };
  const sw = {
    start: () => {
      reset();
      sw.start = resume;
    },
    stop: () => {
      pausedAt = Date.now();
    },
    display: () => (!startTime ? null : elapsed()),
    laps: () => laps,
    lap: () => {
      const currentElapsed = elapsed();
      if (null === currentElapsed) return;
      laps = !startTime ? [] : [...laps, currentElapsed];
    },
    reset,
  };
  return sw;
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

      describe(`when reset hit`, () => {
        beforeEach(() => sw.reset());
        displayShouldRead(0, []);
      });

      describe(`when stopped`, () => {
        beforeEach(() => sw.stop());
        displayShouldRead(10, []);
        timePassed(2, () => {
          displayShouldRead(10, []);
          describe(`restarted`, () => {
            beforeEach(() => sw.start());
            displayShouldRead(10, []);
            timePassed(2, () => displayShouldRead(12, []));
          });
        });
      });
    });
  });
});
