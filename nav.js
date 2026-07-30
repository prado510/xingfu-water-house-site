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
