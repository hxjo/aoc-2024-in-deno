const input = await Deno.readFile("./input");
const lines = new TextDecoder().decode(input).split("\n");

let left: number[] = [];
let right: number[] = [];

const j = lines.length;
for (let i = 0; i < j; i++) {
  const line = lines[i];
  const [a, b] = line.split("   ");
  left.push(parseInt(a));
  right.push(parseInt(b));
}

left = left.sort();
right = right.sort();

// part 1
let totalDistance: number = 0;

for (let i = 0; i < j; i++) {
  totalDistance += Math.abs(right[i] - left[i]);
}
console.log(totalDistance);

// part 2
let similarityScore: number = 0;
const rightCounts = new Map<number, number>();
for (let i = 0; i < j; i++) {
  const count = rightCounts.get(right[i]) || 0;
  rightCounts.set(right[i], count + 1);
}

for (let i = 0; i < j; i++) {
  const leftNumber = left[i];
  similarityScore += leftNumber * (rightCounts.get(leftNumber) || 0);
}

console.log(similarityScore);

Deno.exit(0);
