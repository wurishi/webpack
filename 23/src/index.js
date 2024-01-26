function* fn() {
  yield 'Hello';
  yield 'World';
}

// const iter = fn();
// console.log(iter.next().value);
// console.log(iter.next().value);

// for (const item of fn()) {
//   console.log(item);
// }

module.exports = {
  fn,
};
