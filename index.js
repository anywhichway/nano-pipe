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
			let f;
			if(Object.getPrototypeOf(step.f)===Object.getPrototypeOf(function(){})) {
				f = async function*(...args) {
					for await(const value of this) {
						const rslt = step.f.call(value,...args);
						if(rslt!==undefined) yield rslt;
					}
				}
			} else if(Object.getPrototypeOf(step.f)===Object.getPrototypeOf(async function(){})) {
				f = async function*(...args) {
					for await(const value of this) {
						const rslt = step.f.call(value,...args);
						if(rslt!==undefined) yield rslt;
					}
				}
			} else if(Object.getPrototypeOf(step.f)===Object.getPrototypeOf(function*(){})) {
				f = async function*(...args) {
					for await(const value of this) {
						for(const rslt of step.f.call(value,...args)) {
							if(rslt!==undefined) yield rslt;
						}
					}
				}
			} else {
				f = step.f;
			}
			this.prvs = f.call(prvs,...step.args);
		}
		const rslts  = [],
			prvs = this.prvs,
			itrtr = prvs[Symbol.asyncIterator] ? prvs : async function*() { yield prvs; }();
		for await(const rslt of itrtr) rslts.push(rslt);
		return rslts;
	}
	if(typeof(module)!=="undefined") module.exports = NanoPipe;
	if(typeof(window)!=="undefined") window.NanoPipe = NanoPipe;
})();