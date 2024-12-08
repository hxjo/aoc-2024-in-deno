import { progress } from "jsr:@ryweal/progress";
const input = await Deno.readFile("./input");
const lines = new TextDecoder().decode(input).split("\n");

const j = lines.length;

type GuardOption = "^" | ">" | "<" | "v";
type Option = "." | "#" | "X" | "O" | GuardOption;
type Matrix = Option[][];
const initialMatrix: Matrix = [];
let nbVisited: number = 0;
type Row = number;
type Col = number;
let guardPosition: [Row, Col] = [-1, -1];
let currGuardOption: GuardOption = "^";

const turningMap = new Map<GuardOption, GuardOption>([
  ["<", "^"],
  ["^", ">"],
  [">", "v"],
  ["v", "<"],
]);

const alreadyVisitedMap = new Map<string, number>();

for (let i = 0; i < j; i++) {
  const line = lines[i];
  const row: Option[] = [];
  for (let k = 0; k < line.length; k++) {
    const char = line[k];
    if (char === currGuardOption) {
      guardPosition = [i, k];
      row.push(".");
    } else {
      row.push(char as Option);
    }
  }
  initialMatrix.push(row);
}

function getNewPos(position: [Row, Col]): [Row, Col] | undefined {
  switch (currGuardOption) {
    case "<": {
      return [position[0], position[1] - 1];
    }
    case ">": {
      return [position[0], position[1] + 1];
    }
    case "^": {
      return [position[0] - 1, position[1]];
    }
    case "v": {
      return [position[0] + 1, position[1]];
    }
  }
}

function correctPos(position: [Row, Col]): [Row, Col] {
  switch (currGuardOption) {
    case "<": {
      return [position[0], position[1] + 1];
    }
    case ">": {
      return [position[0], position[1] - 1];
    }
    case "^": {
      return [position[0] + 1, position[1]];
    }
    case "v": {
      return [position[0] - 1, position[1]];
    }
  }
}

let workingObstructions: number = 0;

function processNextStep(
  position: [Row, Col],
  matrix: Matrix
): [Row, Col] | undefined {
  const opt = matrix[position[0]]?.[position[1]];
  let newPosition: [Row, Col] | undefined;
  switch (opt) {
    case ".": {
      newPosition = getNewPos(position);
      matrix[position[0]][position[1]] = "X";
      nbVisited += 1;
      return newPosition;
    }
    case "#":
    case "O": {
      const correctedPos = correctPos(position);
      currGuardOption = turningMap.get(currGuardOption)!;
      return getNewPos(correctedPos);
    }
    case "X": {
      const alreadyVisitedNb =
        alreadyVisitedMap.get(JSON.stringify(position)) ?? 0;
      alreadyVisitedMap.set(JSON.stringify(position), alreadyVisitedNb + 1);
      if (alreadyVisitedNb + 1 > 3) {
        workingObstructions += 1;
        return undefined;
      }
      return getNewPos(position);
    }
    case undefined: {
      return undefined;
    }
    default: {
      console.log(opt);
      throw new Error("Invalid position");
    }
  }
}
// part 1
// let currPos: [Row, Col] | undefined = [guardPosition[0], guardPosition[1]];
// while (currPos) {
//   currPos = processNextStep(currPos, initialMatrix);
// }
// console.log(nbVisited);

function deepCopyMatrix(matrix: Matrix): Matrix {
  return matrix.map((row) => row.slice());
}

const matrices: Matrix[] = [];

const p = progress(
  "Building matrices | [[bar]] | [[count]]/[[total]] [[rate]] [[eta]]\n",
  { total: initialMatrix.length * initialMatrix[0].length }
);
for (let i = 0; i < initialMatrix.length; i++) {
  const row = initialMatrix[i];
  for (let k = 0; k < row.length; k++) {
    p.next();
    const opt = row[k];
    if (opt === ".") {
      if (i === guardPosition[0] && k === guardPosition[1]) continue;
      const newMatrix = deepCopyMatrix(initialMatrix);

      newMatrix[i][k] = "O";
      matrices.push(newMatrix);
    }
  }
}

const p2 = progress(
  "Processing options | [[bar]] | [[count]]/[[total]] [[rate]] [[eta]]\n",
  { total: matrices.length }
);
// part 2
for (let i = 0; i < matrices.length; i++) {
  currGuardOption = "^";
  p2.next();
  const matrix = matrices[i];
  let currPos: [Row, Col] | undefined = [guardPosition[0], guardPosition[1]];
  while (currPos) {
    currPos = processNextStep(currPos, matrix);
  }
  alreadyVisitedMap.clear();
}

console.log(workingObstructions);
