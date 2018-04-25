# nano-pipe
A tiny library (<350 bytes gzipped) to create chainable functions/pipelines.

# Installation

npm install nano-pipe

# Usage

1) Use the static method `NanoPipe.pipeable(function[,string])` to make functions chainable. All functions you pass
should be async generators that iterate over `this` (which will be the upstream iterable for all values being passed down the pipeline).
Values yieled by your function are passed further down the pipeline.

```
async function* render(template) { // render a value into a string literal template
	for await(const value of this) {
		yield Function("return `" + template + "`").call(value);
	}
}
async function* log() { // log a value to the console
	for await(const value of this) {
		console.log(value);
		yield value;
	}
}
NanoPipe.pipeable(render);
NanoPipe.pipeable(log);
```

2) Create pipelines using your functions, e.g.

```
const mypipe1 = NanoPipe().render("Name: ${this.name}").log(),
	mypipe2 = NanoPipe().log();

```

3) Use the pipeline by feeding it iterables as many times as you want, e.g.

```
mypipe1.pipe([{name:"Joe"},{name:"Mary"});

mypipe1.pipe([{name:"Jane"});

mypipe2.pipe([{name:"Joe"},{name:"Mary"}]);
```


# API

To be written

# Release History (reverse chronological order)

2018-04-25 - v0.0.1 First public release
