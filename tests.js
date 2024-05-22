const calculateXP = (level) => 100 * level;
const experienceFormula = (level) => Math.floor(100 * Math.pow(level, 1.5));

console.log(experienceFormula(240 + 1));
console.log(calculateXP(240 + 1));