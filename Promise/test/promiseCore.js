const MyPromise = require('../js/core.js');

const deferred = () => {
  let dfd = {};
  dfd.promise = new MyPromise((resolve, reject) => {
      dfd.resolve = resolve;
      dfd.reject = reject;
  });

  return dfd;
}

MyPromise.deferred = deferred;

module.exports = MyPromise;
