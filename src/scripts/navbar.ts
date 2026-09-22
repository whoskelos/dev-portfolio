const navbar = document.querySelector<HTMLElement>('[data-navbar]');
if (!navbar) throw new Error('Navbar element not found');

const toggle = navbar.querySelector<HTMLButtonElement>('[data-nav-toggle]');
const toggleLabel = navbar.querySelector<HTMLElement>('[data-nav-toggle-label]');
const panel = navbar.querySelector<HTMLElement>('[data-nav-panel]');
const closeTriggers = navbar.querySelectorAll<HTMLElement>('[data-nav-close]');
const navLinks = navbar.querySelectorAll<HTMLElement>('[data-nav-link]');

if (!toggle || !toggleLabel || !panel) throw new Error('Mobile nav elements not found');

const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const supportsScrollTimeline =
	!prefersReducedMotion && CSS.supports('animation-timeline', 'scroll()');
const scrollThreshold = 96;
const drawerTransitionMs = prefersReducedMotion ? 0 : 300;

let isOpen = false;
let closeTimer: ReturnType<typeof setTimeout> | undefined;

function updateNavbarScroll() {
	navbar.toggleAttribute('data-navbar-scrolled', window.scrollY >= scrollThreshold);
}

function getFocusableElements() {
	return panel.querySelectorAll<HTMLElement>(
		'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])',
	);
}

function trapFocus(event: KeyboardEvent) {
	if (!isOpen || event.key !== 'Tab') return;

	const focusable = Array.from(getFocusableElements());
	if (focusable.length === 0) return;

	const first = focusable[0];
	const last = focusable[focusable.length - 1];

	if (event.shiftKey && document.activeElement === first) {
		event.preventDefault();
		last.focus();
	} else if (!event.shiftKey && document.activeElement === last) {
		event.preventDefault();
		first.focus();
	}
}

function setOpen(nextOpen: boolean) {
	if (nextOpen === isOpen) return;

	isOpen = nextOpen;
	clearTimeout(closeTimer);

	if (isOpen) {
		panel.removeAttribute('hidden');
		panel.setAttribute('aria-hidden', 'false');
		toggle.setAttribute('aria-expanded', 'true');
		toggleLabel.textContent = 'Cerrar menú';
		navbar.setAttribute('data-nav-open', '');
		document.body.style.overflow = 'hidden';

		requestAnimationFrame(() => {
			const firstLink = panel.querySelector<HTMLElement>('[data-nav-link]');
			firstLink?.focus();
		});
	} else {
		panel.setAttribute('aria-hidden', 'true');
		toggle.setAttribute('aria-expanded', 'false');
		toggleLabel.textContent = 'Abrir menú';
		navbar.removeAttribute('data-nav-open');
		document.body.style.overflow = '';
		toggle.focus();

		closeTimer = setTimeout(() => {
			if (!isOpen) panel.setAttribute('hidden', '');
		}, drawerTransitionMs);
	}
}

function handleToggleClick() {
	setOpen(!isOpen);
}

function handleKeydown(event: KeyboardEvent) {
	if (event.key === 'Escape' && isOpen) {
		event.preventDefault();
		setOpen(false);
		return;
	}

	trapFocus(event);
}

toggle.addEventListener('click', handleToggleClick);
document.addEventListener('keydown', handleKeydown);

closeTriggers.forEach((trigger) => {
	trigger.addEventListener('click', () => setOpen(false));
});

navLinks.forEach((link) => {
	link.addEventListener('click', () => setOpen(false));
});

window.matchMedia('(min-width: 768px)').addEventListener('change', (event) => {
	if (event.matches && isOpen) setOpen(false);
});

if (!supportsScrollTimeline) {
	updateNavbarScroll();
	window.addEventListener('scroll', updateNavbarScroll, { passive: true });
}
