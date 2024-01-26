import './style.css';
const styles = require('style-loader!css-loader?modules!./style.txt');

let div = document.createElement('div');
div.className = 'div';
div.textContent = 'Hello';
document.body.appendChild(div);

div = document.createElement('div');
div.className = styles.abc;
div.textContent = 'ABC';
document.body.appendChild(div);

console.log(styles);

setTimeout(() => {
  console.log('Hello World');
}, 5000);
