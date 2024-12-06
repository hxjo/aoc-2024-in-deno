const input = await Deno.readFile("./input");
const lines = new TextDecoder().decode(input).split("\n");

const j = lines.length;

const rulesRegex = /(\d+)\|(\d+)/g;
let correctSum = 0;
let correctedSum = 0;

const numbersToNotBeforeMap = new Map<number, number[]>();
const correctedLines: number[][] = [];

function correctLine(line: number[]) {
  let correctedLine: number[] = [];
  for (let i = 0; i < line.length; i++) {
    const n = line[i];
    const actualNumbersBefore = line
      .slice(0, i)
      .map((number) => Number(number));
    const minimalUnexpectedNumbersBefore = (
      numbersToNotBeforeMap.get(n) || []
    ).filter((j) => actualNumbersBefore.includes(j));
    const shouldNotBeHere = actualNumbersBefore.filter((j) =>
      minimalUnexpectedNumbersBefore.includes(j)
    );
    if (shouldNotBeHere.length === 0) {
      correctedLine.push(n);
    } else {
      let maxIdx: number = -1;
      for (const number of shouldNotBeHere) {
        const idx = line.findIndex((el) => el === number);
        if (idx > maxIdx) maxIdx = idx;
      }
      correctedLine = [
        ...correctedLine.slice(0, maxIdx),
        n,
        ...correctedLine.slice(maxIdx),
      ];
    }
  }
  correctedLines.push(correctedLine);
}

function processRule(line: string) {
  const matches = line.matchAll(rulesRegex);
  for (const match of matches) {
    const a = Number(match[1]);
    const b = Number(match[2]);
    const existingValue = numbersToNotBeforeMap.get(a) || [];
    numbersToNotBeforeMap.set(a, [...existingValue, b]);
  }
}

function processInstruction(
  line: string,
  addTo: "correctSum" | "correctedSum" = "correctSum"
) {
  const pageNumbers = line.split(",");
  if (pageNumbers.length === 1) return;
  let isCorrect: boolean = true;
  for (let k = 0; k < pageNumbers.length; k++) {
    if (!isCorrect) break;
    if (k === 0) {
      continue;
    }
    const n = Number(pageNumbers[k]);
    const unexpectedNumbersBefore = numbersToNotBeforeMap.get(n) || [];
    const actualNumbersBefore = pageNumbers
      .slice(0, k)
      .map((number) => Number(number));
    if (
      actualNumbersBefore.some((number) =>
        unexpectedNumbersBefore.includes(number)
      )
    ) {
      isCorrect = false;
    }
  }
  if (isCorrect) {
    const middleNumber = pageNumbers[Math.floor(pageNumbers.length / 2)];
    if (middleNumber) {
      if (addTo === "correctSum") {
        correctSum += Number(middleNumber);
      } else {
        correctedSum += Number(middleNumber);
      }
    }
  } else {
    correctLine(line.split(",").map(Number));
  }
}

for (let i = 0; i < j; i++) {
  const line = lines[i];
  const reg = line.includes("|");
  if (reg) {
    processRule(line);
  } else {
    processInstruction(line);
  }
}

console.log(correctSum);
console.log("---- Second run -----");
for (let i = 0; i < correctedLines.length; i++) {
  const l = correctedLines[i];
  const line = l.join(",");
  processInstruction(line, "correctedSum");
}
console.log(correctedSum);
