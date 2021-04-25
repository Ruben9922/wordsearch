import React, {Component} from 'react';
import FormComponent from "./FormComponent";
import WordsearchComponent from "./WordsearchComponent";
import Header from "./Header";
import {Container} from "@material-ui/core";
import {generateWordsearch} from "./wordsearchGenerator";
import {Alert, AlertTitle} from "@material-ui/lab";
import WordsListComponent from "./WordsListComponent";
import { v4 as uuidv4 } from "uuid";
import * as R from "ramda";

function validate(size, wordStrings) {
  let valid = {};
  let errorMessages = {};

  // Size
  {
    valid.size = true;
    errorMessages.size = "";

    let number = Number(size);
    const min = 1;
    const max = 50;
    if (!(Number.isInteger(number) && number >= min && number <= max)) {
      valid.size = false;
      errorMessages.size = `Size must be an integer between ${min} and ${max} (inclusive)`;
    }
  }

  // Words
  {
    valid.words = new Array(wordStrings.length).fill(true);
    errorMessages.words = new Array(wordStrings.length).fill("");

    const pattern = /^(\s*[a-zA-Z]+\s*)+$/;
    for (let [index, wordString] of wordStrings.entries()) {
      if (wordString === "") {
        valid.words[index] = false;
        errorMessages.words[index] = "Word cannot be empty";
        continue;
      }
      if (!pattern.test(wordString)) {
        valid.words[index] = false;
        errorMessages.words[index] = "Word must only consist of letters, optionally separated by spaces (e.g. \"dog\", \"dog food\", \"Rottweiler\")";
        continue;
      }
      if (valid.size && wordString.length > size) {
        valid.words[index] = false;
        errorMessages.words[index] = "Length of word cannot exceed size";
      }
    }
  }

  return [valid, errorMessages];
}

const allValid = (valid) => valid.size === true && valid.words.every(item => item === true);

export default function App() {
  const [size, setSize] = React.useState("15");
  const [words, setWords] = React.useState([{id: uuidv4(), text: ""}]);
  const [allowBackwards, setAllowBackwards] = React.useState(true);
  const [allowParts, setAllowParts] = React.useState(true);
  const [wordsearch, setWordsearch] = React.useState(null);
  const [highlightedWordIds, setHighlightedWordIds] = React.useState([]);

  const [valid, errorMessages] = validate(size, R.map(w => w.text, words));

  return (
    <React.Fragment>
      <Header />
      <Container maxWidth="md">
        <FormComponent
          size={size}
          words={words}
          allowBackwards={allowBackwards}
          allowParts={allowParts}
          onSizeChange={setSize}
          onWordsChange={setWords}
          onAllowBackwardsChange={setAllowBackwards}
          onAllowPartsChange={setAllowParts}
          onSubmit={() => {
            if (allValid(valid)) {
              setWordsearch(generateWordsearch(parseInt(size, 10), words, allowBackwards, allowParts));
            } else {
              setWordsearch(null);
            }
          }}
          valid={valid}
          allValid={allValid(valid)}
          helperText={errorMessages}
        />
        {!wordsearch ? (
          <Alert severity="info">
            <AlertTitle>Wordsearch not created yet</AlertTitle>
            Choose options and click Create to generate a wordsearch.
          </Alert>
        ) : (!allValid(valid) ? (
          <Alert severity="error">
            <AlertTitle>Invalid options</AlertTitle>
            Fix the errors and try again.
          </Alert>
        ) : (wordsearch === null ? (
          <Alert severity="error">
            <AlertTitle>Failed to generate wordsearch</AlertTitle>
            <p>Failed to generate wordsearch using the specified options.</p>
            <p>Try simply regenerating the wordsearch a few times. If that fails, try the following:</p>
            <ul>
              <li>Increasing the wordsearch size</li>
              <li>Using fewer and/or shorter words</li>
              <li>Disabling the <i>Allow parts of words</i> option</li>
            </ul>
          </Alert>
        ) : (
          <React.Fragment>
            <WordsearchComponent wordsearch={wordsearch} highlightedWordIds={highlightedWordIds} />
            <WordsListComponent
              words={words}
              highlightedWordIds={highlightedWordIds}
              onHighlightedWordIdsChange={setHighlightedWordIds}
            />
          </React.Fragment>
        )))}
      </Container>
    </React.Fragment>
  );
}
