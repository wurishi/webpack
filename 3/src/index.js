import _ from 'lodash';
import './style.css';
import Icon from './icon.svg';
import DataX from './data.xml';
import DataC from './data.csv';

function component() {
  const element = document.createElement('div');

  element.innerHTML = _.join(['Hello', 'webpack'], ' ');
  element.classList.add('hello');

  const myIcon = new Image();
  myIcon.src = Icon;
  element.appendChild(myIcon);

  console.log(DataX);
  console.log('---------');
  console.log(DataC);

  return element;
}

document.body.appendChild(component());
