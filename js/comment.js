(function () {
  function fixWalineNick() {
    const input = document.querySelector('#wl-nick')
    const label = document.querySelector('label[for="wl-nick"]')
    const input1 = document.querySelector('#wl-mail')
    const label2 = document.querySelector('label[for="wl-mail"]')
    
    if (input) {
      input.placeholder = 'QQ号可显示头像'
    }
    if (input1) {
      input.placeholder = '可选'
    }

    if (label) {
      label.textContent = '昵称'
    }
    if (label) {
      label.textContent = '邮箱'
    }
    
    // 两个都处理到了，才算完成
    return !!(input && label)
  }

  const observer = new MutationObserver(() => {
    if (fixWalineNick()) {
      observer.disconnect()
    }
  })

  observer.observe(document.body, {
    childList: true,
    subtree: true
  })
})()