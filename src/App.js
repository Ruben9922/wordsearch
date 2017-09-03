import React, {Component} from 'react';
import './App.css';
import {Container, Header} from 'semantic-ui-react';
import FormComponent from "./FormComponent";
import WordsearchComponent from "./WordsearchComponent";

class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      size: 15,
      words: ["hi"],
      allowBackwards: true,
      allowParts: true,
      valid: false
    };

    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleChange = this.handleChange.bind(this);
  }

  handleChange(name, value, callback) {
    this.setState({
      valid: false,
      [name]: value
    }, callback);
  }

  handleSubmit() {
    this.setState({
      valid: true
    }, () => this.wordsearchComponent.update());
  }

  render() {
    return (
      <Container>
        <Header as="h1">Wordsearch Generator</Header>
        <FormComponent size={this.state.size} words={this.state.words} allowBackwards={this.state.allowBackwards}
                       allowParts={this.state.allowParts} onChange={this.handleChange} onSubmit={this.handleSubmit}/>
        {this.state.valid ? (
          <WordsearchComponent size={this.state.size} words={this.state.words}
                               allowBackwards={this.state.allowBackwards} allowParts={this.state.allowParts}
                               ref={input => this.wordsearchComponent = input}/>
        ) : (
          <p>Wordsearch will appear here.</p>
        )}
      </Container>
    );
  }
}

export default App;
