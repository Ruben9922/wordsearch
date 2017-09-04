import React, {Component} from 'react';
import {Button, Checkbox, Form, Header, Icon, Input, Popup, Segment, Message} from 'semantic-ui-react';
import MultipleInputs from "./MultipleInputs";

class FormComponent extends Component {
  constructor(props) {
    super(props);

    this.state = {
      valid: {
        size: true,
        words: true
      },
      errorMessages: {
        size: "",
        words: ""
      }
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
  }

  handleSubmit(event) {
    event.preventDefault();
    this.props.onSubmit();
  }

  validate(name, value) {
    let valid;
    let errorMessage;
    switch (name) {
      case "size":
        let number = Number(value);
        const min = 1;
        const max = 50;
        valid = Number.isInteger(number) && number >= min && number <= max;
        errorMessage = valid ? "" : `Size must be an integer between ${min} and ${max} (inclusive)`;
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
    for (let valid of Object.values(this.state.valid)) {
      if (!valid) {
        return false;
      }
    }
    return true;
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
      <div>
        <Header as="h2">Create Wordsearch</Header>
        <div>
          <Header as="h3" attached="top">Choose Options</Header>
          <Segment attached>
            <Form onSubmit={this.handleSubmit} error={!this.isFormValid()}>
              <Form.Field inline>
                <label>Size</label>
                <Input type="number" name="size" min={1} max={50} value={this.props.size} onChange={this.handleChange}
                       error={!this.state.valid.size}/>
                &nbsp;
                <span className="symbol">&times;</span>
                &nbsp;
                <Input type="number" name="size" min={1} max={50} value={this.props.size} onChange={this.handleChange}
                       error={!this.state.valid.size}/>
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
              <Message error>
                <Message.Header>Error</Message.Header>
                <Message.List>
                  {nonEmptyErrorMessages.map((errorMessage, index) => (
                    <Message.Item key={index}>{errorMessage}</Message.Item>
                  ))}
                </Message.List>
              </Message>
              <Button type="submit">Create</Button>
            </Form>
          </Segment>
        </div>
      </div>
    );
  }
}

export default FormComponent;
