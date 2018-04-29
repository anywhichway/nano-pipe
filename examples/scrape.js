const NanoPipe = require("../index.js"),
	fetch = require("node-fetch"),
	JSDOM = require("jsdom").JSDOM;

async function getUrl() {
	const response = await fetch(this);
	return response.text();
}

function toDOM() {
	return new JSDOM(this);
}

function logTitle() {
	console.log(this.window.document.title)
	return this;
}

function analyzeBody() {
	// this could invoke processing on another server or thread
	console.log(`Analyzing body of length ${this.innerHTML.length}`);
}

function analyzeHead() {
  // this could invoke processing on another server or thread
	console.log(`Analyzing head of length ${this.innerHTML.length}`);
}

function splitAnalysis() {
	NanoPipe().analyzeHead().pipe([this.window.document.head]);
	NanoPipe().analyzeBody().pipe([this.window.document.body]);
}

NanoPipe.pipeable(getUrl).pipeable(toDOM).pipeable(logTitle).pipeable(splitAnalysis).pipeable(analyzeHead).pipeable(analyzeBody);

NanoPipe().getUrl().toDOM().logTitle().splitAnalysis().pipe(["https://www.cnn.com","https://www.msn.com"]);