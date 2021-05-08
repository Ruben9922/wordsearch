import React from 'react';
import FormComponent from "./FormComponent";
import WordsearchComponent from "./WordsearchComponent";
import Header from "./Header";
import {Container, Divider, Grid, makeStyles, Paper, Typography} from "@material-ui/core";
import {generateWordsearch} from "./wordsearchGenerator";
import {Alert, AlertTitle} from "@material-ui/lab";
import WordsListComponent from "./WordsListComponent";
import * as R from "ramda";
import DownloadComponent from "./DownloadComponent";

const useStyles = makeStyles(theme => ({
  root: {
    '& > *': {
      marginTop: theme.spacing(4),
      marginBottom: theme.spacing(4),
      flexGrow: 1,
    },
  },
}));

function validate(size, wordStrings) {
  let valid = {};
  let errorMessages = {};

  // Size
  let number = Number(size);
  const min = 1;
  const max = 50;
  if (!(Number.isInteger(number) && number >= min && number <= max)) {
    valid.size = false;
    errorMessages.size = `Size must be an integer between ${min} and ${max} (inclusive)`;
  } else {
    valid.size = true;
    errorMessages.size = "";
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
      <div className={classes.root}>
        <Container maxWidth="md">

        <Paper style={{ padding: "1.3em" }}>
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
              setHighlightedWordIds([]);
            }}
            valid={valid}
            allValid={allValid(valid)}
            helperText={errorMessages}
          />
        </Paper>

        </Container>        <Container maxWidth="md">
        <Divider />
      </Container>


      {!submitted && (
        <Container maxWidth="md">
        <Alert severity="info">
          <AlertTitle>Wordsearch not created yet</AlertTitle>
          Choose options and click Create to generate a wordsearch.
        </Alert>
        </Container>
      )}
      {submitted && wordsearch === null && (
        <Container maxWidth="md">
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
        </Container>
      )}
          {/*<Grid*/}
          {/*  container*/}
          {/*  direction="row"*/}
          {/*  spacing={3}*/}
          {/*>*/}
          {/*  <Grid item xs={12} md={3}>*/}
              {submitted && allValid(valid) && wordsearch && (
                <>
                <Container maxWidth="md">
                <Paper style={{ padding: "1.3em" }}>
                  <Typography variant="h5" component="h1" gutterBottom>
                    Highlight Words
                  </Typography>
                  <WordsListComponent
                    words={words}
                    highlightedWordIds={highlightedWordIds}
                    onHighlightedWordIdsChange={setHighlightedWordIds}
                  />
                </Paper>
                </Container>
            {/*</Grid>*/}
            {/*<Grid item xs={12} md>*/}
              <Container maxWidth={false} style={{textAlign: "center"}}>
                <WordsearchComponent wordsearch={wordsearch} words={words} highlightedWordIds={highlightedWordIds} />
              </Container>
                <Container maxWidth={false} style={{textAlign: "center"}}>
                <DownloadComponent wordsearch={wordsearch} words={words} />
                </Container>
                </>
                )}
          {/*</Grid>*/}
          {/*</Grid>*/}
      </div>
    </React.Fragment>
  );
}
