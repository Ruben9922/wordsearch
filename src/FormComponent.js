import React, {Component} from 'react';
import {Button, Checkbox, Form, Header, Icon, Input, Popup, Segment} from 'semantic-ui-react';
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
          <Header as="h3" attached="top">Choose Options</Header>
          <Segment attached>
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
              <Checkbox label="Allow words to be placed backwards"/>
              <br/>
              <Checkbox label="Allow parts of words"/>
              &nbsp;
              <Popup
                trigger={<Icon color="blue" name="help circle"/>}
                content="Choose whether to add parts of words to make the game more difficult (e.g. &#34;awe&#34;, &#34;awesome&#34;, etc. as well as &#34;awesomeness&#34;)"
              />
            </Form.Field>
            <Button type="submit">Create</Button>
          </Form>
          </Segment>
        </div>
      </div>
    );
  }
}

export default FormComponent;
