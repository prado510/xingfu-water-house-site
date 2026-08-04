function toggleNav() {
  var el = document.querySelector('.navlinks');
  if (el) el.classList.toggle('open');
}

document.addEventListener('click', function (e) {
  var nav = document.querySelector('.navlinks');
  var toggle = document.querySelector('.nav-toggle');
  if (!nav || !toggle) return;
  if (nav.classList.contains('open') && !nav.contains(e.target) && !toggle.contains(e.target)) {
    nav.classList.remove('open');
  }
});

/* 自動補上新頁面的導覽連結（不必逐頁改 HTML）
   如果之後還要再加頁面，只要在 EXTRA_LINKS 加一筆即可。 */
(function () {
  var EXTRA_LINKS = [
    { href: 'loan.html', text: '貸款試算' },
    { href: 'market.html', text: '商圈分析' }
  ];

  function currentFile() {
    var p = window.location.pathname;
    var f = p.substring(p.lastIndexOf('/') + 1);
    return f === '' ? 'index.html' : f;
  }

  function apply() {
    var nav = document.querySelector('.navlinks');
    if (!nav) return;

    EXTRA_LINKS.forEach(function (item) {
      var exists = Array.prototype.some.call(nav.querySelectorAll('a'), function (a) {
        return (a.getAttribute('href') || '').indexOf(item.href) !== -1;
      });
      if (exists) return;
      var a = document.createElement('a');
      a.href = item.href;
      a.textContent = item.text;
      nav.appendChild(a);
    });

    // 依目前網址標示 active，避免頁面上寫死的 class 標錯
    var file = currentFile();
    Array.prototype.forEach.call(nav.querySelectorAll('a'), function (a) {
      var href = (a.getAttribute('href') || '').split('/').pop();
      if (href === file) {
        a.classList.add('active');
      } else {
        a.classList.remove('active');
      }
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', apply);
  } else {
    apply();
  }
})();
