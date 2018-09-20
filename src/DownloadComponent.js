import React, {Component} from 'react';
import {Button, Icon} from 'semantic-ui-react';

class DownloadComponent extends Component {
  constructor(props) {
    super(props);

    this.textFileURL = null;

    this.handleClick = this.handleClick.bind(this);
    this.makeTextFile = this.makeTextFile.bind(this);
  }

  componentWillUnmount() {
    if (this.textFileURL !== null) {
      URL.revokeObjectURL(this.textFileURL);
    }
  }

  handleClick() {
    let {wordsearch} = this.props;

    let wordsearchLetters = wordsearch.map(row => row.map(cell => cell.letter));
    let wordsearchString = wordsearchLetters.map(row => row.join(" ")).join("\n");

    let url = this.makeTextFile(wordsearchString);
    console.log(url);

    DownloadComponent.download(url, "wordsearch.txt");
  }

  makeTextFile(text) {
    let data = new Blob([text], {type: 'text/plain'});

    if (this.textFileURL !== null) {
      URL.revokeObjectURL(this.textFileURL);
    }

    this.textFileURL = URL.createObjectURL(data);

    return this.textFileURL;
  }

  static download(url, fileName) {
    let element = document.createElement("a");
    element.href = url;
    element.download = fileName;
    element.click();
  }

  render() {
    return (
      <Button.Group>
        <Button onClick={this.handleClick}>
          <Icon name="file text"/>
          Download as text file
        </Button>
      </Button.Group>
    );
  }
}

export default DownloadComponent;
