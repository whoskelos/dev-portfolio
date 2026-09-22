const STORAGE_KEY = 'theme';
const LABEL_TO_DARK = 'Activar modo oscuro';
const LABEL_TO_LIGHT = 'Activar modo claro';

const media = window.matchMedia('(prefers-color-scheme: dark)');
const toggle = document.querySelector<HTMLButtonElement>('[data-theme-toggle]');
const toggleLabel = toggle?.querySelector<HTMLElement>('[data-theme-toggle-label]');

function storedTheme(): 'light' | 'dark' | null {
	const value = localStorage.getItem(STORAGE_KEY);
	return value === 'light' || value === 'dark' ? value : null;
}

function systemPrefersDark() {
	return media.matches;
}

function resolveTheme(): 'light' | 'dark' {
	return storedTheme() ?? (systemPrefersDark() ? 'dark' : 'light');
}

function applyTheme(theme: 'light' | 'dark') {
	document.documentElement.classList.toggle('dark', theme === 'dark');

	if (toggle) {
		toggle.setAttribute('aria-label', theme === 'dark' ? LABEL_TO_LIGHT : LABEL_TO_DARK);
	}

	if (toggleLabel) {
		toggleLabel.textContent = theme === 'dark' ? LABEL_TO_LIGHT : LABEL_TO_DARK;
	}
}

function setTheme(theme: 'light' | 'dark') {
	localStorage.setItem(STORAGE_KEY, theme);
	applyTheme(theme);
}

applyTheme(resolveTheme());

toggle?.addEventListener('click', () => {
	setTheme(document.documentElement.classList.contains('dark') ? 'light' : 'dark');
});

media.addEventListener('change', () => {
	if (storedTheme()) return;
	applyTheme(systemPrefersDark() ? 'dark' : 'light');
});
