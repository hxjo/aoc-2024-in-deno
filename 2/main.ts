const input = await Deno.readFile("./input");
const lines = new TextDecoder().decode(input).split("\n");

const j = lines.length;
// part 1
let numberOfSafeReports: number = 0;

function isSafe(numbers: number[]) {
  const l = numbers.length;
  const reverseSorted = JSON.stringify(numbers.toSorted((a, b) => a - b));
  const sorted = JSON.stringify(numbers.toSorted((a, b) => b - a));
  const strNumbers = JSON.stringify(numbers);
  if (reverseSorted !== strNumbers && sorted !== strNumbers) {
    return false;
  }
  for (let k = 0; k < l; k++) {
    if (k + 1 !== l) {
      const num = numbers[k];
      const nextNum = numbers[k + 1];
      const diff = Math.abs(num - nextNum);
      if (diff > 3 || diff < 1) {
        return false;
      }
    }
  }
  return true;
}

for (let i = 0; i < j; i++) {
  const line = lines[i];
  const numbers = line.split(" ").map((n) => Number(n));
  if (isSafe(numbers)) {
    numberOfSafeReports += 1;
  }
}

console.log(numberOfSafeReports);

let numberOfTrueSafeReports: number = 0;

for (let i = 0; i < j; i++) {
  const line = lines[i];
  const numbers = line.split(" ").map((n) => Number(n));
  const options: number[][] = [numbers];
  const k = numbers.length;
  let safe: boolean = false;
  for (let i = 0; i < k; i++) {
    const opt = [...numbers];
    opt.splice(i, 1);
    options.push(opt);
  }
  for (let i = 0; i < options.length; i++) {
    if (isSafe(options[i])) {
      safe = true;
      break;
    }
  }
  if (safe) numberOfTrueSafeReports += 1;
}

console.log(numberOfTrueSafeReports);
