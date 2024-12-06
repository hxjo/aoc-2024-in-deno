const input = await Deno.readFile("./input");
const lines = new TextDecoder().decode(input).split("\n");

const j = lines.length;

type GuardOption = "^" | ">" | "<" | "v";
type Option = "." | "#" | "X" | GuardOption;
const matrix: Option[][] = [];
let nbVisited: number = 1;
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

for (let i = 0; i < j; i++) {
  const line = lines[i];
  const row: Option[] = [];
  for (let k = 0; k < line.length; k++) {
    const char = line[k];
    row.push(char as Option);
    if (char === currGuardOption) {
      guardPosition = [i, k];
    }
  }
  matrix.push(row);
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

function processNextStep(position: [Row, Col]): [Row, Col] | undefined {
  const opt = matrix[position[0]]?.[position[1]];
  let newPosition: [Row, Col] | undefined;
  switch (opt) {
    case ".": {
      newPosition = getNewPos(position);
      matrix[position[0]][position[1]] = "X";
      nbVisited += 1;
      return newPosition;
    }
    case "#": {
      const correctedPos = correctPos(position);
      currGuardOption = turningMap.get(currGuardOption)!;
      return getNewPos(correctedPos);
    }
    case "X": {
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

let currPos: [Row, Col] | undefined = [guardPosition[0] - 1, guardPosition[1]];
while (currPos) {
  currPos = processNextStep(currPos);
}

console.log(nbVisited);
