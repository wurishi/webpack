import _ from 'lodash';
import './style.css';

function component() {
  const el = document.createElement('div');

  el.innerHTML = _.join(['Hello', 'webpack'], ' ');
  el.classList.add('hello');

  return el;
}

document.body.appendChild(component());

// bundle-loader

import bundle from './a.bundle.js';

bundle((m) => {
  const { hello } = m;
  hello();
});

const load = require('promise-loader?bluebird!./b.p.js');
// load 是用来加载代码的 promise
setTimeout(() => {
  load().then((m) => {
    // m 才是对应的 b.i18n.js 文件
    m().then((r) => {
      const { hello } = r;
      hello();
    });
  });
}, 1000);
