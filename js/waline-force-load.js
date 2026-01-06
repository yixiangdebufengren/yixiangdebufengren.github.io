// waline-force-load.js
(function () {
  'use strict';

  function isWalineReadyOnEl(el) {
    if (!el) return false;
    // 如果容器里已有子节点或已被初始化（粗略判断）
    if (el.children.length > 0) return true;
    if (el.querySelector('.waline') || el.querySelector('.wl-comment') ) return true;
    return false;
  }

  function tryCallIfFn(fn, ...args) {
    try {
      if (typeof fn === 'function') {
        fn.apply(null, args);
        return true;
      }
    } catch (e) {
      console.warn('waline-force-load: call failed', e);
    }
    return false;
  }

  function ensureLoad() {
    const el = document.getElementById('waline-wrap');
    if (!el) return;

    // 已加载则跳过
    if (isWalineReadyOnEl(el)) return;

    const path = window.location.pathname;

    // 1) 优先：主题或插件可能暴露的 loader
    if (tryCallIfFn(window.loadOtherComment, el, path)) {
      console.debug('waline-force-load: used window.loadOtherComment');
      return;
    }

    if (window.shuoshuoComment && tryCallIfFn(window.shuoshuoComment.loadComment, el, path)) {
      console.debug('waline-force-load: used window.shuoshuoComment.loadComment');
      return;
    }

    // 2) Butterfly 常见工具 btf.loadComment（会在可见时加载或立即调用回调）
    if (window.btf && tryCallIfFn(window.btf.loadComment, el, window.loadOtherComment || window.shuoshuoComment && window.shuoshuoComment.loadComment)) {
      console.debug('waline-force-load: used btf.loadComment');
      return;
    }

    // 3) 如果页面或主题已暴露 waline 的 init 函数（谨慎：只传 el & path，避免改动其它选项）
    if (window.walineFn && typeof window.walineFn === 'function') {
      try {
        // 仅当没有其它 loader 时才做最小 init（可能需要 serverURL 等；若失败会报错）
        window.walineFn({ el: el, path: path });
        console.debug('waline-force-load: used window.walineFn with minimal options');
        return;
      } catch (e) {
        console.warn('waline-force-load: walineFn minimal init failed', e);
      }
    }

    // 4) 触发自定义事件，让主题模板或其他脚本捕获并加载（非破坏性）
    window.dispatchEvent(new CustomEvent('waline:force-load', { detail: { el: el, path: path } }));
    console.debug('waline-force-load: dispatched waline:force-load event (no immediate loader found)');
  }

  // 观察 DOM 插入（当 #waline-wrap 被动态写入时触发）
  const mo = new MutationObserver((mutations) => {
    for (const m of mutations) {
      if (m.addedNodes && m.addedNodes.length) {
        for (const n of m.addedNodes) {
          if (!(n instanceof HTMLElement)) continue;
          if (n.id === 'waline-wrap' || n.querySelector && n.querySelector('#waline-wrap')) {
            setTimeout(ensureLoad, 50);
            return;
          }
        }
      }
    }
  });
  mo.observe(document.documentElement || document.body, { childList: true, subtree: true });

  // 监听常见事件（页面首次加载、pjax/SPA 导航、主题事件）
  document.addEventListener('DOMContentLoaded', ensureLoad);
  window.addEventListener('load', ensureLoad);
  window.addEventListener('pjax:complete', ensureLoad);
  window.addEventListener('btf:load', ensureLoad);
  window.addEventListener('waline:navigate', ensureLoad); // 保留兼容事件
  window.addEventListener('waline:force', ensureLoad); // 可由其他脚本手动触发

  // 兼容 history.pushState/replaceState 的 SPA 导航（派发自定义事件）
  (function patchHistoryEvent() {
    if (window.__waline_force_history_patched) return;
    const _push = history.pushState;
    const _replace = history.replaceState;
    history.pushState = function () {
      const r = _push.apply(this, arguments);
      window.dispatchEvent(new Event('waline:navigate'));
      setTimeout(ensureLoad, 60);
      return r;
    };
    history.replaceState = function () {
      const r = _replace.apply(this, arguments);
      window.dispatchEvent(new Event('waline:navigate'));
      setTimeout(ensureLoad, 60);
      return r;
    };
    window.addEventListener('popstate', () => {
      window.dispatchEvent(new Event('waline:navigate'));
      setTimeout(ensureLoad, 60);
    });
    window.__waline_force_history_patched = true;
  })();

  // 立即尝试一次（保护性）
  setTimeout(ensureLoad, 30);
})();