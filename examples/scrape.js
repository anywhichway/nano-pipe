const NanoPipe = require("../index.js"),
	fetch = require("node-fetch"),
	JSDOM = require("jsdom").JSDOM;

const db1 = {
		put(key,value) {
			console.log(`Saving ${value} under ${key} in db1`);
		}
	},
	db2 = {
			put(key,value) {
				console.log(`Saving ${value} under ${key} in db2`);
			}
	};

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

function splitAnalysis() {
	NanoPipe()
	  .analyzeHead()
	  .save(db1)
	  .pipe([{title:this.window.document.title,head:this.window.document.head}]);
	NanoPipe()
	  .analyzeBody()
	  .save(db2)
	  .pipe([{title:this.window.document.title,body:this.window.document.body}]);
}

function analyzeHead() {
  // this could invoke processing on another server or thread
	// return <results of analysis>
	return Promise.resolve({title:this.title,
		length:this.head.innerHTML.length});
}

function analyzeBody() {
	// this could invoke processing on another server or thread
	// return <results of analysis>
	return Promise.resolve({title:this.title,
		length:this.body.innerHTML.length});
}

function save(db) {
	db.put(this.title,this.length);
}


NanoPipe.pipeable(getUrl).pipeable(toDOM).pipeable(logTitle).pipeable(splitAnalysis).pipeable(analyzeHead).pipeable(analyzeBody).pipeable(save);

const scraper = NanoPipe().getUrl().toDOM().logTitle().splitAnalysis();
scraper.pipe(["https://www.cnn.com","https://www.msn.com"]);
scraper.pipe(["https://www.foxnews.com"]);