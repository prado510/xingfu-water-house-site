// 幸福水屋業務培訓站 ─ 導覽列管理
// 這份檔案是「導覽列的唯一來源」：不論各頁面 HTML 原本怎麼寫，
// 選單都會依照下面 NAV_LINKS 的內容與順序重建，並自動標記 active。
// 要新增／移除／調整順序，只改 NAV_LINKS 即可，不需要動任何 HTML。

const NAV_LINKS = [
  { href: 'index.html', text: '品牌故事' },
  { href: 'compare.html', text: '方案比較' },
  { href: 'calculator.html', text: '營業額試算' },
  { href: 'perspectives.html', text: '多元觀點' },
  { href: 'qa.html', text: '問答專區' },
  { href: 'loan.html', text: '貸款試算' },
  { href: 'market.html', text: '商圈分析' },
  { href: 'survey.html', text: '點位場勘' },
  { href: 'bonus-simulator.html', text: '獎勵試算' },
];

// 舊名稱相容（過去的說明文件是講 EXTRA_LINKS）
const EXTRA_LINKS = NAV_LINKS;

(function () {
  const hasSiteCss = !!document.querySelector('link[rel="stylesheet"][href*="style.css"]');

  // 沒有載入站台樣式的頁面（例如獎勵試算是獨立排版），補一份導覽列專用的樣式，
  // 這樣選單在任何頁面都長得一樣。
  function injectFallbackCss() {
    if (document.getElementById('nav-fallback-css')) return;
    const css = `
.topnav{position:sticky;top:0;z-index:50;display:flex;align-items:center;justify-content:space-between;
  gap:12px;flex-wrap:wrap;background:#fff;border-bottom:1px solid #F1C7D6;padding:12px 28px;
  font-family:"Noto Sans TC","PingFang TC","Microsoft JhengHei",system-ui,sans-serif;}
.topnav .brand{display:flex;align-items:center;gap:10px;font-weight:700;font-size:17px;
  color:#A31856;text-decoration:none;}
.topnav .brand img{height:34px;width:34px;}
.topnav .brand .tag{font-size:11px;font-weight:400;color:#7A5A66;display:block;margin-top:1px;}
.topnav .navlinks{display:flex;flex-wrap:wrap;gap:6px;font-size:14px;}
.topnav .navlinks a{padding:8px 14px;border-radius:999px;color:#7A5A66;text-decoration:none;
  white-space:nowrap;}
.topnav .navlinks a:hover{background:#FBE4EC;}
.topnav .navlinks a.active{background:#D6236F;color:#fff;font-weight:500;}
@media (max-width:640px){.topnav{padding:10px 16px;}.topnav .navlinks{font-size:13px;gap:4px;}
  .topnav .navlinks a{padding:6px 10px;}}
`;
    const style = document.createElement('style');
    style.id = 'nav-fallback-css';
    style.textContent = css;
    document.head.appendChild(style);
  }

  // 1. 取得（或建立）導覽列本體
  let nav = document.querySelector('nav.topnav');
  if (!nav) {
    nav = document.createElement('nav');
    nav.className = 'topnav';
    document.body.insertBefore(nav, document.body.firstChild);
    if (!hasSiteCss) injectFallbackCss();
  }

  // 2. 品牌區塊：沒有就補一個（連回首頁）
  if (!nav.querySelector('.brand')) {
    const brand = document.createElement('a');
    brand.className = 'brand';
    brand.href = 'index.html';
    brand.innerHTML =
      '<img src="assets/logo.svg" alt="幸福水屋">' +
      '<div>幸福水屋<span class="tag">業務培訓站 · 24H 共享淨水站</span></div>';
    nav.insertBefore(brand, nav.firstChild);
  }

  // 3. 選單容器：所有連結一律放在 .navlinks 裡面。
  //    （nav.topnav 本身是 justify-content: space-between，直接掛在它底下的 <a>
  //      會被平均拉開，選單就會散掉、也不會套到膠囊樣式。）
  let links = nav.querySelector('.navlinks');
  if (!links) {
    links = document.createElement('div');
    links.className = 'navlinks';
    nav.appendChild(links);
  }

  // 清掉散落在 nav 底下的舊連結（品牌區塊不動）
  Array.from(nav.children).forEach(el => {
    if (el.tagName === 'A' && !el.classList.contains('brand')) el.remove();
  });

  // 4. 依 NAV_LINKS 重建選單，順序在每一頁都一致
  const current = location.pathname.split('/').pop() || 'index.html';
  links.innerHTML = '';
  NAV_LINKS.forEach(({ href, text }) => {
    const a = document.createElement('a');
    a.href = href;
    a.textContent = text;
    if (href.split('/').pop() === current) a.classList.add('active');
    links.appendChild(a);
  });
})();
