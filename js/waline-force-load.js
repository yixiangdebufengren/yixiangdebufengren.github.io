(function () {
  function forceLoadWaline() {
    const el = document.getElementById('waline-wrap')
    if (!el) return

    const path = window.location.pathname

    // 核心：只调用 Butterfly 自己的入口
    if (typeof window.loadOtherComment === 'function') {
      window.loadOtherComment(el, path)
    }
  }

  // 首次加载
  document.addEventListener('DOMContentLoaded', forceLoadWaline)
  window.addEventListener('load', forceLoadWaline)

  // PJAX / Butterfly 事件
  window.addEventListener('pjax:complete', forceLoadWaline)
  window.addEventListener('btf:load', forceLoadWaline)

  // 兼容 history 路由切换
  window.addEventListener('popstate', () => {
    setTimeout(forceLoadWaline, 50)
  })
})()