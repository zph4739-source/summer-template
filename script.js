(() => {
  'use strict';

  const menuToggle = document.getElementById('menuToggle');
  const mainNav = document.getElementById('mainNav');
  const scrollBar = document.getElementById('scrollBar');
  const temperatureValue = document.getElementById('temperatureValue');
  const temperatureMeter = document.getElementById('temperatureMeter');
  const temperatureOptions = document.getElementById('temperatureOptions');
  const desktopMenuQuery = window.matchMedia('(min-width: 901px)');

  function setMenuOpen(open) {
    if (!menuToggle || !mainNav) return;
    mainNav.classList.toggle('open', open);
    menuToggle.setAttribute('aria-expanded', String(open));
  }

  if (menuToggle && mainNav) {
    menuToggle.addEventListener('click', () => {
      setMenuOpen(!mainNav.classList.contains('open'));
    });

    mainNav.addEventListener('click', (event) => {
      if (!(event.target instanceof Element)) return;
      if (event.target.closest('a')) setMenuOpen(false);
    });

    document.addEventListener('keydown', (event) => {
      if (event.key === 'Escape') setMenuOpen(false);
    });

    const handleMenuBreakpoint = (event) => {
      if (event.matches) setMenuOpen(false);
    };

    if (typeof desktopMenuQuery.addEventListener === 'function') {
      desktopMenuQuery.addEventListener('change', handleMenuBreakpoint);
    } else if (typeof desktopMenuQuery.addListener === 'function') {
      desktopMenuQuery.addListener(handleMenuBreakpoint);
    }
  }

  let scrollFrame = 0;

  function updateScrollProgress() {
    scrollFrame = 0;
    if (!scrollBar) return;

    const root = document.documentElement;
    const scrollable = Math.max(0, root.scrollHeight - window.innerHeight);
    const progress = scrollable > 0 ? (window.scrollY / scrollable) * 100 : 0;
    const clampedProgress = Math.min(100, Math.max(0, progress));
    scrollBar.style.width = `${clampedProgress}%`;
  }

  function requestScrollProgressUpdate() {
    if (scrollFrame) return;
    scrollFrame = window.requestAnimationFrame(updateScrollProgress);
  }

  window.addEventListener('scroll', requestScrollProgressUpdate, { passive: true });
  window.addEventListener('resize', requestScrollProgressUpdate, { passive: true });
  requestScrollProgressUpdate();

  if (temperatureOptions && temperatureValue && temperatureMeter) {
    const buttons = Array.from(temperatureOptions.querySelectorAll('button[data-temp]'));

    function selectTemperature(button) {
      const value = Number(button.dataset.temp);
      if (!Number.isFinite(value)) return;

      const clampedValue = Math.min(100, Math.max(0, value));

      buttons.forEach((item) => {
        const isActive = item === button;
        item.classList.toggle('active', isActive);
        item.setAttribute('aria-pressed', String(isActive));
      });

      temperatureValue.textContent = String(value);
      temperatureMeter.style.width = `${clampedValue}%`;
    }

    temperatureOptions.addEventListener('click', (event) => {
      if (!(event.target instanceof Element)) return;
      const button = event.target.closest('button[data-temp]');
      if (!(button instanceof HTMLButtonElement) || !temperatureOptions.contains(button)) return;
      selectTemperature(button);
    });

    const initialButton = buttons.find((button) => button.classList.contains('active')) || buttons[0];
    if (initialButton) selectTemperature(initialButton);
  }
})();
