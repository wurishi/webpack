import icon from './icon.svg';

if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker
      .register('./service-worker.js')
      .then((registration) => {
        console.log('SW registered:', registration);
      })
      .catch((error) => {
        console.log('SW failed:', error);
      });
  });
}

const el = document.createElement('div');
el.innerHTML = 'Hello';
const img = new Image();
img.src = icon;
el.appendChild(document.createElement('br'));
el.appendChild(img);

document.body.appendChild(el);
