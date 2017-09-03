import React, {Component} from 'react';
import {Checkbox, Label, List, Message} from 'semantic-ui-react';
import './WordsearchComponent.css';
import {Enum} from 'enumify';

// TODO: Only regenerate and show when button clicked
class WordsearchComponent extends Component {
  constructor(props) {
    super(props);

    Direction.initEnum(["HORIZONTAL", "VERTICAL", "DIAGONAL_UP", "DIAGONAL_DOWN"]);

    this.state = {
      wordsearch: null,
      highlightAll: false
    };

    this.handleChange = this.handleChange.bind(this);
    this.update = this.update.bind(this);
  }

  handleChange(event, data) {
    const value = data.type === "checkbox" ? data.checked : data.value;
    const name = data.name;

    this.setState({
      [name]: value
    });
  }

  static generateWordsearch(size, words, allowBackwards, allowParts) {
    let wordsearch = new Array(size);
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

    let successful = this.placeWords(wordsearch, size, words, allowBackwards);
    if (!successful) {
      return null;
    }

    if (allowParts) {
      successful = this.placeParts(wordsearch, size, words, allowBackwards);
      if (!successful) {
        return null;
      }
    }

    return wordsearch;
  }

  static placeParts(wordsearch, size, words, allowBackwards) {
    // Arbitrary number that is multiplied by words.length to obtain number of parts to put into wordsearch
    const factor = 1.0;

    let partCount = Math.floor(Math.random() * words.length * factor);
    let parts = new Array(partCount);
    for (let i = 0; i < partCount; i++) {
      // Randomly choose word
      let wordIndex = Math.floor(Math.random() * words.length);
      let word = words[wordIndex];

      // Randomly choose start and end indices of substring, ensuring the substring length is at least 1
      // Start index is just index between 0th and second last index
      // End index is any index strictly greater than start index
      let startIndex = Math.floor(Math.random() * (word.length - 1));
      let endIndex = Math.floor(Math.random() * (word.length - startIndex + 1)) + startIndex + 1;

      parts[i] = word.slice(startIndex, endIndex);
    }

    return this.placeWords(wordsearch, size, parts, allowBackwards);
  }

  // TODO: Remove size parameter
  static placeWords(wordsearch, size, words, allowBackwards) {
    for (let [index, word] of words.entries()) {
      if (!WordsearchComponent.placeWord(wordsearch, word, index, size, allowBackwards)) {
        return false;
      }
    }
    return true;
  }

  static placeWord(wordsearch, word, wordId, size, allowBackwards) {
    let backwards = allowBackwards && Math.random() >= 0.5;
    if (backwards) {
      word = WordsearchComponent.reverseString(word);
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
      let maxOriginX = (direction === Direction.VERTICAL) ? size - 1 : size - word.length;
      let minOriginY = (direction === Direction.DIAGONAL_UP) ? word.length - 1 : 0;
      let maxOriginY = (direction === Direction.DIAGONAL_UP) ? size - 1 : size - word.length;

      originX = Math.floor(Math.random() * (maxOriginX + 1 - minOriginX)) + minOriginX;
      originY = Math.floor(Math.random() * (maxOriginY + 1 - minOriginY)) + minOriginY;

      // Check that, using the chosen origin, the word can be placed without overlapping other words
      // Overlapping is allowed if any points of overlap involve the same letter
      ok = true;
      let overlappedWordId = null;
      for (let j = 0; j < word.length; j++) {
        let letter = word.charAt(j);

        let x = (direction === Direction.VERTICAL) ? originX : originX + j;
        let y = (direction === Direction.HORIZONTAL) ? originY : ((direction === Direction.DIAGONAL_UP) ? originY - j : originY + j);
        let cell = wordsearch[y][x];

        if (cell.letter === letter) {
          if (overlappedWordId === null || overlappedWordId !== cell.wordId) {
            overlappedWordId = cell.wordId;
          } else {
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

    for (let i = 0; i < word.length; i++) {
      let letter = word.charAt(i);

      let x = (direction === Direction.VERTICAL) ? originX : originX + i;
      let y = (direction === Direction.HORIZONTAL) ? originY : ((direction === Direction.DIAGONAL_UP) ? originY - i : originY + i);

      wordsearch[y][x] = {
        letter: letter,
        wordId: wordId
      };
    }

    return true;
  }

  static reverseString(string) {
    let result = "";
    for (let i = string.length - 1; i >= 0; i--) {
      result += string.charAt(i);
    }
    return result;
  }

  update() {
    this.setState({
      wordsearch: WordsearchComponent.generateWordsearch(parseInt(this.props.size, 10), this.props.words, this.props.allowBackwards, this.props.allowParts)
    });
  }

  render() {
    return (
      <div>
        {this.state.wordsearch === null ? (
          <Message error>
            <Message.Header>Failed to generate wordsearch</Message.Header>
            <p>Failed to generate wordsearch using the specified options.</p>
            <p>Try simply regenerating the wordsearch a few times. If that fails, try the following:</p>
            <List as="ul">
              <List.Item as="li">Increasing the wordsearch size</List.Item>
              <List.Item as="li">Using fewer and/or shorter words</List.Item>
              <List.Item as="li">Disabling the <i>Allow parts of words</i> option</List.Item>
            </List>
          </Message>
        ) : (
          <div>
            <table className="wordsearch">
              <tbody>
              {this.state.wordsearch.map((row, index1) => (
                <tr key={index1}>
                  {row.map((cell, index2) => (
                    <td key={index2} className={(this.state.highlightAll && cell.wordId !== null) && "highlighted"}>
                      {cell.letter}
                    </td>
                  ))}
                </tr>
              ))}
              </tbody>
            </table>

            <List selection>
              {this.props.words.map((word, index) => (
                <List.Item key={index}>
                  <List.Content>
                    {word}
                  </List.Content>
                </List.Item>
              ))}
            </List>
            <Checkbox type="checkbox" label="Show all words" name="highlightAll" checked={this.state.highlightAll}
                      onChange={this.handleChange}/>
          </div>
        )}
      </div>
    );
  }
}

class Direction extends Enum {
}

export default WordsearchComponent;
