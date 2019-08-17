using System;
using System.Linq;
using System.Collections.Generic;
using Xunit;
using Xbehave;

using static Xunit.Assert;

namespace Stopwatch.Tests {

    public class Stopwatch {
        public TimeSpan? MainDisplay { get; private set; }
        public IEnumerable<TimeSpan> LapsDisplays => this.lapsDisplays;

        public void Lap() => ifStarted(() => {
                this.lapsDisplays.Add(this.MainDisplay.Value);
            });
        public void RecordTime(DateTime dt) => ifStarted(() => {
                this.currentTime = dt;
                if(this.stoppedAt == null)
                    this.MainDisplay = this.currentTime.Value.Subtract(this.startTime);
            });
        public void Toggle() => this.nextToggle();
        public void Reset() => ifStarted(() => {
                this.startTime = this.startTime.Add(this.MainDisplay.Value);
                if(this.stoppedAt != null)
                    this.stoppedAt = this.startTime;
                this.MainDisplay = new TimeSpan(0);
                this.lapsDisplays.Clear();
            });
        public Stopwatch(DateTime? startTime) {
            this.startTime = startTime ?? DateTime.UtcNow;
            this.nextToggle = this.initialize;
        }

        void initialize() {
            this.MainDisplay = new TimeSpan(0);
            this.stoppedAt = null;
            this.nextToggle = this.pause;
        }
        void pause() {
            this.stoppedAt = this.startTime.Add(this.MainDisplay.Value);
            this.nextToggle = this.resume;
        }
        void resume() {
            if(this.currentTime != null)
                this.startTime = this.startTime.Add(this.currentTime.Value.Subtract(this.stoppedAt.Value));
            this.stoppedAt = null;
            this.nextToggle = this.pause;
        }
        void ifStarted(Action act) {

            if(this.MainDisplay == null)
                return;
            act();
        }

        DateTime startTime;
        DateTime? stoppedAt = null;
        DateTime? currentTime = null;
        Action nextToggle;
        readonly List<TimeSpan> lapsDisplays = new List<TimeSpan>();
    }

    public class StopwatchFeature {
        [Scenario] public void Before_starting() {
            With_a_stopwatch();
            displays_look_like(null);
            elapsed(1);
            displays_look_like(null);
        }

        [Scenario] public void Started_and_main_adjusts() {
            With_a_started_stopwatch();
            displays_look_like(0);
            elapsed(10);
            displays_look_like(10);
            elapsed(1);
            displays_look_like(11);
        }

        [Scenario] public void Lap_mechanism() {
            With_a_started_stopwatch();
            elapsed(10);
            "hit lap".x(() => sw.Lap());
            displays_look_like(10, 10);
            elapsed(1);
            displays_look_like(11, 10);
            "hit lap".x(() => sw.Lap());
            displays_look_like(11, 10, 11);
            elapsed(2);
            displays_look_like(13, 10, 11);
            "reset".x(() => sw.Reset());
            displays_look_like(0);
        }

        [Scenario] public void Reset_mechanism() {
            With_a_started_stopwatch();
            elapsed(10);
            "reset".x(() => sw.Reset());
            displays_look_like(0);
            elapsed(2);
            displays_look_like(2);
        }

        [Scenario] public void Pause_and_restart() {
            With_a_started_stopwatch();
            elapsed(10);
            "pause".x(() => sw.Toggle());
            displays_look_like(10);
            elapsed(2);
            displays_look_like(10);
            "restart".x(() => sw.Toggle());
            displays_look_like(10);
            elapsed(2);
            displays_look_like(12);
        }

        void With_a_stopwatch() => "Given a stopwatch".x(() => {
                elapsedTime = new TimeSpan(0);
                sw = new Stopwatch(startTime);
            });
        void With_a_started_stopwatch() {
            With_a_stopwatch();
            "When started".x(() => sw.Toggle());
        }
        void elapsed(int sec) => $"When {sec}s has passed".x(() => {
                elapsedTime += TimeSpan.FromSeconds(sec);
                sw.RecordTime(startTime.Add(elapsedTime));
            });
        void displays_look_like(double? desiredMainSec, params double[] desiredLapSecs) {
            if(desiredMainSec == null)
                "it reads nothing in main".x(() => Null(sw.MainDisplay));
            else
                $"it reads {desiredMainSec}s in main"
                    .x(() => Equal(TimeSpan.FromSeconds(desiredMainSec.Value), sw.MainDisplay));
            if(!desiredLapSecs.Any())
                "it has no laps".x(() => Empty(sw.LapsDisplays));
            else
                $"it reads {String.Join(", ", desiredLapSecs)}s in laps"
                    .x(() => Equal(desiredLapSecs.Select(ms => TimeSpan.FromSeconds(ms)), sw.LapsDisplays));
        }

        Stopwatch sw;
        TimeSpan elapsedTime;
        static readonly DateTime startTime = DateTime.Parse("2019-08-18");
    }
}
