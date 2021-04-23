import React, {Component} from 'react';
import {Button} from "@material-ui/core";
import DescriptionIcon from '@material-ui/icons/Description';

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

    let fileName = "wordsearch_" + DownloadComponent.formatDateAsYMDHMS(new Date()) + ".txt";
    DownloadComponent.download(url, fileName);
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

  static formatDateAsYMDHMS(date) {
    // TODO: Pad with zeros
    return [date.getFullYear(), date.getMonth() + 1, date.getDate()].join("-")
      + "_"
      + [date.getHours(), date.getMinutes(), date.getSeconds()].join("-");
  }

  render() {
    return (
      <Button
        variant="contained"
        color="default"
        // className={classes.button}
        onClick={this.handleClick}
        startIcon={<DescriptionIcon />}
      >
        Download as text file
      </Button>
    );
  }
}

export default DownloadComponent;
