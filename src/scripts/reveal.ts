const observer = new IntersectionObserver(
	(entries) => {
		for (const entry of entries) {
			if (entry.isIntersecting) {
				entry.target.setAttribute('data-reveal-visible', '');
				observer.unobserve(entry.target);
			}
		}
	},
	{ rootMargin: '0px 0px -8% 0px', threshold: 0.08 },
);

for (const el of document.querySelectorAll<HTMLElement>('[data-reveal]')) {
	observer.observe(el);
}
