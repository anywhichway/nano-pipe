var chai,
	expect,
	NanoPipe;
if(typeof(window)==="undefined") {
	chai = require("chai");
	expect = chai.expect;
	NanoPipe = require("../index.js");
}

function render(template) { // render a value into a string literal template
	return Function("return `" + template + "`").call(this);
}
async function renderAsync(template) { // render a value into a string literal template
	return Function("return `" + template + "`").call(this);
}
function* renderGenerator(template) { // render a value into a string literal template
	yield Function("return `" + template + "`").call(this);
}
async function* renderAsyncGenerator(template) { // render a value into a string literal template
	for await(const value of this) {
		yield Function("return `" + template + "`").call(value);
	}
}

let pipe,
	asyncPipe,
	generatorPipe,
	asyncGeneratorPipe;
describe("Test",function () {
	it("add pipeable function", function(done) {
		NanoPipe.pipeable(render);
		expect(typeof(NanoPipe.prototype.render)).equal("function");
		done();
	});
	it("add pipeable async function", function(done) {
		NanoPipe.pipeable(renderAsync);
		expect(typeof(NanoPipe.prototype.renderAsync)).equal("function");
		done();
	});
	it("add pipeable generator function", function(done) {
		NanoPipe.pipeable(renderGenerator);
		expect(typeof(NanoPipe.prototype.renderGenerator)).equal("function");
		done();
	});
	it("add pipeable async generator function", function(done) {
		NanoPipe.pipeable(renderAsyncGenerator);
		expect(typeof(NanoPipe.prototype.renderAsyncGenerator)).equal("function");
		done();
	});
	it("create pipe", function(done) {
		pipe = NanoPipe().render("Name: ${this.name}");
		expect(pipe).to.be.instanceof(NanoPipe);
		expect(typeof(pipe.render)).equal("function");
		done();
	});
	it("create async pipe", function(done) {
		asyncPipe = NanoPipe().renderAsync("Name: ${this.name}");
		expect(asyncPipe).to.be.instanceof(NanoPipe);
		expect(typeof(asyncPipe.renderAsync)).equal("function");
		done();
	});
	it("create generator pipe", function(done) {
		generatorPipe = NanoPipe().renderGenerator("Name: ${this.name}");
		expect(generatorPipe).to.be.instanceof(NanoPipe);
		expect(typeof(generatorPipe.renderGenerator)).equal("function");
		done();
	});
	it("create async generator pipe", function(done) {
		asyncGeneratorPipe = NanoPipe().renderAsyncGenerator("Name: ${this.name}");
		expect(asyncGeneratorPipe).to.be.instanceof(NanoPipe);
		expect(typeof(asyncGeneratorPipe.renderAsyncGenerator)).equal("function");
		done();
	});
	it("run pipe", function(done) {
		pipe.pipe([{name:"Joe"},{name:"Mary"}]).then(results => {
			expect(results.length).equal(2);
			expect(results[0]).equal("Name: Joe");
			done();
		});
	});
	it("run async pipe", function(done) {
		asyncPipe.pipe([{name:"Joe"},{name:"Mary"}]).then(results => {
			expect(results.length).equal(2);
			expect(results[0]).equal("Name: Joe");
			done();
		});
	});
	it("run generator pipe", function(done) {
		generatorPipe.pipe([{name:"Joe"},{name:"Mary"}]).then(results => {
			expect(results.length).equal(2);
			expect(results[0]).equal("Name: Joe");
			done();
		});
	});
	it("run async generator pipe", function(done) {
		asyncGeneratorPipe.pipe([{name:"Joe"},{name:"Mary"}]).then(results => {
			expect(results.length).equal(2);
			expect(results[0]).equal("Name: Joe");
			done();
		});
	});
	it("run pipe with generator", function(done) {
		pipe.pipe(async function*() {  yield {name:"Joe"}; }()).then(results => {
			expect(results.length).equal(1);
			expect(results[0]).equal("Name: Joe");
			done();
		});
	});
});

if(typeof(mocha)!=="undefined") {
		const runner = mocha.run();
}