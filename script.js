const menuToggle = document.getElementById('menuToggle');
const mainNav = document.getElementById('mainNav');
const scrollBar = document.getElementById('scrollBar');
const temperatureValue = document.getElementById('temperatureValue');
const temperatureMeter = document.getElementById('temperatureMeter');
const temperatureOptions = document.getElementById('temperatureOptions');

if (menuToggle && mainNav) {
  menuToggle.addEventListener('click', () => {
    const isOpen = mainNav.classList.toggle('open');
    menuToggle.setAttribute('aria-expanded', String(isOpen));
  });

  mainNav.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', () => {
      mainNav.classList.remove('open');
      menuToggle.setAttribute('aria-expanded', 'false');
    });
  });
}

function updateScrollProgress() {
  if (!scrollBar) return;
  const scrollable = document.documentElement.scrollHeight - window.innerHeight;
  const progress = scrollable > 0 ? (window.scrollY / scrollable) * 100 : 0;
  scrollBar.style.width = `${Math.min(100, Math.max(0, progress))}%`;
}

window.addEventListener('scroll', updateScrollProgress, { passive: true });
window.addEventListener('resize', updateScrollProgress);
updateScrollProgress();

if (temperatureOptions && temperatureValue && temperatureMeter) {
  temperatureOptions.addEventListener('click', (event) => {
    const button = event.target.closest('button[data-temp]');
    if (!button) return;

    const value = Number(button.dataset.temp);
    if (!Number.isFinite(value)) return;

    temperatureOptions.querySelectorAll('button').forEach((item) => {
      item.classList.toggle('active', item === button);
    });

    temperatureValue.textContent = String(value);
    temperatureMeter.style.width = `${Math.min(100, Math.max(0, value))}%`;
  });
}