import React, {Component} from 'react';
import {Button, Checkbox, Form, Grid, Header, Icon, Input, Message, Popup, Segment} from 'semantic-ui-react';
import MultipleInputs from "./MultipleInputs";

class FormComponent extends Component {
  constructor(props) {
    super(props);

    this.state = {
      valid: {
        size: true,
        words: false
      },
      errorMessages: {
        size: "",
        words: ""
      },
      dirty: false
    };

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.validate = this.validate.bind(this);
    this.isFormValid = this.isFormValid.bind(this);
  }

  handleChange(event, data) {
    const name = data.name;
    const value = data.value;
    this.props.onChange(name, value, () => this.validate(name, value));

    this.setState({
      dirty: true
    });
  }

  handleSubmit(event) {
    event.preventDefault();
    this.props.onSubmit();
  }

  validate(name, value) {
    let valid;
    let errorMessage;
    switch (name) { // TODO: Could neaten this up a bit
      case "size":
        let number = Number(value);
        const min = 1;
        const max = 50;
        valid = Number.isInteger(number) && number >= min && number <= max;
        errorMessage = valid ? "" : `Size must be an integer between ${min} and ${max} (inclusive)`;

        if (valid) {
          for (let word of this.props.words) {
            if (word.length > number) {
              valid = false;
              errorMessage = valid ? "" : "Length of each word cannot exceed size";
              break;
            }
          }
        }

        break;
      case "words":
        valid = true;
        errorMessage = "";
        const pattern = /^(\s*[a-zA-Z]+\s*)*$/;
        for (let [index, word] of value.entries()) {
          if (index === 0 && word === "") {
            valid = false;
            errorMessage = "At least 1 word is required";
            break;
          }
          if (!pattern.test(word)) {
            valid = false;
            errorMessage = "Words must only consist of letters, optionally separated by spaces (e.g. \"dog\", \"dog food\", \"Rottweiler\")";
            break;
          }
          if (word.length > this.props.size) {
            valid = false;
            errorMessage = "Length of each word cannot exceed size";
            break;
          }
        }
        break;
      default:
        return;
    }
    this.setState(prevState => ({
      valid: Object.assign({}, prevState.valid, {[name]: valid}),
      errorMessages: Object.assign({}, prevState.errorMessages, {[name]: errorMessage})
    }));
  }

  isFormValid() {
    return Object.values(this.state.valid).every(item => item === true);
  }

  // TODO: Validate - e.g. check no words are longer than size
  render() {
    let nonEmptyErrorMessages = Object.entries(this.state.errorMessages)
      .filter(entry => {
        let name = entry[0];
        let errorMessage = entry[1];
        return !this.state.valid[name] && errorMessage !== "";
      })
      .map((entry, index) => {
        let errorMessage = entry[1];
        return errorMessage;
      });
    return (
      <Grid stackable centered padded columns={2}>
        <Grid.Column>
          <Header as="h3" attached="top" inverted>Options</Header>
          <Segment attached={this.state.dirty && !this.isFormValid() ? true : "bottom"}>
            <Form onSubmit={this.handleSubmit}>
              <Form.Field inline error={!this.state.valid.size}>
                <label>Size</label>
                <Input type="number" name="size" min={1} max={50} value={this.props.size} onChange={this.handleChange}/>
                &nbsp;
                <span>&times;</span>
                &nbsp;
                <Input type="number" name="size" min={1} max={50} value={this.props.size} onChange={this.handleChange}/>
              </Form.Field>
              <Form.Field>
                <label>Words</label>
                <MultipleInputs name="words" value={this.props.words} onChange={this.handleChange}/>
              </Form.Field>
              <Form.Field>
                <label>Misc.</label>
                <Checkbox type="checkbox" label="Allow words to be placed backwards" name="allowBackwards"
                          checked={this.props.allowBackwards} onChange={this.handleChange}/>
                &nbsp;
                <Popup
                  trigger={<Icon color="blue" name="help circle"/>}
                  content="Choose whether words can be placed right-to-left as well as left-to-right"
                  position="right center"
                />
                <br/>
                <Checkbox type="checkbox" label="Allow parts of words" name="allowParts" checked={this.props.allowParts}
                          onChange={this.handleChange}/>
                &nbsp;
                <Popup
                  trigger={<Icon color="blue" name="help circle"/>}
                  content="Choose whether to add parts of words to make the game more difficult (e.g. &#34;awe&#34;, &#34;awesome&#34;, etc. as well as &#34;awesomeness&#34;)"
                  position="right center"
                />
              </Form.Field>
              <Button type="submit" primary disabled={!this.isFormValid()}>Create</Button>
            </Form>
          </Segment>
          {this.state.dirty && !this.isFormValid() && (
            <Message icon error attached="bottom">
              <Icon name="exclamation circle"/>
              <Message.Content>
                <Message.Header>Invalid options</Message.Header>
                <Message.List>
                  {nonEmptyErrorMessages.map((errorMessage, index) => (
                    <Message.Item key={index}>{errorMessage}</Message.Item>
                  ))}
                </Message.List>
              </Message.Content>
            </Message>
          )}
        </Grid.Column>
      </Grid>
    );
  }
}

export default FormComponent;
