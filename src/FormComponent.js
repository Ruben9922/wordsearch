import React, {Component} from 'react';
import {Button, Checkbox, Form, Grid, Header, Icon, Input, Label, Popup, Segment} from 'semantic-ui-react';
import MultipleInputs from "./MultipleInputs";

// TODO: Add error/confirmation message on form (?)
class FormComponent extends Component {
  constructor(props) {
    super(props);

    this.state = {
      dirty: false,
    };

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleChange(event, data) {
    const name = data.name;
    const value = data.value;
    this.props.onChange(name, value);

    this.setState({
      dirty: true
    });
  }

  handleSubmit(event) {
    event.preventDefault();
    this.props.onSubmit();
  }

  render() {
    // TODO: Store min and max size in variables
    return (
      <Grid.Column width={4} floated="left">
        <div>
          <Header as="h3" attached="top" inverted>Options</Header>
          <Segment attached="bottom">
            <Form onSubmit={this.handleSubmit}>
              <Form.Field error={this.props.submitted && !this.props.valid.size}>
                <label>Size</label>
                <Input type="number"
                       name="size"
                       value={this.props.size}
                       onChange={this.handleChange}/>

                {this.props.submitted && !this.props.valid.size && (
                  <Label color="red" pointing>{this.props.errorMessages.size}</Label>
                )}
              </Form.Field>
              <Form.Field>
                <label>Words</label>
                <MultipleInputs name="words" value={this.props.words} onChange={this.handleChange} valid={this.props.valid.words} errorMessages={this.props.errorMessages.words} submitted={this.props.submitted}/>
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
                  content="Choose whether to add randomly generated substrings (&#34;parts&#34;) of words to make the game more difficult. For example, for the word &#34;awesomeness&#34;, add substrings like &#34;a&#34;, &#34;awe&#34; and &#34;awesome&#34;."
                  position="right center"
                />
              </Form.Field>
              <Button type="submit" primary>Create</Button>
            </Form>
          </Segment>
        </div>
      </Grid.Column>
    );
  }
}

export default FormComponent;
