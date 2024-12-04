const input = await Deno.readFile("./input");
const lines = new TextDecoder().decode(input).split("\n");

const j = lines.length;

// part 1
const inOrder = ["X", "M", "A", "S"];
const inReverseOrder = inOrder.reverse();
function findVertically(row: number, col: number, reverse: boolean): boolean {
  const firstLetter = lines[row][col];
  const lettersToFind = reverse ? inReverseOrder : inOrder;

  const letters: string[] = [firstLetter];

  for (let i = 1; i < 4; i++) {
    const newRow = reverse ? row - i : row + i;
    const currLetter = lines[newRow]?.[col];

    letters.push(currLetter);
  }
  return JSON.stringify(lettersToFind) === JSON.stringify(letters);
}

function findHorizontally(row: number, col: number, reverse: boolean): boolean {
  const firstLetter = lines[row][col];
  const lettersToFind = reverse ? inReverseOrder : inOrder;

  const letters: string[] = [firstLetter];

  for (let i = 1; i < 4; i++) {
    const newCol = reverse ? col - i : col + i;
    const currLetter = lines[row]?.[newCol];
    letters.push(currLetter);
  }

  return JSON.stringify(lettersToFind) === JSON.stringify(letters);
}

function findDiagonally(
  row: number,
  col: number,
  where: "top-left" | "top-right" | "bottom-left" | "bottom-right"
): boolean {
  const firstLetter = lines[row][col];
  const reverse = where.startsWith("top");
  const lettersToFind = reverse ? inReverseOrder : inOrder;

  const letters: string[] = [firstLetter];

  for (let i = 1; i < 4; i++) {
    const newCol = where.endsWith("-left") ? col - i : col + i;
    const newRow = reverse ? row - i : row + i;
    const currLetter = lines[newRow]?.[newCol];
    letters.push(currLetter);
  }
  return JSON.stringify(lettersToFind) === JSON.stringify(letters);
}

let totalOccurences: number = 0;

for (let i = 0; i < j; i++) {
  const line = lines[i];
  for (let k = 0; k < line.length; k++) {
    if (findVertically(i, k, true)) totalOccurences += 1;
    if (findVertically(i, k, false)) totalOccurences += 1;
    if (findHorizontally(i, k, true)) totalOccurences += 1;
    if (findHorizontally(i, k, false)) totalOccurences += 1;
    if (findDiagonally(i, k, "top-left")) totalOccurences += 1;
    if (findDiagonally(i, k, "bottom-left")) totalOccurences += 1;
    if (findDiagonally(i, k, "top-right")) totalOccurences += 1;
    if (findDiagonally(i, k, "bottom-right")) totalOccurences += 1;
  }
}
console.log(totalOccurences);

// part 2

function findXMas(row: number, col: number): boolean {
  const firstLetter = lines[row][col];
  if (firstLetter !== "M" && firstLetter !== "S") return false;

  const middleLetter = lines[row + 1]?.[col + 1];

  if (middleLetter !== "A") return false;

  const endLetter = lines[row + 2]?.[col + 2];
  const expectedEndLetter = firstLetter === "M" ? "S" : "M";
  if (endLetter !== expectedEndLetter) return false;

  const otherFirstLetter = lines[row + 2][col];
  if (otherFirstLetter !== "M" && otherFirstLetter !== "S") return false;
  const otherEndLetter = lines[row]?.[col + 2];
  const otherExpectedEndLetter = otherFirstLetter === "M" ? "S" : "M";
  if (otherEndLetter !== otherExpectedEndLetter) return false;

  return true;
}

let totalTrueOccurences: number = 0;

for (let i = 0; i < j; i++) {
  const line = lines[i];
  for (let k = 0; k < line.length; k++) {
    if (findXMas(i, k)) totalTrueOccurences += 1;
  }
}

console.log(totalTrueOccurences);
