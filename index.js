(function() {
	function NanoPipe() {
		if(!this || !(this instanceof NanoPipe)) return new NanoPipe();
		this.steps = [];
		return this;
	}
	NanoPipe.pipeable = function(f,name) {
		NanoPipe.prototype[name||f.name] = function(...args) {
			this.steps.push({f,args});
			return this;
		}
	}
	NanoPipe.prototype.pipe = async function(values) {
		this.prvs = async function*() { for await(const value of values) yield value; }();
		for(const step of this.steps) {
			const prvs = this.prvs,
				itrtr = prvs[Symbol.asyncIterator] ? prvs : async function*() { yield prvs; }();
			this.prvs = step.f.call(prvs,...step.args);
		}
		const rslts  = [],
			prvs = this.prvs,
			itrtr = prvs[Symbol.asyncIterator] ? prvs : async function*() { yield prvs; }();
		for await(const result of itrtr) rslts.push(result);
		return rslts;
	}
	if(typeof(nodule)!=="undefined") module.exports = NanoPipe;
	if(typeof(window)!=="undefined") window.NanoPipe = NanoPipe;
})();