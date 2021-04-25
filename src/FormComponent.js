import React, {Component} from 'react';
import MultipleInputs from "./MultipleInputs";
import {
  Button,
  Checkbox,
  FormControl,
  FormControlLabel,
  FormGroup,
  FormLabel, makeStyles,
  TextField
} from "@material-ui/core";

const useStyles = makeStyles(theme => ({
  root: {
    '& > *': {
      margin: theme.spacing(1),
      width: '25ch',
    },
  },
  formControl: {
    margin: theme.spacing(1),
    minWidth: 120,
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
  const handleSubmit = (event) => {
    event.preventDefault();
    onSubmit();
  };

  const classes = useStyles();

  // TODO: Store min and max size in variables
  return (
    <form className={classes.root} autoComplete="off" onSubmit={handleSubmit}>
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
      <MultipleInputs
        value={words}
        onChange={onWordsChange}
        valid={valid.words}
        errorMessages={helperText.words}
      />
      {/*<Form.Field>*/}
      {/*  <label>Misc.</label>*/}
      {/*  <Checkbox type="checkbox" label=""*/}
      {/*            checked={} onChange={}/>*/}
      {/*  &nbsp;*/}
      {/*  <Popup*/}
      {/*    trigger={<Icon color="blue" name="help circle"/>}*/}
      {/*    content="Choose whether words can be placed right-to-left as well as left-to-right"*/}
      {/*    position="right center"*/}
      {/*  />*/}
      {/*  <br/>*/}
      {/*  <Checkbox type="checkbox" label=""  checked={}*/}
      {/*            onChange={}/>*/}
      {/*  &nbsp;*/}
      {/*  <Popup*/}
      {/*    trigger={<Icon color="blue" name="help circle"/>}*/}
      {/*    content="Choose whether to add randomly generated substrings (&#34;parts&#34;) of words to make the game more difficult. For example, for the word &#34;awesomeness&#34;, add substrings like &#34;a&#34;, &#34;awe&#34; and &#34;awesome&#34;."*/}
      {/*    position="right center"*/}
      {/*  />*/}
      {/*</Form.Field>*/}
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
            label="Allow words to be placed backwards"
          />
          <FormControlLabel
            control={
              <Checkbox
                checked={allowParts}
                onChange={(event) => onAllowPartsChange(event.target.checked)}
                name="allowParts"
              />
            }
            label="Allow parts of words"
          />
        </FormGroup>
      </FormControl>
      <Button
        type="submit"
        variant="contained"
        color="primary"
        disabled={!allValid}
      >
        Create
      </Button>
    </form>
  );
}
