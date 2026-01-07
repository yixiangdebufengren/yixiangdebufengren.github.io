(function () {
  function initWaline() {
    const el = document.querySelector('#waline');
    if (!el || !window.Waline) return;

    // 防止重复初始化
    if (el.dataset.walineInit) return;
    el.dataset.walineInit = 'true';

    Waline.init({
      el: '#waline',
      serverURL: 'https://waline.yixiangren.us.kg',
      path: location.pathname
    });
  }

  // 1. DOM Ready
  document.addEventListener('DOMContentLoaded', initWaline);

  // 2. load 兜底
  window.addEventListener('load', initWaline);

  // 3. 延迟再兜一次（解决懒加载 / 条件渲染）
  setTimeout(initWaline, 1000);
  setTimeout(initWaline, 3000);
})();