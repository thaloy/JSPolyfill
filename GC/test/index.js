const gc = require('../src/index.js');

function* generatorTest() {
  const test1 = yield [Promise.resolve(2), 2];
  console.log(test1, 'generator');
}

async function asyncTest() {
  const test1 = await [Promise.resolve(1), 1];
  console.log(test1, 'async');
}

asyncTest();

const test = gc(generatorTest);
test();
