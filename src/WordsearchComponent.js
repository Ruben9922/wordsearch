import React, {Component} from 'react';
import './WordsearchComponent.css';

class WordsearchComponent extends Component {
  constructor(props) {
    super(props);

    this.state = {
      wordsearch: this.generateWordsearch()
    }
  }

  generateWordsearch() {
    return [
      ["A", "A", "A", "A", "A", "A", "A", "A", "A", "A", "A", "A"],
      ["A", "A", "A", "A", "A", "A", "A", "A", "A", "A", "A", "A"],
      ["A", "A", "A", "A", "A", "A", "A", "A", "A", "A", "A", "A"],
      ["A", "A", "A", "A", "A", "A", "A", "A", "A", "A", "A", "A"],
      ["A", "A", "A", "A", "A", "A", "A", "A", "A", "A", "A", "A"],
      ["A", "A", "A", "A", "A", "A", "A", "A", "A", "A", "A", "A"],
      ["A", "A", "A", "A", "A", "A", "A", "A", "A", "A", "A", "A"],
      ["A", "A", "A", "A", "A", "A", "A", "A", "A", "A", "A", "A"],
      ["A", "A", "A", "A", "A", "A", "A", "A", "A", "A", "A", "A"],
      ["A", "A", "A", "A", "A", "A", "A", "A", "A", "A", "A", "A"],
      ["A", "A", "A", "A", "A", "A", "A", "A", "A", "A", "A", "A"],
      ["A", "A", "A", "A", "A", "A", "A", "A", "A", "A", "A", "A"]
    ];
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
      </div>
    );
  }
}

export default WordsearchComponent;
