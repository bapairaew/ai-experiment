// http://stackoverflow.com/questions/25553910/one-liner-to-take-some-properties-from-object-in-es6

export default (o, ...fields) => {
  return Object.assign({}, ...(for (p of fields) {[p]: o[p]}));
};
