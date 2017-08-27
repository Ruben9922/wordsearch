import React, {Component} from 'react';
import {List, Message} from 'semantic-ui-react';
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

    let successful = this.placeWords(wordsearch);
    if (!successful) {
      return null;
    }

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

      // Currently, if word cannot be placed, chooses new origin and tries to place again; could change to restrict
      // choice of origin (so don't need to choose new origin) but possibly very complicated and inefficient
      let originX;
      let originY;
      let ok;
      const attempts = 10000;
      for (let i = 0; i < attempts && !ok; i++) {
        originX = Math.floor(Math.random() * (maxOriginX + 1 - minOriginX)) + minOriginX;
        originY = Math.floor(Math.random() * (maxOriginY + 1 - minOriginY)) + minOriginY;

        // Check that, using the chosen origin, the word can be placed without overlapping other words
        // Overlapping is allowed if any points of overlap involve the same letter
        ok = true;
        for (let j = 0; j < word.length; j++) {
          let letter = word.charAt(j);

          let x = (direction === Direction.VERTICAL) ? originX : originX + j;
          let y = (direction === Direction.HORIZONTAL) ? originY : ((direction === Direction.DIAGONAL_UP) ? originY - j : originY + j);
          let currentLetter = wordsearch[y][x];

          if (currentLetter !== letter && currentLetter !== "-") {
            ok = false;
            break;
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

        wordsearch[y][x] = letter;
      }
    }

    return true;
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
        )}
      </div>
    );
  }
}

class Direction extends Enum {
}

export default WordsearchComponent;
