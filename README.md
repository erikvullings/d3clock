# D3 Clock

An analogue clock with multiple faces, based on d3.

Credits go to Daniel Pradilla, who created the [original d3clock](https://www.danielpradilla.info/blog/a-swiss-railway-clock-in-d3).

I've only:
- converted d3 from v3 to v5
- converted the JavaScript to TypeScript
- removed some redundant computations
- fixed some bugs (e.g. the SBB clock added new circle elements on every clock tick, roman numeral IV...)
- published it to npm.

## Credits
by: Daniel Pradilla <info@danielpradilla.info>
blog: http://danielpradilla.info

With ideas from
- https://github.com/wout/svg.clock.js
- https://ericbullington.com/blog/2012/10/27/d3-oclock/
- http://www.infocaptor.com/dashboard/d3-javascript-visualization-to-build-world-analog-clocks
- Also see the excellent article by Mike Bostock: https://bost.ocks.org/mike/join/

## Usage:

Call d3clock(config) for each clock instance

e.g.:
```javascript
d3clock({
	target: '#chart1',
	face: 'modern',
	width: 1000,
	// date:'Mon May 25 2015 10:09:37',
	TZOffset: { hours: 0}
});
```

You can create several instances in a page (for showing multiple time zones, for example).
If you send a date value in the config object, it shows a fixed time (good for testing).


Available faces
----------------

1. sbb: The famous [Swiss Railway Clock](https://en.wikipedia.org/wiki/Swiss_railway_clock)
2. modern: A somewhat modern/minimalist face
3. classic: A classical face with roman numerals
4. braun: A [Braun BN0021](http://www.braun-clocks.com/watch/BN0021BKBKG)-ish face

## Build instructions

```console
npm i
npm start
```