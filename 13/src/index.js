function getComponent() {
  const el = document.createElement('div');
  el.innerHTML = join(['Hello', 'webpack'], ' ');

  // this.alert('hehe');

  return el;
}

document.body.appendChild(getComponent());

console.log(fetch);