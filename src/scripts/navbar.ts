const navbar = document.querySelector<HTMLElement>('[data-navbar]');
if (!navbar) throw new Error('Navbar element not found');

const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const supportsScrollTimeline =
	!prefersReducedMotion && CSS.supports('animation-timeline', 'scroll()');
const threshold = 96;

function updateNavbar() {
	navbar.toggleAttribute('data-navbar-scrolled', window.scrollY >= threshold);
}

if (!supportsScrollTimeline) {
	updateNavbar();
	window.addEventListener('scroll', updateNavbar, { passive: true });
}
