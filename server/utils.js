exports.randomInt = (x) => {
    return Math.floor(Math.random() * x);
  }
  
exports.randomColor = () => {
    return Math.floor(Math.random()*16777215);
};

// both inclusive
exports.randomIntBetween = (min, max) => {
    max++;
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min) + min);
}