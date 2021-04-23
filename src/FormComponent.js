import React, {Component} from 'react';
import MultipleInputs from "./MultipleInputs";
import {
  Button,
  Checkbox,
  FormControl,
  FormControlLabel,
  FormGroup,
  FormLabel,
  TextField,
  withStyles
} from "@material-ui/core";

const styles = theme => ({
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
});

// TODO: Add error/confirmation message on form (?)
class FormComponent extends Component {
  constructor(props) {
    super(props);

    this.state = {
      dirty: false,
    };

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleChange(event) {
    const name = event.target.name;
    const value = event.target.value;
    this.props.onChange(name, value);

    this.setState({
      dirty: true
    });
  }

  handleSubmit(event) {
    event.preventDefault();
    this.props.onSubmit();
  }

  render() {
    const {classes} = this.props;

    // TODO: Store min and max size in variables
    return (
      <form className={classes.root} autoComplete="off" onSubmit={this.handleSubmit}>
        <TextField
          label="Size"
          name="size"
          type="number"
          InputLabelProps={{
            shrink: true,
          }}
          value={this.props.size}
          onChange={this.handleChange}
          error={this.props.submitted && !this.props.valid.size}
          helperText={this.props.submitted && !this.props.valid.size && this.props.errorMessages.size}
        />
        <MultipleInputs name="words" value={this.props.words} onChange={this.handleChange} valid={this.props.valid.words} errorMessages={this.props.errorMessages.words} submitted={this.props.submitted}/>
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
              control={<Checkbox checked={this.props.allowBackwards} onChange={this.handleChange} name="allowBackwards" />}
              label="Allow words to be placed backwards"
            />
            <FormControlLabel
              control={<Checkbox checked={this.props.allowParts} onChange={this.handleChange} name="allowParts" />}
              label="Allow parts of words"
            />
          </FormGroup>
        </FormControl>
        <Button
          type="submit"
          variant="contained"
          color="primary"
        >
          Create
        </Button>
      </form>
    );
  }
}

export default withStyles(styles)(FormComponent);
