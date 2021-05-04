import React, {Component} from 'react';
import FormComponent from "./FormComponent";
import WordsearchComponent from "./WordsearchComponent";
import Header from "./Header";
import {Container, Grid, makeStyles, Paper, Stack, Typography} from "@material-ui/core";
import {generateWordsearch} from "./wordsearchGenerator";
import {Alert, AlertTitle} from "@material-ui/lab";
import WordsListComponent from "./WordsListComponent";
import { v4 as uuidv4 } from "uuid";
import * as R from "ramda";

const useStyles = makeStyles(theme => ({
  // root: {
  //   '& > *': {
  //     marginTop: theme.spacing(2),
  //     marginBottom: theme.spacing(2),
  //   },
  // },
  root: {
    flexGrow: 1,
  },
}));

function validate(size, wordStrings) {
  let valid = {};
  let errorMessages = {};

  // Size
  valid.size = true;
  errorMessages.size = "";

  let number = Number(size);
  const min = 1;
  const max = 50;
  if (!(Number.isInteger(number) && number >= min && number <= max)) {
    valid.size = false;
    errorMessages.size = `Size must be an integer between ${min} and ${max} (inclusive)`;
  }

  // Words
  const pattern = /^(\s*[a-zA-Z]+\s*)+$/;
  if (R.isEmpty(wordStrings)) {
    valid.words = false;
    errorMessages.words = "Words cannot be empty";
  } else if (R.any(ws => !R.test(pattern, ws), wordStrings)) {
    valid.words = false;
    errorMessages.words = "Words may only contain letters and spaces";
  } else if (valid.size && R.any(ws => ws.length > size, wordStrings)) {
    valid.words = false;
    errorMessages.words = "Length of each word cannot exceed size";
  } else {
    valid.words = true;
    errorMessages.words = "";
  }

  return [valid, errorMessages];
}

const allValid = valid => valid.size && valid.words;

export default function App() {
  const classes = useStyles();

  const [size, setSize] = React.useState("15");
  const [words, setWords] = React.useState([]);
  const [allowBackwards, setAllowBackwards] = React.useState(true);
  const [allowParts, setAllowParts] = React.useState(true);
  const [wordsearch, setWordsearch] = React.useState(null);
  const [highlightedWordIds, setHighlightedWordIds] = React.useState([]);
  const [submitted, setSubmitted] = React.useState(false);

  const [valid, errorMessages] = validate(size, R.map(w => w.text, words));

  return (
    <React.Fragment>
      <Header />
      <Container maxWidth="xl" className={classes.root}>
        <Grid
          container
          spacing={3}
          justify="space-between"
          alignItems="flex-start"
          // wrap="nowrap"
        >
          <Grid
            item
            container
            sm={3}
            direction="column"
            spacing={3}
          >
            <Grid item sm>
              <Paper>
                <FormComponent
                  size={size}
                  words={words}
                  allowBackwards={allowBackwards}
                  allowParts={allowParts}
                  onSizeChange={size => {setSize(size); setSubmitted(false);}}
                  onWordsChange={words => {setWords(words); setSubmitted(false);}}
                  onAllowBackwardsChange={allowBackwards => {setAllowBackwards(allowBackwards); setSubmitted(false);}}
                  onAllowPartsChange={allowParts => {setAllowParts(allowParts); setSubmitted(false);}}
                  onSubmit={() => {
                    if (allValid(valid)) {
                      setWordsearch(generateWordsearch(parseInt(size, 10), words, allowBackwards, allowParts));
                    } else {
                      setWordsearch(null);
                    }
                    setSubmitted(true);
                  }}
                  valid={valid}
                  allValid={allValid(valid)}
                  helperText={errorMessages}
                />
              </Paper>
            </Grid>
            <Grid item sm>
              {allValid(valid) && wordsearch && (
                <Paper>
                  <Typography variant="h5" component="h1" gutterBottom>
                    Highlight Words
                  </Typography>
                  <WordsListComponent
                    words={words}
                    highlightedWordIds={highlightedWordIds}
                    onHighlightedWordIdsChange={setHighlightedWordIds}
                  />
                </Paper>
              )}
            </Grid>
          </Grid>
          <Grid item sm>
            {!submitted && (
              <Alert severity="info">
                <AlertTitle>Wordsearch not created yet</AlertTitle>
                Choose options and click Create to generate a wordsearch.
              </Alert>
            )}
            {submitted && wordsearch === null && (
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
            )}
            {submitted && allValid(valid) && wordsearch && (
              <React.Fragment>
                <Typography variant="h5" component="h1" gutterBottom>
                  Wordsearch
                </Typography>
                <WordsearchComponent wordsearch={wordsearch} highlightedWordIds={highlightedWordIds} />
              </React.Fragment>
            )}
          </Grid>
        </Grid>
      </Container>
    </React.Fragment>
  );
}
