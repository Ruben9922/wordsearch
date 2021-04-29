import Direction from "./direction";
import * as R from "ramda";
import {v4 as uuidv4} from "uuid";

// noinspection SpellCheckingInspection
const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";

export function generateWordsearch(size, words, allowBackwards, allowParts) {
  // Preprocess the words by converting each word string to upper case and removing non-alphabet characters
  words = R.map(w => ({
    id: w.id,
    text: R.filter(letter => R.includes(letter, letters.split("")), R.toUpper(w.text)).join("")
  }), words);

  words = reverseSomeWords(words, allowBackwards);

  let wordsearch = fillWordsearch(size);

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

function reverseSomeWords(words, allowBackwards) {
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
function computeLetterCoords(direction, origin, index) {
  return {
    x: (direction === Direction.VERTICAL) ? origin.x : origin.x + index,
    y: (direction === Direction.HORIZONTAL) ? origin.y : ((direction === Direction.DIAGONAL_UP) ? origin.y - index : origin.y + index),
  };
}

function generateWordOrigin(direction, size, word) {
  // Both min and max origin values are inclusive
  const minOrigin = computeMinOrigin(direction, word);
  const maxOrigin = computeMaxOrigin(direction, size, word);

  return {
    x: Math.floor(Math.random() * (maxOrigin.x + 1 - minOrigin.x)) + minOrigin.x,
    y: Math.floor(Math.random() * (maxOrigin.y + 1 - minOrigin.y)) + minOrigin.y,
  };
}

function computeMinOrigin(direction, word) {
  return {
    x: 0,
    y: (direction === Direction.DIAGONAL_UP) ? R.length(word.text) - 1 : 0,
  };
}

function computeMaxOrigin(direction, size, word) {
  return {
    x: (direction === Direction.VERTICAL) ? size - 1 : size - R.length(word.text),
    y: (direction === Direction.DIAGONAL_UP) ? size - 1 : size - R.length(word.text),
  };
}

function placeWord(wordsearch, word, size) {
  // Currently, if word cannot be placed, chooses new origin and direction and tries to place again; could change to
  // restrict choice of origin (so don't need to choose new origin) but possibly very complicated and inefficient
  let direction;
  let origin;
  let ok;
  const maxAttempts = 10000;
  for (let i = 0; i < maxAttempts && !ok; i++) {
    direction = Direction.enumValues[Math.floor(Math.random() * Direction.enumValues.length)];

    origin = generateWordOrigin(direction, size, word);

    ok = checkOverlap(wordsearch, direction, word.text, origin);
  }

  // If such origin not found (max no. of attempts was reached) then return
  if (!ok) {
    return null;
  }

  // Actually place the letters into the wordsearch
  let updatedWordsearch = R.clone(wordsearch);
  for (let i = 0; i < word.text.length; i++) {
    let letter = word.text[i]
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

function checkOverlap(wordsearch, direction, string, origin) {
  // Check that, using the chosen origin, the word can be placed without overlapping other words
  // Overlapping is only allowed if:
  // 1. The points of overlap involve the same letter
  // 2. There is only one point of intersection
  let prevCellWordIds = [];
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

function fillWordsearch(size) {
  return R.map(() => R.map(() => ({
    letter: letters[Math.floor(Math.random() * letters.length)],
    wordIds: []
  }), R.range(0, size)), R.range(0, size));
}

function generateParts(words) {
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
    let startIndex = Math.floor(Math.random() * (R.length(string) - 1));
    let endIndex = Math.floor(Math.random() * (R.length(string) - startIndex + 1)) + startIndex + 1;

    return R.slice(startIndex, endIndex, string);
  }, R.range(0, partCount));

  let parts = R.map(s => ({
    id: uuidv4(),
    text: s
  }), partStrings);

  return parts;
}

function placeWords(wordsearch, size, words, ignoreFailures = false) {
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
