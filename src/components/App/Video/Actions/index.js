import React, { Component, PropTypes } from 'react'
import { css } from 'aphrodite'
import Input from 'components/Shared/Input'
import Button from 'components/Shared/Button'
import styles from './styles'

const propTypes = {
  onChange: PropTypes.func.isRequired,
  onShift: PropTypes.func.isRequired,
  onDownload: PropTypes.func.isRequired
}

class Actions extends Component{
  constructor(props){
    super(props)
    this.state = {
      shifted: false
    }

    this.handleShift = this.handleShift.bind(this)
  }

  handleShift(){
    this.setState({
      shifted: !this.state.shifted
    })

    this.props.onShift()
  }

  render(){
    return(
      <div>
         <div className={css(styles.inputs)}>
          <Input icon="fa-user" type="text" name="artist" placeholder="Artist" onChange={this.props.onChange} />
          <Input icon="fa-music" type="text" name="title" placeholder="Title" onChange={this.props.onChange} />
        </div>
        <div className={css(styles.buttons)}>
          <Button
            appearance="light"
            icon={this.state.shifted ? 'fa-undo':'fa-plus'}
            className={css(styles.shift)}
            onClick={this.handleShift}
          >
            {this.state.shifted ?
              'Remove':'Include'
            }
          </Button>
          <Button className={css(styles.download)} onClick={this.props.onDownload}>Download</Button>
        </div>
      </div>
    )
  }
}

Actions.propTypes = propTypes

export default Actions
