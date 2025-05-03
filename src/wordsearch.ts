import * as R from "ramda";

export type Wordsearch = { letter: string, words: string[], found: boolean }[][];
export type Vector2D = { x: number, y: number };

type Direction = "horizontal" | "vertical" | "diagonal-up" | "diagonal-down";

const directions: Direction[] = ["horizontal", "vertical", "diagonal-up", "diagonal-down"];

// noinspection SpellCheckingInspection
const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";

export function generateWordsearch(size: number, words: string[]): Wordsearch | null {
    // Preprocess the words by converting each word string to upper case and removing non-alphabet characters
    words = R.map(w => R.join("", R.filter(letter => R.includes(letter, letters), R.split("", R.toUpper(w)))), words);

    words = reverseSomeWords(words);

    let wordsearch: Wordsearch | null = fillWordsearch(size);

    wordsearch = placeWords(wordsearch, size, words, false);

    if (wordsearch === null) {
        return null;
    }

    return wordsearch;
}

function reverseSomeWords(words: string[]): string[] {
    return R.map(w => Math.random() >= 0.5 ? R.reverse(w) : w, words);
}

// Given a direction, origin and index of a letter within a word, compute the coordinates this letter should be placed in
function computeLetterCoords(direction: Direction, origin: Vector2D, index: number): Vector2D {
    return {
        x: (direction === "vertical") ? origin.x : origin.x + index,
        y: (direction === "horizontal") ? origin.y : ((direction === "diagonal-up") ? origin.y - index : origin.y + index),
    };
}

function generateWordOrigin(direction: Direction, size: number, word: string): Vector2D {
    // Both min and max origin values are inclusive
    const minOrigin = computeMinOrigin(direction, word);
    const maxOrigin = computeMaxOrigin(direction, size, word);

    return {
        x: Math.floor(Math.random() * (maxOrigin.x + 1 - minOrigin.x)) + minOrigin.x,
        y: Math.floor(Math.random() * (maxOrigin.y + 1 - minOrigin.y)) + minOrigin.y,
    };
}

function computeMinOrigin(direction: Direction, word: string): Vector2D {
    return {
        x: 0,
        y: (direction === "diagonal-up") ? word.length - 1 : 0,
    };
}

function computeMaxOrigin(direction: Direction, size: number, word: string): Vector2D {
    return {
        x: (direction === "vertical") ? size - 1 : size - word.length,
        y: (direction === "diagonal-up") ? size - 1 : size - word.length,
    };
}

function placeWord(wordsearch: Wordsearch, word: string, size: number): Wordsearch | null {
    // Currently, if word cannot be placed, chooses new origin and direction and tries to place again; could change to
    // restrict choice of origin (so don't need to choose new origin) but possibly very complicated and inefficient
    let direction: Direction | null = null;
    let origin: Vector2D | null = null;
    let ok: boolean = false;
    const maxAttempts = 10000;
    for (let i = 0; i < maxAttempts && !ok; i++) {
        direction = directions[Math.floor(Math.random() * directions.length)];

        origin = generateWordOrigin(direction, size, word);

        ok = checkOverlap(wordsearch, direction, word, origin);
    }

    // If such origin not found (max no. of attempts was reached) then return
    if (!ok || direction === null || origin === null) {
        return null;
    }

    // Actually place the letters into the wordsearch
    const updatedWordsearch = R.clone(wordsearch);
    for (let i = 0; i < word.length; i++) {
        const letter = word[i];
        const letterCoords = computeLetterCoords(direction, origin, i);

        updatedWordsearch[letterCoords.y][letterCoords.x] = {
            letter: letter,
            words: R.append(word, updatedWordsearch[letterCoords.y][letterCoords.x].words),
            found: false
        };
    }

    return updatedWordsearch;
}

function checkOverlap(wordsearch: Wordsearch, direction: Direction, string: string, origin: Vector2D): boolean {
    // Check that, using the chosen origin, the word can be placed without overlapping other words
    // Overlapping is only allowed if:
    // 1. The points of overlap involve the same letter
    // 2. There is only one point of intersection
    let prevCellWordIds: string[] = [];
    for (let i = 0; i < string.length; i++) {
        const letter = string[i];

        // Get cell in the wordsearch where the letter will be placed
        const letterCoords = computeLetterCoords(direction, origin, i);
        const cell = wordsearch[letterCoords.y][letterCoords.x];

        // If cell not already used by any words, that's fine - continue to next letter
        // If cell is already used, check the letters are the same and that no same two words have been intersected
        // consecutively by this word
        if (!R.isEmpty(cell.words) && (cell.letter !== letter || !R.empty(R.intersection(prevCellWordIds, cell.words)))) {
            return false;
        } else {
            prevCellWordIds = cell.words;
        }
    }

    return true;
}

function fillWordsearch(size: number): Wordsearch {
    return R.map(() => R.map(() => ({
        letter: letters[Math.floor(Math.random() * letters.length)],
        words: [],
        found: false,
    }), R.range(0, size)), R.range(0, size));
}

function placeWords(wordsearch: Wordsearch, size: number, words: string[], ignoreFailures: boolean = false): Wordsearch | null {
    // Could use R.all() but that doesn't seem to short-circuit
    let updatedWordsearch = wordsearch; // OK as wordsearch is cloned inside placeWord() anyway

    for (const word of words) {
        const updatedWordsearch1 = placeWord(updatedWordsearch, word, size);
        // If placing word fails (i.e. resulting wordsearch is null):
        // * If ignoreFailures is true, don't do anything - effectively discarding the resulting wordsearch
        // * Otherwise, immediately return null
        // If word was placed successfully (i.e. resulting wordsearch is not null), keep the resulting wordsearch
        if (updatedWordsearch1 === null) {
            if (!ignoreFailures) {
                return null;
            }
        } else {
            updatedWordsearch = updatedWordsearch1;
        }
    }

    return updatedWordsearch;
}

const isPointWithinGrid = (point: Vector2D, size: number): boolean =>
    point.x >= 0 && point.y >= 0 && point.x < size && point.y < size;

function isValidSelection(point1: Vector2D | null, point2: Vector2D | null, size: number): boolean {
    if (!point1 || !point2) {
        return false;
    }

    if (!isPointWithinGrid(point1, size) || !isPointWithinGrid(point2, size)) {
        return false;
    }

    const dx = point2.x - point1.x;
    const dy = point2.y - point1.y;
    return dx === 0 || dy === 0 || (dx === dy);
}

// todo: move to common module ?
export function getLine(point1: Vector2D | null, point2: Vector2D | null, size: number): Vector2D[] {
    if (!isValidSelection(point1, point2, size)) {
        return [];
    }

    // Checked in `isValidSelection`
    point1 = point1!;
    point2 = point2!;

    const xDelta = point2.x - point1.x;
    const yDelta = point2.y - point1.y;
    const xDeltaNormalized = Math.sign(xDelta);
    const yDeltaNormalized = Math.sign(yDelta);

    const points: Vector2D[] = [];
    for (let i = 0; i <= Math.max(Math.abs(xDelta), Math.abs(yDelta)); i++) {
        const dx = i * xDeltaNormalized;
        const dy = i * yDeltaNormalized;
        const x = point1.x + dx;
        const y = point1.y + dy;

        const point = { x, y };
        if (isPointWithinGrid(point, size)) {
            points.push(point);
        }
    }

    return points;
}
