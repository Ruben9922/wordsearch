import React, {Component} from 'react';
import {List} from 'semantic-ui-react';
import './WordsearchComponent.css';
import {Enum} from 'enumify';

class WordsearchComponent extends Component {
  constructor(props) {
    super(props);

    Direction.initEnum(["HORIZONTAL", "VERTICAL", "DIAGONAL_UP", "DIAGONAL_DOWN"]);

    this.state = {
      wordsearch: this.generateWordsearch()
    };

    this.generateWordsearch = this.generateWordsearch.bind(this);
    this.placeWords = this.placeWords.bind(this);
  }

  generateWordsearch() {
    const size = this.props.size;
    let wordsearch = new Array(size);

    for (let i = 0; i < wordsearch.length; i++) {
      wordsearch[i] = new Array(size);
      for (let j = 0; j < wordsearch[i].length; j++) {
        wordsearch[i][j] = "-";
      }
    }

    this.placeWords(wordsearch);

    return wordsearch;
  }

  placeWords(wordsearch) {
    const size = this.props.size;

    for (let word of this.props.words) {
      let direction = Direction.enumValues[Math.floor(Math.random() * Direction.enumValues.length)];

      // Both min and max origin values are inclusive
      let minOriginX = 0;
      let maxOriginX = (direction === Direction.VERTICAL) ? size - 1 : size - word.length;
      let minOriginY = (direction === Direction.DIAGONAL_UP) ? word.length - 1 : 0;
      let maxOriginY = (direction === Direction.DIAGONAL_UP) ? size - 1 : size - word.length;

      let originX;
      let originY;
      let ok;
      do {
        originX = Math.floor(Math.random() * (maxOriginX + 1 - minOriginX)) + minOriginX;
        originY = Math.floor(Math.random() * (maxOriginY + 1 - minOriginY)) + minOriginY;

        // Check that, using the chosen origin, the word can be placed without overlapping other words
        // Overlapping is allowed if any points of overlap involve the same letter
        ok = true;
        for (let i = 0; i < word.length; i++) {
          let letter = word.charAt(i);

          let x = (direction === Direction.VERTICAL) ? originX : originX + i;
          let y = (direction === Direction.HORIZONTAL) ? originY : ((direction === Direction.DIAGONAL_UP) ? originY - i : originY + i);
          let currentLetter = wordsearch[y][x];

          if (currentLetter !== letter && currentLetter !== "-") {
            ok = false;
          }
        }
      } while (!ok);

      for (let i = 0; i < word.length; i++) {
        let letter = word.charAt(i);

        let x = (direction === Direction.VERTICAL) ? originX : originX + i;
        let y = (direction === Direction.HORIZONTAL) ? originY : ((direction === Direction.DIAGONAL_UP) ? originY - i : originY + i);

        wordsearch[y][x] = letter;
      }
    }
  }

  render() {
    return (
      <div>
        <table className="wordsearch">
          <tbody>
            {this.state.wordsearch.map((row, index1) => (
              <tr key={index1}>
                {row.map((letter, index2) => (
                  <td key={index2}>
                    {letter}
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
      </div>
    );
  }
}

class Direction extends Enum {
}

export default WordsearchComponent;
