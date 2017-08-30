import React, {Component} from 'react';
import {Button, Form, Grid} from 'semantic-ui-react'

class MultipleInputs extends Component {
  constructor(props) {
    super(props);

    this.add = this.add.bind(this);
    this.remove = this.remove.bind(this);
    this.handleChange = this.handleChange.bind(this);
  }

  handleChange(index, event) {
    let inputs = this.props.value;

    let inputsCopy = inputs.slice();
    inputsCopy.splice(index, 1, event.target.value);
    this.props.onChange(inputsCopy);
  }

  add() {
    let inputs = this.props.value;

    this.props.onChange(inputs.concat([""]));
  }

  remove() {
    let inputs = this.props.value;
    let inputsCopy = inputs.slice();
    inputsCopy.splice(-1, 1);
    this.props.onChange(inputsCopy);
  }
  render() {
    let inputs = this.props.value;

    const inputElements = inputs.map((input, index) => (
      <Form.Input key={index} value={input} onChange={(event) => this.handleChange(index, event)}/>
    ));
    return (
      <Grid columns={2} divided>
        <Grid.Column>
          {inputElements}
        </Grid.Column>
        <Grid.Column>
          <Button icon="add" onClick={this.add}/>
          <Button icon="remove" disabled={inputs.length <= 1} onClick={this.remove}/>
        </Grid.Column>
      </Grid>
    );
  }
}

MultipleInputs.defaultProps = {
  value: [""]
};

export default MultipleInputs;
