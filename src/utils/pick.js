// http://stackoverflow.com/questions/25553910/one-liner-to-take-some-properties-from-object-in-es6

export default (o, ...fields) => {
  const has = p => o.hasOwnProperty(p);
  return Object.assign({}, ...(for (p of fields) if (has(p)) {[p]: o[p]}));
};
