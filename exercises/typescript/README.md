I want to do the exercise in typescript and it's been some six years. I'm going to use Deno just because its easy and I want to play with it more.

Curious to see what Deno Test is like.

Looks like [it allows familiar mocha-style syntax](https://docs.deno.com/runtime/fundamentals/testing/#behavior-driven-development) and has [built in facilities for testing timers](https://jsr.io/@std/testing/doc/time). [Here are those full docs](https://jsr.io/@std/testing/doc/bdd#namespace_it_skip)

Tests are all in [main_test.ts](./main_test.ts) and can be run with

   deno test

I make no statement that the code is good. In fact I don't think it *is* good. The entire point is to tdd something that works with a comprehensive test suite so that we can refactor later without changing the tests
