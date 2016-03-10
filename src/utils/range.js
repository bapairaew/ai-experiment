// http://stackoverflow.com/questions/3895478/does-javascript-have-a-method-like-range-to-generate-an-array-based-on-suppl
  
export default (start, count) => {
  return Array.apply(0, Array(count)).map((element, index) => index + start);
};
