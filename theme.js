/** Persisted, keyboard-friendly theme selector. */
const THEME_STORAGE_KEY = 'portfolio-theme';
const THEME_ATTRIBUTE = 'data-theme';
const THEMES = [
  { id: 'system', name: 'System', bg: '#F2F8FC', accent: '#000000' },
  { id: 'light', name: 'Light', bg: '#F2F8FC', accent: '#000000' },
  { id: 'dark', name: 'Dark', bg: '#24221F', accent: '#D1B46A' },
  { id: 'ocean', name: 'Ocean', bg: '#1F2224', accent: '#6AAED1' },
  { id: 'forest', name: 'Forest', bg: '#20241F', accent: '#8BD16A' },
  { id: 'cyberpunk', name: 'Cyber', bg: '#241F23', accent: '#D16ABC' },
  { id: 'coffee', name: 'Coffee', bg: '#FCF6F2', accent: '#D1956A' },
];

class ThemePicker {
  constructor() {
    this.root = document.documentElement;
    this.toggleBtn = document.getElementById('theme-toggle');
    this.menu = document.getElementById('theme-menu');
    this.overlay = document.getElementById('theme-menu-overlay');
    const storedTheme = localStorage.getItem(THEME_STORAGE_KEY);
    this.activeTheme = THEMES.some((theme) => theme.id === storedTheme) ? storedTheme : 'system';
    this.isOpen = false;
    this.init();
  }

  init() {
    if (!this.toggleBtn || !this.menu) return;
    this.renderMenu();
    this.menu.inert = true;
    this.applyTheme(this.activeTheme, false);
    this.toggleBtn.addEventListener('click', () => this.toggleMenu());
    document.addEventListener('keydown', (event) => {
      if (event.key === 'Escape') this.closeMenu();
    });
    document.addEventListener('click', (event) => {
      if (this.isOpen && !this.menu.contains(event.target) && !this.toggleBtn.contains(event.target)) this.closeMenu();
    });
    this.menu.addEventListener('click', (event) => {
      const option = event.target.closest('.theme-option');
      if (!option) return;
      this.applyTheme(option.dataset.theme);
      this.closeMenu();
    });
  }

  renderMenu() {
    this.menu.innerHTML = THEMES.map((theme) => `
      <button class="theme-option" data-theme="${theme.id}" role="menuitemradio" aria-checked="${this.activeTheme === theme.id}">
        <span class="theme-swatch" aria-hidden="true" style="--swatch-bg: ${theme.bg}; --swatch-accent: ${theme.accent};"></span>
        <span>${theme.name}</span>
      </button>`).join('');
  }

  applyTheme(themeId, save = true) {
    if (themeId === 'system') this.root.removeAttribute(THEME_ATTRIBUTE);
    else this.root.setAttribute(THEME_ATTRIBUTE, themeId);
    if (!save) return;
    this.activeTheme = themeId;
    if (themeId === 'system') localStorage.removeItem(THEME_STORAGE_KEY);
    else localStorage.setItem(THEME_STORAGE_KEY, themeId);
    this.menu.querySelectorAll('.theme-option').forEach((option) => {
      option.setAttribute('aria-checked', String(option.dataset.theme === themeId));
    });
  }

  toggleMenu() { this.isOpen ? this.closeMenu() : this.openMenu(); }
  openMenu() {
    this.isOpen = true;
    this.menu.inert = false;
    this.menu.setAttribute('aria-hidden', 'false');
    this.toggleBtn.setAttribute('aria-expanded', 'true');
    this.menu.querySelector('.theme-option')?.focus();
  }
  closeMenu() {
    if (!this.isOpen) return;
    this.isOpen = false;
    this.menu.inert = true;
    this.menu.setAttribute('aria-hidden', 'true');
    this.toggleBtn.setAttribute('aria-expanded', 'false');
    this.toggleBtn.focus();
  }
}

document.addEventListener('DOMContentLoaded', () => { window.themePicker = new ThemePicker(); });
