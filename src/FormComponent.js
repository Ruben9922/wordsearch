import React, {Component} from 'react';
import {
  Button,
  Checkbox,
  FormControl,
  FormControlLabel,
  FormGroup,
  FormLabel, makeStyles,
  TextField, Tooltip
} from "@material-ui/core";
import ChipInput from "material-ui-chip-input";
import * as R from "ramda";
import {v4 as uuidv4} from "uuid";
import HelpIcon from '@material-ui/icons/Help';

const useStyles = makeStyles(theme => ({
  root: {
    '& > *': {
      margin: theme.spacing(1),
      maxWidth: "25ch",
    },
  },
  formControl: {
    margin: theme.spacing(1),
  },
}));

// TODO: Add error/confirmation message on form (?)
export default function FormComponent({
  size,
  words,
  allowBackwards,
  allowParts,
  onSizeChange,
  onWordsChange,
  onAllowBackwardsChange,
  onAllowPartsChange,
  onSubmit,
  valid,
  allValid,
  helperText,
}) {
  const classes = useStyles();

  const handleClick = event => {
    event.preventDefault();
    onSubmit();
  };

  // TODO: Store min and max size in variables
  return (
    <form className={classes.root} autoComplete="off">
      <TextField
        label="Size"
        name="size"
        type="number"
        InputLabelProps={{
          shrink: true,
        }}
        InputProps={{
          inputProps: {
            min: 0,
          }
        }}
        value={size}
        onChange={(event) => onSizeChange(event.target.value)}
        error={!valid.size}
        helperText={!valid.size && helperText.size}
      />
      <ChipInput
        label="Words"
        value={R.map(w => w.text, words)}
        onAdd={chip => onWordsChange(words => R.append({id: uuidv4(), text: chip}, words))}
        onDelete={(chip, index) => onWordsChange(words => R.remove(index, 1, words))}
        error={!valid.words}
        helperText={helperText.words}
      />
      <FormControl component="fieldset" className={classes.formControl}>
        <FormLabel component="legend">Misc.</FormLabel>
        <FormGroup>
          <FormControlLabel
            control={
              <Checkbox
                checked={allowBackwards}
                onChange={(event) => onAllowBackwardsChange(event.target.checked)}
                name="allowBackwards"
              />
            }
            label={
              <>
                Allow words to be placed backwards
                <Tooltip
                  arrow
                  placement="right"
                  title="Choose whether words can be placed right-to-left as well as left-to-right"
                >
                  <HelpIcon color="primary" />
                </Tooltip>
              </>
            }
          />
          <FormControlLabel
            control={
              <Checkbox
                checked={allowParts}
                onChange={(event) => onAllowPartsChange(event.target.checked)}
                name="allowParts"
              />
            }
            label={
              <>
                Allow parts of words
                <Tooltip
                  arrow
                  placement="right"
                  title="Choose whether to add randomly generated substrings (&#34;parts&#34;) of words to make the game more difficult. For example, for the word &#34;awesomeness&#34;, add substrings like &#34;a&#34;, &#34;awe&#34; and &#34;awesome&#34;."
                >
                  <HelpIcon color="primary" />
                </Tooltip>
              </>
            }
          />
        </FormGroup>
      </FormControl>
      <Button
        variant="contained"
        color="primary"
        disabled={!allValid}
        onClick={handleClick}
      >
        Create
      </Button>
    </form>
  );
}
