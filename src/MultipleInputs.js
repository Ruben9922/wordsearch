import React, {Component} from 'react';
import {Button, Grid, Input, Label} from 'semantic-ui-react'

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

    this.props.onChange(event, {
      name: this.props.name,
      value: inputsCopy
    });
  }

  add(event) {
    event.preventDefault();

    let inputs = this.props.value;
    let value = inputs.concat([""]);
    this.props.onChange(event, {
      name: this.props.name,
      value: value
    });
  }

  remove(event) {
    event.preventDefault();

    let inputs = this.props.value;
    let value = inputs.slice(0, -1);
    this.props.onChange(event, {
      name: this.props.name,
      value: value
    });
  }

  // TODO: Fix input values not changing properly when using transition group
  // TODO: Add remove button for each input
  render() {
    let inputs = this.props.value;
    return (
      <div>
        <Grid columns={2}>
          {inputs.map((input, index) => (
            <Grid.Row>
              <Grid.Column>
                <Input key={index} value={input} placeholder={"Word #" + (index + 1)}
                       error={this.props.submitted && !this.props.valid[index]}
                       onChange={(event) => this.handleChange(index, event)}/>
              </Grid.Column>

              {this.props.submitted && !this.props.valid[index] && (
                <Grid.Column>
                  <Label color="red" pointing="left">{this.props.errorMessages[index]}</Label>
                </Grid.Column>
              )}
            </Grid.Row>
          ))}
          <Grid.Row>
            <Grid.Column>
              <Button icon="add" onClick={this.add}/>
              <Button icon="remove" disabled={inputs.length <= 1} onClick={this.remove}/>
            </Grid.Column>
          </Grid.Row>
        </Grid>
      </div>
    );
  }
}

MultipleInputs.defaultProps = {
  value: [""]
};

export default MultipleInputs;
