import React, {Component} from 'react';
import {Checkbox, Container, Grid, Header, List, Message, Segment} from 'semantic-ui-react';
import './WordsearchComponent.css';
import {Enum} from 'enumify';

// TODO: Change highlighting to use word IDs instead of array indices
class WordsearchComponent extends Component {
  constructor(props) {
    super(props);

    this.state = {
      wordsearch: null,
      wordObjectsMap: {}
    };

    this.update = this.update.bind(this);
    this.handleHighlightAllNoneChange = this.handleHighlightAllNoneChange.bind(this);
    this.handleHighlight = this.handleHighlight.bind(this);
  }

  static generateWordsearch(size, words, allowBackwards, allowParts) {
    words = words.map(word => word.toUpperCase().replace(/[^A-Z]+/g, ""));

    let wordsearch = new Array(size);

    this.fillWordsearch(wordsearch, size);

    let wordObjects = this.createStringObjects(words, index => index, false);
    let wordsPlaced = this.placeStrings(wordsearch, size, wordObjects, allowBackwards);

    if (!wordsPlaced) {
      return null;
    }

    if (allowParts) {
      let parts = this.generateParts(words);
      let partObjects = this.createStringObjects(parts, index => index + wordObjects.length, null);
      let partsPlaced = this.placeStrings(wordsearch, size, partObjects, allowBackwards);

      if (!partsPlaced) {
        return null;
      }
    }

    let wordObjectsMap = wordObjects.reduce((map, element) => {
      map[element.id] = element;
      return map;
    }, {});

    return {wordsearch, wordObjectsMap};
  }

  static createStringObjects(strings, idFunction = index => index, highlight) {
    return strings.map((element, index) => ({
      string: element,
      id: idFunction(index),
      highlight: highlight
    }));
  }

  static placeString(wordsearch, stringObject, size, allowBackwards) {
    // If allowBackwards parameter is true, randomly choose whether to place the word backwards
    // If the word is to be placed backwards, simply reverse the word string
    let {string} = stringObject;
    let backwards = allowBackwards && Math.random() >= 0.5;
    if (backwards) {
      string = this.reverseString(string);
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

    let id = stringObject.id;
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

  static fillWordsearch(wordsearch, size) {
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

  handleHighlightAllNoneChange(event, data) {
    this.setState(prevState => {
      let mapEntries = Object.entries(prevState.wordObjectsMap).map(([key, value]) => {
        let newValue = Object.assign({}, value, {highlight: data.checked}); // New word object with updated highlight value
        return {[key]: newValue};
      });
      let newWordObjectsMap = Object.assign({}, ...mapEntries);
      return {
        wordObjectsMap: newWordObjectsMap
      };
    });
  }

  static generateParts(words) {
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

    return parts;
  }

  // TODO: Remove size parameter
  static placeStrings(wordsearch, size, stringObjects, allowBackwards) {
    for (let stringObject of stringObjects) {
      let stringPlaced = this.placeString(wordsearch, stringObject, size, allowBackwards);

      if (!stringPlaced) {
        return false;
      }
    }
    return true;
  }

  handleHighlight(event, data, wordObject) {
    this.setState(prevState => {
      let {wordObjectsMap} = prevState;

      let newWordObject = Object.assign({}, wordObject, {highlight: !wordObject.highlight});
      let newWordObjectsMap = Object.assign({}, wordObjectsMap, {[wordObject.id]: newWordObject});

      return {
        wordObjectsMap: newWordObjectsMap
      };
    });
  }

  static reverseString(string) {
    let result = "";
    for (let i = string.length - 1; i >= 0; i--) {
      result += string.charAt(i);
    }
    return result;
  }

  update() {
    this.setState(WordsearchComponent.generateWordsearch(this.props.size, this.props.words, this.props.allowBackwards, this.props.allowParts));
  }

  render() {
    return (
      (!this.props.submitted || !Object.values(this.props.valid).every(item => item === true)) ? (
        <Container>
          <Message
            info
            header="Wordsearch will appear here"
            content="Choose options and click Create."
          />
        </Container>
      ) : (this.state.wordsearch === null ? (
        <Container>
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
        </Container>
      ) : (
        <Grid container centered>
          <div>
            <Segment compact>
              <table className="wordsearch">
                <tbody>
                {this.state.wordsearch.map((row, index1) => (
                  <tr key={index1}>
                    {row.map((cell, index2) => (
                      <td key={index2} className={cell.wordId !== null && this.state.wordObjectsMap.hasOwnProperty(cell.wordId) && this.state.wordObjectsMap[cell.wordId].highlight && "highlighted"}>
                        {cell.wordId !== null ? cell.wordId + "," + cell.letter : ""}
                      </td>
                    ))}
                  </tr>
                ))}
                </tbody>
              </table>
            </Segment>

            <Segment>
              <Header sub dividing>Highlight Words</Header>
              <Checkbox label="Highlight all/none"
                        checked={Object.values(this.state.wordObjectsMap).every(element => element.highlight)}
                        indeterminate={!Object.values(this.state.wordObjectsMap).every(element => element.highlight) && !Object.values(this.state.wordObjectsMap).every(element => !element.highlight)}
                        onChange={this.handleHighlightAllNoneChange}/>
              <List selection verticalAlign="middle">
                {Object.values(this.state.wordObjectsMap).map((wordObject, index) => (
                  <List.Item key={index} active={wordObject.highlight}
                             onClick={(event, data) => this.handleHighlight(event, data, wordObject)}>
                    <List.Content>
                      {wordObject.string}
                    </List.Content>
                  </List.Item>
                ))}
              </List>
            </Segment>
          </div>
        </Grid>
      ))
    );
  }
}

class Direction extends Enum {
}

Direction.initEnum(["HORIZONTAL", "VERTICAL", "DIAGONAL_UP", "DIAGONAL_DOWN"]);

export default WordsearchComponent;
