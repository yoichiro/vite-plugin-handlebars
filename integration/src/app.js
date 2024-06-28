import template from '../templates/template.handlebars';

window.addEventListener('load', () => {
  const app = document.getElementById('app');
  app.innerHTML = template({ name: 'Handlebars Import Vite Plugin' });
});
