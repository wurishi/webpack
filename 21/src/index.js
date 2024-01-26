console.log('Hello world');

const context = require.context('./sub', false, /\.js$/);

console.log(Reflect.ownKeys(context));

context.keys().forEach((key) => {
  // console.log(key);
  context(key); // 等价于 require()了
});
