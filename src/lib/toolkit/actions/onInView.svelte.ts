import { onDestroy, onMount } from "svelte";

export const inView = (el: Element, args: {
    callbackFunction: () => void;
    revertFunction?: () => void;
}
) => {

    const { callbackFunction, revertFunction } = args

    let observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                callbackFunction()
            } else if (revertFunction) {
                revertFunction()
            }
        });
    });

    onMount(() => {
        observer.observe(el);
    });

    onDestroy(() => {
        observer.disconnect();
    });
}