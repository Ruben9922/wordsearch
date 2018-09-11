import React, {Component} from 'react';
import {Button, Checkbox, Form, Grid, Header, Icon, Input, Message, Popup, Segment} from 'semantic-ui-react';
import MultipleInputs from "./MultipleInputs";

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

  // TODO: Validate - e.g. check no words are longer than size
  render() {
    let nonEmptyErrorMessages = Object.entries(this.props.errorMessages)
      .filter(entry => {
        let name = entry[0];
        let errorMessage = entry[1];
        return !this.props.valid[name] && errorMessage !== "";
      })
      .map((entry, index) => {
        let errorMessage = entry[1];
        return errorMessage;
      });
    let displayErrorMessages = this.props.submitted && this.state.dirty && !Object.values(this.props.valid).every(item => item === true);
    return (
      <Grid stackable centered padded columns={2}>
        <Grid.Column>
          <Header as="h3" attached="top" inverted>Options</Header>
          <Segment attached={displayErrorMessages ? true : "bottom"}>
            <Form onSubmit={this.handleSubmit}>
              <Form.Field inline error={!this.props.valid.size}>
                <label>Size</label>
                <Input type="number" name="size" min={1} max={50} value={this.props.size} onChange={this.handleChange}/>
                &nbsp;
                <span>&times;</span>
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
              <Button type="submit" primary>Create</Button>
            </Form>
          </Segment>
          {displayErrorMessages && (
            <Message icon error attached="bottom">
              <Icon name="exclamation circle"/>
              <Message.Content>
                <Message.Header>Invalid options</Message.Header>
                <Message.List>
                  {nonEmptyErrorMessages.map((errorMessage, index) => (
                    <Message.Item key={index}>{errorMessage}</Message.Item>
                  ))}
                </Message.List>
              </Message.Content>
            </Message>
          )}
        </Grid.Column>
      </Grid>
    );
  }
}

export default FormComponent;
