/**
 * Theme Switcher Logic
 */

const THEME_STORAGE_KEY = 'portfolio-theme';
const THEME_ATTRIBUTE = 'data-theme';

const THEMES = [
    { id: 'system', name: 'System', bg: '#e5e5e5', accent: '#333333' },
    { id: 'light', name: 'Light', bg: '#F2F2F2', accent: '#000000' },
    { id: 'dark', name: 'Dark', bg: '#0f0f0f', accent: '#ffffff' },
    { id: 'ocean', name: 'Ocean', bg: '#0f172a', accent: '#38bdf8' },
    { id: 'forest', name: 'Forest', bg: '#1a2e05', accent: '#a3e635' },
    { id: 'cyberpunk', name: 'Cyberpunk', bg: '#050505', accent: '#00ff41' },
    { id: 'coffee', name: 'Coffee', bg: '#f5ebe0', accent: '#d4a373' },
];

class ThemePicker {
    constructor() {
        this.root = document.documentElement;
        this.toggleBtn = document.getElementById('theme-toggle');
        this.menu = document.getElementById('theme-menu');
        this.overlay = document.getElementById('theme-menu-overlay');
        this.isOpen = false;
        this.activeTheme = this.getStoredTheme();
        this.previewTimeout = null;

        this.init();
    }

    init() {
        this.renderMenu();
        this.applyTheme(this.activeTheme, false); // false = don't save yet (already saved)
        this.addEventListeners();
    }

    getStoredTheme() {
        return localStorage.getItem(THEME_STORAGE_KEY) || 'system';
    }

    saveTheme(themeId) {
        if (themeId === 'system') {
            localStorage.removeItem(THEME_STORAGE_KEY);
        } else {
            localStorage.setItem(THEME_STORAGE_KEY, themeId);
        }
    }

    applyTheme(themeId, save = true) {
        if (themeId === 'system') {
            this.root.removeAttribute(THEME_ATTRIBUTE);
        } else {
            this.root.setAttribute(THEME_ATTRIBUTE, themeId);
        }

        if (save) {
            this.activeTheme = themeId;
            this.saveTheme(themeId);
            this.updateActiveState();
        }
    }

    previewTheme(themeId) {
        if (themeId === 'system') {
            this.root.removeAttribute(THEME_ATTRIBUTE);
        } else {
            this.root.setAttribute(THEME_ATTRIBUTE, themeId);
        }
    }

    resetPreview() {
        this.applyTheme(this.activeTheme, false);
    }

    toggleMenu() {
        this.isOpen = !this.isOpen;
        this.menu.setAttribute('aria-hidden', !this.isOpen);
        this.overlay.setAttribute('aria-hidden', !this.isOpen);
        this.toggleBtn.setAttribute('aria-expanded', this.isOpen);
        
        if (this.isOpen) {
            // Focus first item
            const firstOption = this.menu.querySelector('.theme-option');
            if (firstOption) firstOption.focus();
        } else {
            this.toggleBtn.focus();
        }
    }

    closeMenu() {
        if (!this.isOpen) return;
        this.isOpen = false;
        this.menu.setAttribute('aria-hidden', 'true');
        this.overlay.setAttribute('aria-hidden', 'true');
        this.toggleBtn.setAttribute('aria-expanded', 'false');
        this.resetPreview();
    }

    renderMenu() {
        if (!this.menu) return;
        
        this.menu.innerHTML = THEMES.map(theme => `
            <button class="theme-option" data-theme="${theme.id}" role="menuitemradio" aria-checked="${this.activeTheme === theme.id}">
                <div class="theme-swatch" style="--swatch-bg: ${theme.bg}; --swatch-accent: ${theme.accent};"></div>
                <span>${theme.name}</span>
            </button>
        `).join('');
    }

    updateActiveState() {
        const options = this.menu.querySelectorAll('.theme-option');
        options.forEach(opt => {
            opt.setAttribute('aria-checked', opt.dataset.theme === this.activeTheme);
        });
    }

    addEventListeners() {
        // Toggle
        if (this.toggleBtn) {
            this.toggleBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                this.toggleMenu();
            });
        }

        // Overlay click
        if (this.overlay) {
            this.overlay.addEventListener('click', () => this.closeMenu());
        }

        // Close on Escape
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.isOpen) {
                this.closeMenu();
            }
        });

        // Click outside (backup for desktop where overlay might not be used or visible)
        document.addEventListener('click', (e) => {
            if (this.isOpen && !this.menu.contains(e.target) && !this.toggleBtn.contains(e.target)) {
                this.closeMenu();
            }
        });

        // Theme Options
        this.menu.addEventListener('click', (e) => {
            const btn = e.target.closest('.theme-option');
            if (!btn) return;

            const themeId = btn.dataset.theme;
            this.applyTheme(themeId, true);
            this.closeMenu();
        });

        // Hover Preview (Desktop)
        this.menu.addEventListener('mouseover', (e) => {
            const btn = e.target.closest('.theme-option');
            
            // Always clear pending preview to avoid race conditions
            clearTimeout(this.previewTimeout);

            if (btn) {
                // Debounce preview slightly
                this.previewTimeout = setTimeout(() => {
                    this.previewTheme(btn.dataset.theme);
                }, 50);
            } else {
                // If we are in the menu but not on a button (e.g. gap), reset
                this.resetPreview();
            }
        });

        this.menu.addEventListener('mouseleave', () => {
            clearTimeout(this.previewTimeout);
            this.resetPreview();
        });

        // Touch Preview (Mobile) - Long press simulation
        let touchTimer;
        this.menu.addEventListener('touchstart', (e) => {
            const btn = e.target.closest('.theme-option');
            if (!btn) return;

            touchTimer = setTimeout(() => {
                this.previewTheme(btn.dataset.theme);
            }, 200);
        }, { passive: true });

        this.menu.addEventListener('touchend', () => {
            clearTimeout(touchTimer);
            // If we just tapped, the click event will fire and select it.
            // If we held, we want to reset preview if they didn't select? 
            // Actually, if they release, maybe we should just select it?
            // The requirements said: "Release tap -> apply theme".
            // The click handler will handle the application.
            // We just need to ensure preview doesn't get stuck if they drag away.
        }, { passive: true });
    }
}

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    window.themePicker = new ThemePicker();
});
