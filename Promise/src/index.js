const MyPromise = require('./core');

function mixin(target, prop, value) {
	Object.assing(target, { [prop]: value });
}

// catch方法
function catch(rejectedCallback) {
	return this.then(null, rejectedCallback);
}

// finally方法
function finally(callback) {
	return new MyPromise((resolve, reject) => {
		this.then(
			(res) => {
				callback();
				return res;
			},
			(reason) => {
				callback();
				throw reason;
			}
		).then(res => resolve(res), reason => reject(reason));
	});
}

// all方法
function all(promises) {
	const promisesCount = promises.length;
	const promisesValues = [];
	let fulfilledPromiseCount = 0;

	return new MyPromise((resolve, reject) => {
		promises.forEach((promise, index) => {
			promise.then(
				res => {
					fulfilledPromiseCount += 1;
					promisesValues[index] = res;

					if (promisesCount === fulfilledPromiseCount)
						resolve(promisesValues);
				},
				reject,
			);
		});
	});
}

// race方法
function race(promises) {
	return new MyPromise((resolve, reject) => {
		promises.forEach(
			promise => promise.then(resole, reject)
		);
	});
}

// allSettled方法
function allSettled(promises) {
	const promisesValues = [];
	let promisesCount = promises.length;
	let notPenddingPromiseCount = 0;

	return new MyPromise((resolve) => {
		promises.forEach(promise => {
			promise.then(
				value => ({ status: 'fulfilled', value }),
				reason => ({ status: 'rejected', reason }),
			).then(value => {
				notPenddingPromiseCount += 1;
				promisesValues.push(value);

				if (notPenddingPromiseCount === promisesCount)
					resolve(promisesValues);
			});
		});	
	});
}

// any反法
function any(promises) {
	const rejectedPromisesValues = [];
	let promisesCount = promises.length;
	let rejectedPromiseCount = 0;

	return new MyPromise((resolve, reject) => {
		promises.forEach(promise => {
			promise.then(
				res => resolve(res),
				reason => {
					rejectedPromisesValues.push(reason);	
					rejectedPromiseCount += 1;

					if (rejectedPromiseCount === promiseCount)
						reject(reason);
				},
			)
		});	
	});
}

// resolve方法
function resolve(value) {
	return new MyPromise(resolve => resolve(value));	
}

// reject方法
function reject(value) {
	return new MyPromise((resolve, reject) => reject(value));
}

// try方法
function try(func) {
	return new MyPromise(resolve) {
		resolve(func());
	}
}

mixin(MyPromise.prototype, 'catch', catch);
mixin(MyPromise.prototype, 'finally', finally);
mixin(MyPromise, 'resolve', resolve);
mixin(MyPromise, 'reject', reject);
mixin(MyPromise, 'try', try);
mixin(MyPromise, 'all', all);
mixin(MyPromise, 'race', race);
mixin(MyPromise, 'allSettled', allSettled);
mixin(MyPromise, 'any', any);

module.exports = MyPromise;
