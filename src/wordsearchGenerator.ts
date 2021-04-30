import * as R from "ramda";
import {v4 as uuidv4} from "uuid";
import {getEnumLength} from "./utilities";

type Word = {id: string, text: string};
type Wordsearch = {letter: string, wordIds: string[]}[][];
type Coords = {x: number, y: number};

enum Direction {
  Horizontal,
  Vertical,
  DiagonalUp,
  DiagonalDown,
}

// noinspection SpellCheckingInspection
const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";

export function generateWordsearch(size: number, words: Word[], allowBackwards: boolean, allowParts: boolean): Wordsearch | null {
  // Preprocess the words by converting each word string to upper case and removing non-alphabet characters
  words = R.map(w => ({
    id: w.id,
    text: R.join("", R.filter(letter => R.includes(letter, letters), R.split("", R.toUpper(w.text))))
  }), words);

  words = reverseSomeWords(words, allowBackwards);

  let wordsearch: Wordsearch | null = fillWordsearch(size);

  wordsearch = placeWords(wordsearch, size, words, false);

  if (wordsearch === null) {
    return null;
  }

  if (allowParts) {
    let parts = generateParts(words);
    parts = reverseSomeWords(parts, allowBackwards);
    wordsearch = placeWords(wordsearch, size, parts, true);

    if (wordsearch === null) {
      return null;
    }
  }

  return wordsearch;
}

function reverseSomeWords(words: Word[], allowBackwards: boolean): Word[] {
  // Reverse some words (if allowBackwards is true)
  return R.map(w => {
    // If allowBackwards parameter is true, randomly choose whether to place the word backwards
    const backwards = allowBackwards && Math.random() >= 0.5;
    return {
      id: w.id,
      text: backwards ? R.reverse(w.text) : w.text
    };
  }, words);
}

// Given a direction, origin and index of a letter within a word, compute the coordinates this letter should be placed in
function computeLetterCoords(direction: Direction, origin: Coords, index: number): Coords {
  return {
    x: (direction === Direction.Vertical) ? origin.x : origin.x + index,
    y: (direction === Direction.Horizontal) ? origin.y : ((direction === Direction.DiagonalUp) ? origin.y - index : origin.y + index),
  };
}

function generateWordOrigin(direction: Direction, size: number, word: Word): Coords {
  // Both min and max origin values are inclusive
  const minOrigin = computeMinOrigin(direction, word);
  const maxOrigin = computeMaxOrigin(direction, size, word);

  return {
    x: Math.floor(Math.random() * (maxOrigin.x + 1 - minOrigin.x)) + minOrigin.x,
    y: Math.floor(Math.random() * (maxOrigin.y + 1 - minOrigin.y)) + minOrigin.y,
  };
}

function computeMinOrigin(direction: Direction, word: Word): Coords {
  return {
    x: 0,
    y: (direction === Direction.DiagonalUp) ? word.text.length - 1 : 0,
  };
}

function computeMaxOrigin(direction: Direction, size: number, word: Word): Coords {
  return {
    x: (direction === Direction.Vertical) ? size - 1 : size - word.text.length,
    y: (direction === Direction.DiagonalUp) ? size - 1 : size - word.text.length,
  };
}

function placeWord(wordsearch: Wordsearch, word: Word, size: number): Wordsearch | null {
  // Currently, if word cannot be placed, chooses new origin and direction and tries to place again; could change to
  // restrict choice of origin (so don't need to choose new origin) but possibly very complicated and inefficient
  let direction: Direction | null = null;
  let origin: Coords | null = null;
  let ok: boolean = false;
  const maxAttempts = 10000;
  for (let i = 0; i < maxAttempts && !ok; i++) {
    direction = Math.floor(Math.random() * getEnumLength(Direction));

    origin = generateWordOrigin(direction, size, word);

    ok = checkOverlap(wordsearch, direction, word.text, origin);
  }

  // If such origin not found (max no. of attempts was reached) then return
  if (!ok || direction === null || origin === null) {
    return null;
  }

  // Actually place the letters into the wordsearch
  let updatedWordsearch = R.clone(wordsearch);
  for (let i = 0; i < word.text.length; i++) {
    let letter = word.text[i];
    let letterCoords = computeLetterCoords(direction, origin, i);

    updatedWordsearch[letterCoords.y][letterCoords.x] = {
      letter: letter,
      wordIds: word.id === null
        ? updatedWordsearch[letterCoords.y][letterCoords.x].wordIds
        : R.append(word.id, updatedWordsearch[letterCoords.y][letterCoords.x].wordIds)
    };
  }

  return updatedWordsearch;
}

function checkOverlap(wordsearch: Wordsearch, direction: Direction, string: string, origin: Coords): boolean {
  // Check that, using the chosen origin, the word can be placed without overlapping other words
  // Overlapping is only allowed if:
  // 1. The points of overlap involve the same letter
  // 2. There is only one point of intersection
  let prevCellWordIds: string[] = [];
  for (let i = 0; i < string.length; i++) {
    let letter = string[i];

    // Get cell in the wordsearch where the letter will be placed
    const letterCoords = computeLetterCoords(direction, origin, i);
    const cell = wordsearch[letterCoords.y][letterCoords.x];

    // If cell not already used by any words, that's fine - continue to next letter
    // If cell is already used, check the letters are the same and that no same two words have been intersected
    // consecutively by this word
    if (!R.isEmpty(cell.wordIds) && (cell.letter !== letter || !R.empty(R.intersection(prevCellWordIds, cell.wordIds)))) {
      return false;
    } else {
      prevCellWordIds = cell.wordIds;
    }
  }

  return true;
}

function fillWordsearch(size: number): Wordsearch {
  return R.map(() => R.map(() => ({
    letter: letters[Math.floor(Math.random() * letters.length)],
    wordIds: []
  }), R.range(0, size)), R.range(0, size));
}

function generateParts(words: Word[]): Word[] {
  // Arbitrary number that is multiplied by words.length to obtain number of parts to put into wordsearch
  const factor = 1.0;

  const partCount = Math.ceil(Math.random() * R.length(words) * factor);
  let partStrings = R.map(() => {
    // Randomly choose word
    let wordIndex = Math.floor(Math.random() * R.length(words));

    // Randomly choose start and end indices of substring, ensuring the substring length is at least 1
    // Start index is just index between 0th and second last index
    // End index is any index strictly greater than start index
    let string = words[wordIndex].text;
    let startIndex = Math.floor(Math.random() * (string.length - 1));
    let endIndex = Math.floor(Math.random() * (string.length - startIndex + 1)) + startIndex + 1;

    return R.slice(startIndex, endIndex, string);
  }, R.range(0, partCount));

  let parts = R.map(s => ({
    id: uuidv4(),
    text: s
  }), partStrings);

  return parts;
}

function placeWords(wordsearch: Wordsearch, size: number, words: Word[], ignoreFailures: boolean = false): Wordsearch | null {
  // Could use R.all() but that doesn't seem to short-circuit
  let updatedWordsearch = wordsearch; // OK as wordsearch is cloned inside placeWord() anyway

  for (const word of words) {
    let updatedWordsearch1 = placeWord(updatedWordsearch, word, size);
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
