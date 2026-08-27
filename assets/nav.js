// 幸福水屋業務培訓站 ─ 導覽列管理
// 修改這裡的 EXTRA_LINKS 即可新增／移除導覽項目，不需要逐頁修改 HTML。
// 每個頁面的 HTML 只需寫固定導覽列；active 狀態由 JS 根據目前網址自動套用。

const EXTRA_LINKS = [
  { href: 'perspectives.html', text: '多元觀點' },
  { href: 'qa.html', text: '問答專區' },
  { href: 'loan.html', text: '貸款試算' },
  { href: 'market.html', text: '商圈分析' },
  { href: 'survey.html', text: '點位場勘' },
  { href: 'bonus-simulator.html', text: '獎勵試算' },
];

(function () {
  const nav = document.querySelector('nav.topnav');
  if (!nav) return;

  // 所有選單連結都必須放在 .navlinks 容器裡面。
  // （nav.topnav 本身是 justify-content: space-between，直接掛在它底下的 <a>
  //   會被平均拉開，選單就會散掉、也不會套到膠囊樣式與手機版收合。）
  let links = nav.querySelector('.navlinks');
  if (!links) {
    links = document.createElement('div');
    links.className = 'navlinks';
    nav.appendChild(links);
  }

  // 項目較多時允許換行，避免視窗較窄時擠出畫面
  links.style.flexWrap = 'wrap';

  const hrefs = EXTRA_LINKS.map(l => l.href);

  // 若舊版本曾把連結誤加在 nav 直接底下，先收回 .navlinks（不動 .brand）
  Array.from(nav.children).forEach(el => {
    if (el.tagName !== 'A' || el.classList.contains('brand')) return;
    const target = (el.getAttribute('href') || '').split('/').pop();
    if (hrefs.includes(target)) links.appendChild(el);
  });

  // 把 EXTRA_LINKS 裡面還沒有出現在選單的項目補進去
  EXTRA_LINKS.forEach(({ href, text }) => {
    if (!links.querySelector(`a[href="${href}"]`)) {
      const a = document.createElement('a');
      a.href = href;
      a.textContent = text;
      links.appendChild(a);
    }
  });

  // 根據目前頁面自動標記 active
  const current = location.pathname.split('/').pop() || 'index.html';
  links.querySelectorAll('a').forEach(a => {
    const target = (a.getAttribute('href') || '').split('/').pop();
    a.classList.toggle('active', target === current);
  });
})();
