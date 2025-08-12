document.addEventListener('DOMContentLoaded', () => {
  const valineMailFix = () => {
    const emailInput = document.querySelector('#vcomments input[name="mail"]');
    if (emailInput) {
      const nickInput = document.querySelector('#vcomments input[name="nick"]');
      let nick = nickInput ? nickInput.value || 'guest' : 'guest';
      emailInput.value = nick.toLowerCase().replace(/\s+/g, '') + '@fake.com';
      emailInput.type = 'hidden';
    }
  };
  valineMailFix();
  document.addEventListener('pjax:complete', valineMailFix);
});