using System;
using System.Collections.Generic;
using Xunit;
using Xbehave;

using static Xunit.Assert;

namespace Stopwatch.Tests {
    public class Stopwatch {
        public TimeDisplays Displays { get; private set; } = new TimeDisplays();
        public class TimeDisplays {
            public TimeSpan? Main { get; set; }
            public IList<TimeSpan> Laps { get; set; } = new List<TimeSpan>();
        }
    }

    public class StopwatchFeature {
        [Scenario]
        public void Doesnt_do_anything_without_being_started() {
            "Given a stopwatch".x(() => sw = new Stopwatch());
            "it reads nothing in main".x(() => Equal(null, sw.Displays.Main) );
            "it has no laps".x(() => Equal(0, sw.Displays.Laps.Count));
        }

        Stopwatch sw;
    }}
