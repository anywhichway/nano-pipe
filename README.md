# nano-pipe

A tiny library (<450 bytes gzipped) to create chainable functions/pipelines including support for async generators.

# Installation

npm install nano-pipe

NanoPipe uses ES2016 and is not provided in transpiled form.

# Usage

NanoPipe can be used in three easy steps:

1) Use the static method `NanoPipe.pipeable(function[,string])` to make functions chainable. You can pass in a regular function,
an async function, a generator, or an async generator. If it is anonymous, you can pass in a string for the name. It will be called with 
each upstream value passed down the pipe bound to `this`. With the exception of `undefined`, values yieled or returned by your function 
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
mypipe1.pipe([{name:"Joe"},{name:"Mary"});

mypipe1.pipe([{name:"Jane"});

mypipe2.pipe([{name:"Joe"},{name:"Mary"}]);

mypipe2.pipe(async function*() { yield {name:"Joe"}; }());
```


# Release History (reverse chronological order)

2018-04-25 - v0.0.2 Added unit tests. Added support for multiple function types.

2018-04-25 - v0.0.1 First public release
