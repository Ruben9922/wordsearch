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
        size: "",
        words: ""
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
    this.setState(prevState => ({
      submitted: true
    }), () => {
      // Validate all form fields
      let promises = Object.entries(this.state.parameters).map(entry => {
        let name = entry[0];
        let value = entry[1];

        return this.validate(name, value);
      });
      Promise.all(promises).then(validValues => {
        // Update wordsearch only all parameters valid
        if (validValues.every(item => item === true)) {
          this.wordsearchComponent.update();
        }
      })
    });
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
          for (let word of this.state.parameters.words) {
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
          if (word.length > this.state.parameters.size) {
            valid = false;
            errorMessage = "Length of each word cannot exceed size";
            break;
          }
        }
        break;
      default:
        return Promise.resolve(true);
    }

    return new Promise((resolve, reject) => {
      this.setState(prevState => ({
        valid: Object.assign({}, prevState.valid, {[name]: valid}),
        errorMessages: Object.assign({}, prevState.errorMessages, {[name]: errorMessage})
      }), () => resolve(valid));
    });
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
