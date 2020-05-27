# nano-pipe

A tiny library (<450 bytes gzipped) to create chainable functions/pipelines including support for async generators.

# Installation

npm install nano-pipe

NanoPipe uses ES2016 and is not provided in transpiled form.

Version 9x of NodeJS requires the use of the --harmony flag.

You can use the code un-transpiled in the most recent versions of Chrome and Firefox. Edge requires transpiling.


# Usage

NanoPipe can be used in three easy steps:

1) Use the static method `NanoPipe.pipeable(function[,string])` to make functions chainable. You can pass in a regular function,
an async function, a generator, or an async generator. If it is anonymous, you can pass in a string for the name. It will be called with 
each upstream value passed down the pipe bound to `this`. With the exception of `undefined`, values yielded or returned by your function 
are passed further down the pipeline.

```
function render(template) { // render a value into a string literal template
	return Function("return `" + template + "`").call(this);
}
function log() { // log a value to the console
	console.log(this);
	return this;
}
NanoPipe.pipeable(render);
NanoPipe.pipeable(log);
```

2) Create pipelines using your functions, e.g.

```
const mypipe1 = NanoPipe().render("Name: ${this.name}").log(),
	mypipe2 = NanoPipe().log();

```

3) Use the pipelines by feeding them iterables with `<pipe>.pipe(iterable)`, including instantiated sychronous or asynchronous generators, as many times as you want, e.g.

```
mypipe1.pipe([{name:"Joe"},{name:"Mary"}]);

mypipe1.pipe([{name:"Jane"}]);

mypipe2.pipe([{name:"Joe"},{name:"Mary"}]);

mypipe2.pipe(async function*() { yield {name:"Joe"}; }());
```

`pipe` returns a Promise for an array of final values, so you can loop over them like this:


```
mypipe1.pipe([{name:"Joe"},{name:"Mary"}]).then(array => { for(const item of array) console.log(item); });
```

# Examples

1) Load `examples/index.html` in your browser to see he above code in action.

2) Run `node --harmony examples/scrape.js` to see a web scraping pipeline.

# API

## Instance Methods

`pipe(iterable)` - The last call in a pipe chain invokes pipe processing and returns a Promise for an array of results based on the input iterable. All other methods are up to you!

## Static Method For Custom Functions

`NanoPipe.pipeable(function[,name])` - You can pass in any of the following function types to make the function available as part of a pipe:

1) function() {}

2) async function() {}

3) function*() {}

4) async function*() { }

Use `name` if your function is anonymous or you want to use a different name in the pipe.

`pipeable` is chainable so you can call `NanoPipe.pipeable(f1).pipeable(f2)...`.


# Release History (reverse chronological order)

2020-05-27 - v0.0.7 Adjusted to me more minimization robust by elimiating some compact destructures.

2018-04-30 - v0.0.6 Corrected README.md example typos.

2018-04-28 - v0.0.5 Updated scraping example.

2018-04-28 - v0.0.4 Made `pipeable` chainable. Added web scraping example.

2018-04-28 - v0.0.3 Added "use strict" and test script

2018-04-25 - v0.0.2 Added unit tests. Added support for multiple function types.

2018-04-25 - v0.0.1 First public release
