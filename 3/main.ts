const input = await Deno.readTextFile("./input");

let total: number = 0;

// part 1
const regex = /mul\((\d{1,3}),(\d{1,3})\)/gm;
const res = input.matchAll(regex);

for (const match of res) {
  const a = match[1];
  const b = match[2];
  total += Number(a) * Number(b);
}

console.log(total);

// part 2
let newTotal: number = 0;

const newRegex = /(mul\((\d{1,3}),(\d{1,3})\))|(don't\(\)|do\(\))/gm;
const newRes = input.matchAll(newRegex);
let currState: "do()" | "don't()" = "do()";

for (const match of newRes) {
  const a = match[2];
  const b = match[3];
  const state = match[4] as "do()" | "don't()";
  if (state) {
    currState = state;
    continue;
  }
  if (currState === "do()") {
    newTotal += Number(a) * Number(b);
  }
}

console.log(newTotal);
