function debounce(fn, wait) {
    let t;
    return (...args) => {
        clearTimeout(t);
        t = setTimeout(() => fn.apply(this, args), wait);
    };
}

function fetchConfig(type = 'json') {
    return {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Accept': `application/${type}` }
    };
}

function onKeyUpEscape(event) {
    if (event.code.toUpperCase() !== 'ESCAPE') return;

    const openDetailsElement = event.target.closest('details[open]');
    if (!openDetailsElement) return;

    const summaryElement = openDetailsElement.querySelector('summary');
    openDetailsElement.removeAttribute('open');
    summaryElement.setAttribute('aria-expanded', false);
    summaryElement.focus();
}