/* eslint-disable */

/**
 * @file gc
 * @desc generator函数的控制器
 * @author thalo
 * @date 2020-06-08
 */

/* @desc 非法的generator函数 */
function isIllegalIterator(iterator) {
  return (
    typeof iterator !== 'object' ||
    typeof iterator.next !== 'function' ||
    typeof iterator.throw !== 'function' ||
    iterator.toString() !== '[object Generator]'
  )
}

/* @desc 判断是不是Promise */
function isPromise(value) {
  return Object.getPrototypeOf(value) === Promise.prototype;
}

/* @desc 转化成Promise, 如果value是promise的化直接返回 */
function toPromise(value) {
  if (isPromise(value)) return value;

  return Promise.resolve(value);
}

function gc(generator) {

  if (typeof generator !== 'function') return new TypeError('argv is not a function');

  return function factoryGc(...argvs) {
      
    const iterator = generator.call(this, ...argvs);

    if (isIllegalIterator(iterator)) {
      throw new TypeError('argv is not a generator function');
    }

    return new Promise((resolve, reject) => {
      function onFulfill(data) {
        let nextIterator = null;
        try {
          nextIterator = iterator.next(data);
        } catch (err) {
          return reject(err);
        }

        nextIteratorHandler(nextIterator);
      }

      function onReject(reason) {
        let nextIterator = null;
        try {
          nextIterator = iterator.throw(reason);
        } catch (err) {
          return reject(err);
        }

        nextIteratorHandler(nextIterator);
      }

      function nextIteratorHandler(iterator) {
        const { done, value } = iterator;

        if (done) return resolve(value);

        const valuePromiseType = toPromise(value);

        valuePromiseType.then(onFulfill, onReject);
      }

      onFulfill();
    });
  }
}

module.exports = gc;
