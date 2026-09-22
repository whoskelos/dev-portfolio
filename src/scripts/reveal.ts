const sections = document.querySelectorAll<HTMLElement>('[data-reveal]');

function isAtPageEnd() {
	return window.scrollY + window.innerHeight >= document.documentElement.scrollHeight - 8;
}

function finalizeReveals() {
	if (!isAtPageEnd()) return;

	for (const section of sections) {
		const rect = section.getBoundingClientRect();
		if (rect.top < window.innerHeight && rect.bottom > 0) {
			section.setAttribute('data-reveal-visible', '');
		}
	}
}

if (!CSS.supports('animation-timeline', 'view()')) {
	const observer = new IntersectionObserver(
		(entries) => {
			for (const entry of entries) {
				if (entry.isIntersecting) {
					entry.target.setAttribute('data-reveal-visible', '');
					observer.unobserve(entry.target);
				}
			}
		},
		{ rootMargin: '0px 0px 20% 0px', threshold: 0.01 },
	);

	for (const el of sections) {
		observer.observe(el);
	}
}

window.addEventListener('scroll', finalizeReveals, { passive: true });
window.addEventListener('resize', finalizeReveals, { passive: true });
finalizeReveals();
