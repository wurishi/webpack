import _ from 'lodash';

function component() {
  const el = document.createElement('div');

  const button = document.createElement('button');
  const br = document.createElement('br');

  button.innerHTML = 'Click me';
  el.innerHTML = _.join(['Hello', 'webpack'], ' ');
  el.appendChild(br);
  el.appendChild(button);

  button.onclick = (e) =>
    import(/* webpackChunkName: 'print' */ './print.js').then((module) => {
      const print = module.default;
      print();
    });
  return el;
}

document.body.appendChild(component());
