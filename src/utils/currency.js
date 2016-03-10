const CURRENCY = '£';
const NORMALIZOR = /£|,|\./g; // TODO:
export const normalizor = (value) => +((value + '').replace(NORMALIZOR, '')) || 0;
export const decorateNumber = (value) => CURRENCY + value.toLocaleString();
