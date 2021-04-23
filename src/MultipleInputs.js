import React, {Component} from 'react';
import {IconButton, TextField} from "@material-ui/core";
import AddIcon from "@material-ui/icons/Add";
import DeleteIcon from "@material-ui/icons/Delete";

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
          <TextField
            key={index}
            label={"Word " + (index + 1)}
            value={value}
            onChange={(event) => this.handleChange(index, event)}
            error={this.props.submitted && !this.props.valid[index]}
            helperText={this.props.submitted && !this.props.valid[index] && this.props.errorMessages[index]}
          />
        ))}
        {/*<div>*/}
          <IconButton onClick={this.add}>
            <AddIcon />
          </IconButton>
          <IconButton disabled={values.length <= 1} onClick={this.remove}>
            <DeleteIcon />
          </IconButton>
        {/*</div>*/}
      </React.Fragment>
    );
  }
}

MultipleInputs.defaultProps = {
  value: [""]
};

export default MultipleInputs;
