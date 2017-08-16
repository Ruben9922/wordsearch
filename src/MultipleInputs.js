import React, {Component} from 'react';
import {Button, Form, Grid} from 'semantic-ui-react'

class MultipleInputs extends Component {
  constructor(props) {
    super(props);

    this.state = {
      inputs: [""]
    };

    this.add = this.add.bind(this);
    this.remove = this.remove.bind(this);
    this.handleChange = this.handleChange.bind(this);
  }

  handleChange(index, event) {
    console.log(event.target.value);
    console.log(this.state.inputs);

    let inputsCopy = this.state.inputs.slice();
    inputsCopy.splice(index, 1, event.target.value);
    this.setState({
      inputs: inputsCopy
    });
  }

  add() {
    this.setState((prevState) => ({
      inputs: prevState.inputs.concat([""])
    }));
  }

  remove() {
    if (this.state.inputs.length > 1) {
      let inputsCopy = this.state.inputs.slice();
      inputsCopy.splice(-1, 1);
      this.setState((prevState) => ({
        inputs: inputsCopy
      }));
    }
  }

  render() {
    const inputElements = this.state.inputs.map((input, index) => (
      <Form.Input key={index} value={input} onChange={(event) => this.handleChange(index, event)}/>
    ));
    return (
      <Grid columns={2} divided>
        <Grid.Column>
          {inputElements}
        </Grid.Column>
        <Grid.Column>
          <Button icon="add" onClick={this.add}/>
          <Button icon="remove" onClick={this.remove}/>
        </Grid.Column>
      </Grid>
    );
  }
}

export default MultipleInputs;
