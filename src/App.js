import React, {Component} from 'react';
import {Container, Divider, Header, Icon, Menu} from 'semantic-ui-react';
import FormComponent from "./FormComponent";
import WordsearchComponent from "./WordsearchComponent";

class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      parameters: {
        size: 15,
        words: [""],
        allowBackwards: true,
        allowParts: true
      },
      valid: {
        size: true,
        words: false
      },
      errorMessages: {
        size: [],
        words: []
      },
      submitted: false,
    };

    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.validate = this.validate.bind(this);
  }

  handleChange(name, value) {
    this.setState(prevState => ({
      submitted: false,
      parameters: Object.assign({}, prevState.parameters, {[name]: value})
    }));
  }

  handleSubmit() {
    this.setState({
      submitted: true
    }, () => {
      // Validate form fields
      this.validate(() => {
        // Update wordsearch component, only if all form fields are valid (only once state has been updated, hence the callback)
        if (Object.values(this.state.valid).every(item => item === true)) {
          this.wordsearchComponent.update();
        }
      });
    });
  }

  // TODO: Move back to FormComponent
  validate(callback) {
    let valid = {};
    let errorMessages = {};

    // Size
    {
      valid.size = true;
      errorMessages.size = "";

      let number = Number(this.state.parameters.size);
      const min = 1;
      const max = 50;
      if (!(Number.isInteger(number) && number >= min && number <= max)) {
        valid.size = false;
        errorMessages.size = `Size must be an integer between ${min} and ${max} (inclusive)`;
      }
    }

    // Words
    {
      valid.words = new Array(this.state.parameters.words.length).fill(true);
      errorMessages.words = new Array(this.state.parameters.words.length).fill("");

      const pattern = /^(\s*[a-zA-Z]+\s*)+$/;
      for (let [index, word] of this.state.parameters.words.entries()) {
        if (word === "") {
          valid.words[index] = false;
          errorMessages.words[index] = "Word cannot be empty";
          continue;
        }
        if (!pattern.test(word)) {
          valid.words[index] = false;
          errorMessages.words[index] = "Word must only consist of letters, optionally separated by spaces (e.g. \"dog\", \"dog food\", \"Rottweiler\")";
          continue;
        }
        if (valid.size && word.length > this.state.parameters.size) {
          valid.words[index] = false;
          errorMessages.words[index] = "Length of word cannot exceed size";
        }
      }
    }

    this.setState({
      valid: valid,
      errorMessages: errorMessages
    }, callback);
  }

  render() {
    return (
      <div>
        <Menu fixed="top" inverted>
          <Container>
            <Menu.Item header link href=".">Wordsearch Generator</Menu.Item>
            <Menu.Menu position="right">
              <Menu.Item link href="//rubendougall.co.uk/">
                <Icon name="arrow left"/>
                Back to Main Website
              </Menu.Item>
              <Menu.Item link href="https://github.com/Ruben9922/wordsearch">
                <Icon name="github"/>
                GitHub
              </Menu.Item>
            </Menu.Menu>
          </Container>
        </Menu>
        <div style={{marginTop: "4em"}}>
          <Header as="h1" textAlign="center">Wordsearch Generator</Header>
          <FormComponent size={this.state.parameters.size} words={this.state.parameters.words} allowBackwards={this.state.parameters.allowBackwards}
                         allowParts={this.state.parameters.allowParts} onChange={this.handleChange}
                         onSubmit={this.handleSubmit} submitted={this.state.submitted} valid={this.state.valid} errorMessages={this.state.errorMessages}/>
          <Container>
            <Divider section/>
          </Container>
          <WordsearchComponent size={parseInt(this.state.parameters.size, 10)} words={this.state.parameters.words}
                               allowBackwards={this.state.parameters.allowBackwards} allowParts={this.state.parameters.allowParts}
                               submitted={this.state.submitted} valid={this.state.valid} ref={input => this.wordsearchComponent = input}/>
        </div>
      </div>
    );
  }
}

export default App;
