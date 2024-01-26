import _ from 'lodash';
import Print from './print';

function getComponent() {
  const el = document.createElement('div');
  el.innerHTML = _.join(['Hello', 'Webpack'], ' ');

  el.onclick = Print.bind(null, 'Hello webpack!');
  return el;
}

document.body.appendChild(getComponent());
