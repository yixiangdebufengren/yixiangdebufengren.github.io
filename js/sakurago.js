document.addEventListener('DOMContentLoaded', function () {
  if (window.innerWidth < 768) return;

  new Sakura('body', {
    fallSpeed: 1,
    maxSize: 14,
    minSize: 10,
    delay: 300
  });
});