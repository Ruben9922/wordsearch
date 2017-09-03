import React, {Component} from 'react';
import {Button, Checkbox, Form, Header, Icon, Input, Popup, Segment} from 'semantic-ui-react';
import MultipleInputs from "./MultipleInputs";

class FormComponent extends Component {
  constructor(props) {
    super(props);

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleChange(event, data) {
    this.props.onChange(data.name, data.value);
  }

  handleSubmit(event) {
    event.preventDefault();
    this.props.onSubmit();
  }

  // TODO: Validate - e.g. check no words are longer than size
  render() {
    return (
      <div>
        <Header as="h2">Create Wordsearch</Header>
        <div>
          <Header as="h3" attached="top">Choose Options</Header>
          <Segment attached>
            <Form onSubmit={this.handleSubmit}>
              <Form.Field inline>
                <label>Size</label>
                <Input type="number" name="size" min={1} max={50} value={this.props.size} onChange={this.handleChange}/>
                &nbsp;
                <span className="symbol">&times;</span>
                &nbsp;
                <Input type="number" name="size" min={1} max={50} value={this.props.size} onChange={this.handleChange}/>
              </Form.Field>
              <Form.Field>
                <label>Words</label>
                <MultipleInputs name="words" value={this.props.words} onChange={this.handleChange}/>
              </Form.Field>
              <Form.Field>
                <label>Misc.</label>
                <Checkbox type="checkbox" label="Allow words to be placed backwards" name="allowBackwards"
                          checked={this.props.allowBackwards} onChange={this.handleChange}/>
                &nbsp;
                <Popup
                  trigger={<Icon color="blue" name="help circle"/>}
                  content="Choose whether words can be placed right-to-left as well as left-to-right"
                  position="right center"
                />
                <br/>
                <Checkbox type="checkbox" label="Allow parts of words" name="allowParts" checked={this.props.allowParts}
                          onChange={this.handleChange}/>
                &nbsp;
                <Popup
                  trigger={<Icon color="blue" name="help circle"/>}
                  content="Choose whether to add parts of words to make the game more difficult (e.g. &#34;awe&#34;, &#34;awesome&#34;, etc. as well as &#34;awesomeness&#34;)"
                  position="right center"
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
