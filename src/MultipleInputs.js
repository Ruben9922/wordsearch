import React, {Component} from 'react';
import {Button, Form, Input, Label} from 'semantic-ui-react'

class MultipleInputs extends Component {
  constructor(props) {
    super(props);

    this.add = this.add.bind(this);
    this.remove = this.remove.bind(this);
    this.handleChange = this.handleChange.bind(this);
  }

  handleChange(index, event) {
    let values = this.props.value;
    let valuesCopy = values.slice();
    valuesCopy.splice(index, 1, event.target.value);

    this.props.onChange(event, {
      name: this.props.name,
      value: valuesCopy
    });
  }

  add(event) {
    event.preventDefault();

    let values = this.props.value;
    let value = values.concat([""]);
    this.props.onChange(event, {
      name: this.props.name,
      value: value
    });
  }

  remove(event) {
    event.preventDefault();

    let values = this.props.value;
    let value = values.slice(0, -1);
    this.props.onChange(event, {
      name: this.props.name,
      value: value
    });
  }

  // TODO: Fix input values not changing properly when using transition group
  // TODO: Add remove button for each input
  render() {
    let values = this.props.value;
    return (
      <React.Fragment>
        {values.map((value, index) => (
          <React.Fragment key={index}>
            <Form.Field error={this.props.submitted && !this.props.valid[index]}
                        style={{marginBottom: "10px"}}>
              <Input
                value={value}
                placeholder={"Word #" + (index + 1)}
                onChange={(event) => this.handleChange(index, event)}
              />

              {this.props.submitted && !this.props.valid[index] && (
                <Label color="red" pointing>
                  {this.props.errorMessages[index]}
                </Label>
              )}
            </Form.Field>
          </React.Fragment>
        ))}
        <div>
          <Button icon="add" onClick={this.add}/>
          <Button icon="remove" disabled={values.length <= 1} onClick={this.remove}/>
        </div>
      </React.Fragment>
    );
  }
}

MultipleInputs.defaultProps = {
  value: [""]
};

export default MultipleInputs;
