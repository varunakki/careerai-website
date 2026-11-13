(function () {
    'use strict';
    // A static build sets this meta tag; the Flask build uses its own origin.
    const configured = document.querySelector('meta[name="careerai-api-base"]')?.content.trim();
    let origin = window.location.origin;
    if (configured) {
        const base = new URL(configured);
        if (!['http:', 'https:'].includes(base.protocol) || base.username || base.password || base.pathname !== '/' || base.search || base.hash) {
            throw new Error('CareerAI API configuration must be an HTTP(S) origin.');
        }
        origin = base.origin;
    }
    window.CareerAIAPI = Object.freeze({
        origin,
        url: function (route) { return origin + '/' + String(route).replace(/^\/+/, ''); }
    });
})();
