import React, {Component} from 'react';
import './App.css';
import {Container, Divider, Header, Icon, Menu} from 'semantic-ui-react';
import FormComponent from "./FormComponent";
import WordsearchComponent from "./WordsearchComponent";

class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      size: 15,
      words: [""],
      allowBackwards: true,
      allowParts: true,
      submitted: false
    };

    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleChange = this.handleChange.bind(this);
  }

  handleChange(name, value, callback) {
    this.setState({
      submitted: false,
      [name]: value
    }, callback);
  }

  handleSubmit() {
    this.setState({
      submitted: true
    }, () => this.wordsearchComponent.update());
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
          <FormComponent size={this.state.size} words={this.state.words} allowBackwards={this.state.allowBackwards}
                         allowParts={this.state.allowParts} onChange={this.handleChange}
                         onSubmit={this.handleSubmit}/>
          <Container>
            <Divider section/>
          </Container>
          <WordsearchComponent size={this.state.size} words={this.state.words}
                               allowBackwards={this.state.allowBackwards} allowParts={this.state.allowParts}
                               submitted={this.state.submitted} ref={input => this.wordsearchComponent = input}/>
        </div>
      </div>
    );
  }
}

export default App;
