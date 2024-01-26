import * as _ from 'lodash';
import icon from './icon.svg';

const el = document.createElement('div');
el.innerHTML = _.join(['Hello', 'webpack'], ' ');

const img = new Image();
img.src = icon;
el.appendChild(img);
el.appendChild(document.createElement('br'));

document.body.appendChild(el);

console.log(el.innerHTML);
