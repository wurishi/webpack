async function getComponent() {
  // return import(/* webpackChunkName: "lodash" */ 'lodash')
  //   .then((_) => {
  //     const element = document.createElement('div');
  //     element.innerHTML = _.join(['Hello', 'webpack'], ' ');
  //     return element;
  //   })
  //   .catch((error) => 'An error occurred while loading the component.');

  const el = document.createElement('div');
  const _ = await import(/* webpackChunkName: 'lodash'*/ 'lodash');
  el.innerHTML = _.join(['Hello', 'webpack'], ' ');
  return el;
}

getComponent().then((component) => {
  document.body.appendChild(component);
  console.log('append');
});
console.log('init');
