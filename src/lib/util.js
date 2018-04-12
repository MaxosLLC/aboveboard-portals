export const appType = window.REACT_APP_APP_TYPE || (/issuer/.test(window.location.hostname) ? 'issuer' : 'broker')
