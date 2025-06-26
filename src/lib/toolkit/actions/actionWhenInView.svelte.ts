export const actionWhenInViewport = (
	element: Element,
	args: {
		callbackFunction: () => void;
	}
) => {
	const { callbackFunction } = args;
	const observer = new IntersectionObserver((entries) => {
		if (entries[0].isIntersecting) {
			callbackFunction();
		}
	});

	observer.observe(element);
};
