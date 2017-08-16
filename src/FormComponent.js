import React, {Component} from 'react';
import {Button, Checkbox, Form, Header, Input} from 'semantic-ui-react'
import MultipleInputs from "./MultipleInputs";

class FormComponent extends Component {
  constructor(props) {
    super(props);

    this.state = {
      size: 15
    };

    this.handleChange = this.handleChange.bind(this);
  }

  handleChange(event) {
    const target = event.target;
    const value = target.type === "checkbox" ? target.checked : target.value;
    const name = target.name;

    this.setState({
      [name]: value
    });
  }

  render() {
    return (
      <div>
        <Header as="h2">Create Wordsearch</Header>
        <div>
          <Header as="h3">Choose Options</Header>
          <Form>
            <Form.Field inline>
              <label>Size</label>
              <Input type="number" name="size" min={1} max={50} value={this.state.size} onChange={this.handleChange}/>
              &nbsp;
              <span className="symbol">&times;</span>
              &nbsp;
              <Input type="number" name="size" min={1} max={50} value={this.state.size} onChange={this.handleChange}/>
            </Form.Field>
            <Form.Field>
              <label>Words</label>
              <MultipleInputs/>
            </Form.Field>
            <Form.Field>
              <label>Misc.</label>
              <Checkbox label="Allow words to be placed backwards"/><br/>
              <Checkbox label="Allow placing parts of words (to increase difficulty)"/>
            </Form.Field>
            <Button type="submit">Create</Button>
          </Form>
        </div>
      </div>
    );
  }
}

export default FormComponent;
