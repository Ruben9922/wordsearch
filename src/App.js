import React, {Component} from 'react';
import './App.css';
import {Container, Header} from 'semantic-ui-react';
import FormComponent from "./FormComponent";
import WordsearchComponent from "./WordsearchComponent";

class App extends Component {
  render() {
    return (
      <Container>
        <Header as="h1">Wordsearch Generator</Header>
        {/*<FormComponent/>*/}
        <WordsearchComponent words={["hello", "there", "from", "Ruben"]} size={12} allowBackwards={true}/>
      </Container>
    );
  }
}

export default App;
