const calculateXP = (level) => 120 * level;
const experienceFormula = (level) => Math.floor(100 * Math.pow(level, 1.5));

console.log(experienceFormula(240 + 1));
console.log(calculateXP(16 + 1));