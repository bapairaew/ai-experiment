export default (current, prev) => {
  return current.round !== prev.round && current.round === 1;
};
