var ctrl = {

  // 深色模式开关
  switchDarkMode: function() {
    const nowMode = document.documentElement.getAttribute('data-theme') === 'dark' ? 'dark' : 'light'
    if (nowMode === 'light') {
      activateDarkMode()
      saveToLocal.set('theme', 'dark', 2)
      GLOBAL_CONFIG.Snackbar !== undefined && btf.snackbarShow(GLOBAL_CONFIG.Snackbar.day_to_night)
      // document.querySelector("#iconDarkMode").classList.remove("fa-sun")
      // document.querySelector("#iconDarkMode").classList.add("fa-moon")
    } else {
      activateLightMode()
      saveToLocal.set('theme', 'light', 2)
      GLOBAL_CONFIG.Snackbar !== undefined && btf.snackbarShow(GLOBAL_CONFIG.Snackbar.night_to_day)
      // document.querySelector("#iconDarkMode").classList.remove("fa-moon")
      // document.querySelector("#iconDarkMode").classList.add("fa-sun")
    }
    typeof utterancesTheme === 'function' && utterancesTheme()
    typeof changeGiscusTheme === 'function' && changeGiscusTheme()
    typeof FB === 'object' && window.loadFBComment()
    typeof runMermaid === 'function' && window.runMermaid()  
  },

  //显示中控台
  showConsole: function() {
    document.querySelector("#console").classList.add("show");
    cjw.initConsoleState();
  },

  //隐藏中控台
  hideConsole: function() {
    document.querySelector("#console").classList.remove("show");
  },

  // 歌词显示开关
  ircShowHide: function() {
    const irc = document.querySelector(".aplayer-lrc-hide")
    if(irc === null) {
      document.querySelector(".aplayer-lrc").classList.add("aplayer-lrc-hide")
      document.querySelector("#ircItem").classList.remove("on")
    } else {
      document.querySelector(".aplayer-lrc").classList.remove("aplayer-lrc-hide")
      document.querySelector("#ircItem").classList.add("on")
    }
  },

  // 单栏显示开关
  hideAsideBtn: () => {
    const $htmlDom = document.documentElement.classList
    if ($htmlDom.contains('hide-aside')){
      saveToLocal.set('aside-status', 'show', 2)
      document.querySelector("#asideItem").classList.remove("on")
    } else {
      saveToLocal.set('aside-status', 'hide', 2)
      document.querySelector("#asideItem").classList.add("on")
    }
    $htmlDom.toggle('hide-aside')
  },

  //初始化console图标
  initConsoleState: function() {
    const irc = document.querySelector(".aplayer-lrc-hide")
    irc === null
      ? document.querySelector("#ircItem").classList.add("on")
      : document.querySelector("#ircItem").classList.remove("on")
    saveToLocal.get('aside-status') === 'hide'
      ? document.querySelector("#asideItem").classList.add("on")
      : document.querySelector("#asideItem").classList.remove("on")
  }
  
}


作者: 南方嘉木
链接: https://blog.cancin.cn/post/ac62cfd5.html
来源: 参星阁
著作权归作者所有。商业转载请联系作者获得授权，非商业转载请注明出处。