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
  }

  handleSubmit() {
    this.setState({
      valid: true
    });
  }

  render() {
    return (
      <Container>
        <Header as="h1">Wordsearch Generator</Header>
        <FormComponent size={this.state.size} words={this.state.words} allowBackwards={this.state.allowBackwards}
                       allowParts={this.state.allowParts} onSizeChange={v => this.setState({size: v})}
                       onWordsChange={v => this.setState({words: v})}
                       onAllowBackwardsChange={v => this.setState({allowBackwards: v})}
                       onAllowPartsChange={v => this.setState({allowParts: v})} onSubmit={this.handleSubmit}/>
        {this.state.valid ? (
          <WordsearchComponent size={this.state.size} words={this.state.words}
                               allowBackwards={this.state.allowBackwards} allowParts={this.state.allowParts}/>
        ) : (
          <p>Wordsearch will appear here.</p>
        )}
      </Container>
    );
  }
}

export default App;
