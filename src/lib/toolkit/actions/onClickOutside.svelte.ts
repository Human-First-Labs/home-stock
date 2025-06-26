import { onMount } from 'svelte';

export const clickOutside = (
	element: Node,
	args: {
		callbackFunction: () => void;
	}
) => {
	let { callbackFunction } = args;

	const onClick: (this: HTMLElement, ev: MouseEvent) => unknown = (event) => {
		// Trigger the callback if the click is outside the element
		if (event.target instanceof Node && !element.contains(event.target)) {
			callbackFunction();
		}
	};

	// Attach the event listener when the action is mounted
	onMount(() => {
		document.body.addEventListener('click', onClick, true); // Use capture phase to ensure proper event handling
		return () => {
			document.body.removeEventListener('click', onClick, true);
		};
	});
};
