document.addEventListener('DOMContentLoaded', function () {

  // 根据屏幕宽度自动区分配置
  const isMobile = window.innerWidth <= 768;

  new Sakura('html', {
    // 下落速度：值越大越慢
    fallSpeed: isMobile ? 1.0 : 0.8,

    // 花瓣尺寸（整体偏小更自然）
    minSize: isMobile ? 8 : 10,
    maxSize: isMobile ? 12 : 14,

    // 生成间隔（越大越稀疏）
    delay: isMobile ? 300 : 200
  });

});