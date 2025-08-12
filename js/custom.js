document.addEventListener('DOMContentLoaded', () => {
  function setFakeEmail() {
    const emailInput = document.querySelector('#vcomments input[name="mail"]');
    if (emailInput && (!emailInput.value || emailInput.value.trim() === '')) {
      const nickInput = document.querySelector('#vcomments input[name="nick"]');
      let nick = nickInput ? nickInput.value || 'guest' : 'guest';
      emailInput.value = nick.toLowerCase().replace(/\s+/g, '') + '@fake.com';
      emailInput.type = 'hidden';
    }
  }

  // 初次加载
  setFakeEmail();

  // 如果是 PJAX 翻页加载
  document.addEventListener('pjax:complete', setFakeEmail);

  // 监听昵称输入变化，实时更新假邮箱
  document.addEventListener('input', e => {
    if (e.target && e.target.name === 'nick') {
      setFakeEmail();
    }
  });
});