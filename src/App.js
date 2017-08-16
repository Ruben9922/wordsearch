import React, {Component} from 'react';
import './App.css';
import {Container, Header} from 'semantic-ui-react';
import FormComponent from "./FormComponent";

class App extends Component {
  render() {
    return (
      <Container>
        <Header as="h1">Wordsearch Generator</Header>
        <FormComponent/>
      </Container>
    );
  }
}

export default App;
