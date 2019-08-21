import React, { Component } from 'react'
import { Button, Confirm } from 'semantic-ui-react'

class ConfirmButton extends Component {
  state = { open: false }

  show = (event) => {
      event.stopPropagation();
      this.setState({ open: true });
    }
  handleConfirm = () => {
      var {onClick} = this.props;
      this.setState({ open: false });
      onClick();
    }
  handleCancel = () => this.setState({ open: false })

  render() {
    var {active, lastVoted} = this.props;
    var content = lastVoted ? "unvote":"vote";
    var icon = lastVoted ? "minus":"plus";
    // console.log(lastVoted)
    return (
      <span>
        <Button onClick={this.show} content={content} floated="right" size="tiny" fluid primary icon={icon} disabled={!active && !lastVoted}/>   
        <Confirm
          open={this.state.open}
          header='Your vote will be given to this candidate '
          onCancel={this.handleCancel}
          onConfirm={this.handleConfirm}
        />
      </span>
    )
  }
}

export default ConfirmButton;
