// for window.scroll or document.querySelector('.hello').scrollIntoView({ behavior: 'smooth' })
window.__forceSmoothScrollPolyfill__ = true
require('smoothscroll-polyfill').polyfill()
