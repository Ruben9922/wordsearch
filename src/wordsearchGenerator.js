import Direction from "./direction";
import {reverseString} from "./utilities";
import * as R from "ramda";

export function generateWordsearch(size, words, allowBackwards, allowParts) {
  // Convert each word string to upper case and remove non-alphabet characters
  words = words.map(word => ({
    id: word.id,
    text: word.text.toUpperCase().replace(/[^A-Z]+/g, "")
  }));

  let wordsearch = new Array(size);

  fillWordsearch(wordsearch, size);

  let wordsPlaced = placeWords(wordsearch, size, words, allowBackwards);

  if (!wordsPlaced) {
    return null;
  }

  if (allowParts) {
    let parts = generateParts(words);
    let partsPlaced = placeWords(wordsearch, size, parts, allowBackwards);

    if (!partsPlaced) {
      return null;
    }
  }

  return wordsearch;
}

function placeWord(wordsearch, word, size, allowBackwards) {
  // If allowBackwards parameter is true, randomly choose whether to place the word backwards
  // If the word is to be placed backwards, simply reverse the word string
  let string = word.text;
  let backwards = allowBackwards && Math.random() >= 0.5;
  if (backwards) {
    string = reverseString(string);
  }

  // Currently, if word cannot be placed, chooses new origin and direction and tries to place again; could change to
  // restrict choice of origin (so don't need to choose new origin) but possibly very complicated and inefficient
  let direction;
  let originX;
  let originY;
  let ok;
  const attempts = 10000;
  for (let i = 0; i < attempts && !ok; i++) {
    direction = Direction.enumValues[Math.floor(Math.random() * Direction.enumValues.length)];

    // Both min and max origin values are inclusive
    let minOriginX = 0;
    let maxOriginX = (direction === Direction.VERTICAL) ? size - 1 : size - string.length;
    let minOriginY = (direction === Direction.DIAGONAL_UP) ? string.length - 1 : 0;
    let maxOriginY = (direction === Direction.DIAGONAL_UP) ? size - 1 : size - string.length;

    originX = Math.floor(Math.random() * (maxOriginX + 1 - minOriginX)) + minOriginX;
    originY = Math.floor(Math.random() * (maxOriginY + 1 - minOriginY)) + minOriginY;

    // Check that, using the chosen origin, the word can be placed without overlapping other words
    // Overlapping is only allowed if the points of overlap involve the same letter
    ok = true;
    let overlappedWordId = null;
    for (let j = 0; j < string.length; j++) {
      let letter = string.charAt(j);

      let x = (direction === Direction.VERTICAL) ? originX : originX + j;
      let y = (direction === Direction.HORIZONTAL) ? originY : ((direction === Direction.DIAGONAL_UP) ? originY - j : originY + j);
      let cell = wordsearch[y][x];

      // TODO: Possibly restructure this
      if (cell.letter === letter) {
        // Ensure the current word doesn't overlap another word completely, by checking that the previously overlapped word is different from the current overlapped word
        // If no previous overlaps or previously overlapped word is different from the current overlapped word
        if (overlappedWordId === null || overlappedWordId !== cell.wordId) {
          overlappedWordId = cell.wordId;
        } else { // Previously overlapped word was same as the currently overlapped word, so the same word has been overlapped twice, i.e., overlapped completely by the current word
          ok = false;
        }
      } else {
        overlappedWordId = null; // Reset overlapped substring

        if (cell.wordId !== null) {
          ok = false;
          break;
        }
      }
    }
  }

  // If such origin not found (max no. of attempts was reached) then return
  if (!ok) {
    return false;
  }

  let id = word.id;
  for (let i = 0; i < string.length; i++) {
    let letter = string.charAt(i);

    let x = (direction === Direction.VERTICAL) ? originX : originX + i;
    let y = (direction === Direction.HORIZONTAL) ? originY : ((direction === Direction.DIAGONAL_UP) ? originY - i : originY + i);

    wordsearch[y][x] = {
      letter: letter,
      wordId: id
    };
  }

  return true;
}

function fillWordsearch(wordsearch, size) {
  let letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  for (let i = 0; i < wordsearch.length; i++) {
    wordsearch[i] = new Array(size);
    for (let j = 0; j < wordsearch[i].length; j++) {
      wordsearch[i][j] = {
        letter: letters[Math.floor(Math.random() * letters.length)],
        wordId: null
      };
    }
  }
}

function generateParts(words) {
  // Arbitrary number that is multiplied by words.length to obtain number of parts to put into wordsearch
  const factor = 1.0;

  let partCount = Math.floor(Math.random() * words.length * factor);
  let partStrings = new Array(partCount);
  for (let i = 0; i < partCount; i++) {
    // Randomly choose word
    let wordIndex = Math.floor(Math.random() * words.length);

    // Randomly choose start and end indices of substring, ensuring the substring length is at least 1
    // Start index is just index between 0th and second last index
    // End index is any index strictly greater than start index
    let string = words[wordIndex].text;
    let startIndex = Math.floor(Math.random() * (string.length - 1));
    let endIndex = Math.floor(Math.random() * (string.length - startIndex + 1)) + startIndex + 1;

    partStrings[i] = string.slice(startIndex, endIndex);
  }

  let parts = R.map(s => ({
    id: null,
    text: s
  }), partStrings);

  return parts;
}

// TODO: Remove size parameter
function placeWords(wordsearch, size, words, allowBackwards) {
  for (let word of words) {
    let stringPlaced = placeWord(wordsearch, word, size, allowBackwards);

    if (!stringPlaced) {
      return false;
    }
  }
  return true;
}
