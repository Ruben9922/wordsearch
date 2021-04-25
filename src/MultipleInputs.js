import React, {Component} from 'react';
import {IconButton, TextField} from "@material-ui/core";
import AddIcon from "@material-ui/icons/Add";
import DeleteIcon from "@material-ui/icons/Delete";
import {v4 as uuidv4} from "uuid";
import * as R from "ramda";

export default function MultipleInputs({
  value,
  onChange,
  valid,
  errorMessages,
}) {
  const handleChange = (index, value) => {
    const lens = R.lensPath([index, "text"]);
    onChange(v => R.set(lens, value, v));
  };

  // TODO: Fix input values not changing properly when using transition group
  // TODO: Add remove button for each input
  let values = value;
  return (
    <React.Fragment>
      {values.map((value, index) => (
        <TextField
          key={index}
          label={"Word " + (index + 1)}
          value={value.text}
          onChange={(event) => handleChange(index, event.target.value)}
          error={!valid[index]}
          helperText={!valid[index] && errorMessages[index]}
        />
      ))}
      {/*<div>*/}
        <IconButton onClick={() => onChange(v => R.append({id: uuidv4(), text: ""}, v))}>
          <AddIcon />
        </IconButton>
        <IconButton disabled={values.length <= 1} onClick={() => onChange(v => R.init(v))}>
          <DeleteIcon />
        </IconButton>
      {/*</div>*/}
    </React.Fragment>
  );
}
