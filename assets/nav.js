// 幸福水屋業務培訓站 ─ 導覽列管理
// 修改這裡的 EXTRA_LINKS 即可新增／移除導覽項目，不需要逐頁修改 HTML。
// 每個頁面的 HTML 只需寫固定導覽列；active 狀態由 JS 根據目前網址自動套用。

const EXTRA_LINKS = [
  { href: 'perspectives.html', text: '多元觀點' },
  { href: 'loan.html',         text: '貸款試算' },
  { href: 'market.html',       text: '商圈分析' },
  { href: 'survey.html',       text: '點位場勘' },
  { href: 'qa.html',           text: '問答專區' },
];

(function () {
  const nav = document.querySelector('nav.topnav');
  if (!nav) return;

  // 把 EXTRA_LINKS 裡面還沒有出現在 nav 的項目補進去
  EXTRA_LINKS.forEach(({ href, text }) => {
    const exists = nav.querySelector(`a[href="${href}"]`);
    if (!exists) {
      const a = document.createElement('a');
      a.href = href;
      a.textContent = text;
      nav.appendChild(a);
    }
  });

  // 根據目前頁面自動標記 active
  const current = location.pathname.split('/').pop() || 'index.html';
  nav.querySelectorAll('a').forEach(a => {
    const target = a.getAttribute('href').split('/').pop();
    a.classList.toggle('active', target === current);
  });
})();
