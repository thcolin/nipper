import React, { Component, PropTypes } from 'react'
import { css } from 'aphrodite'
import Input from 'components/Shared/Input'
import Button from 'components/Shared/Button'
import styles from './styles'

const propTypes = {
  values: PropTypes.object,
  shifted: PropTypes.bool.isRequired,
  downloading: PropTypes.bool.isRequired,
  onChange: PropTypes.func.isRequired,
  onShift: PropTypes.func.isRequired,
  onDownload: PropTypes.func.isRequired
}

const defaultProps = {
  values: {
    song: null,
    artist: null
  }
}

class Actions extends Component{
  constructor(props){
    super(props)
    this.state = {
      shifted: false
    }

    this.handleShift = this.handleShift.bind(this)
  }

  componentWillReceiveProps(next){
    this.setState({shifted: next.shifted})
  }

  handleShift(){
    this.setState({
      shifted: !this.state.shifted
    })

    this.props.onShift()
  }

  render(){
    return(
      <div className={css(styles.container)}>
         <div className={css(styles.inputs)}>
          <Input
            icon="fa-user"
            type="text"
            name="artist"
            value={this.props.values.artist}
            placeholder="Artist"
            onChange={this.props.onChange}
          />
          <Input
            icon="fa-music"
            type="text"
            name="song"
            value={this.props.values.song}
            placeholder="Song"
            onChange={this.props.onChange}
          />
        </div>
        <div className={css(styles.buttons)}>
          <Button
            appearance="light"
            icon={this.props.shifted ? 'fa-undo':'fa-plus'}
            className={css(styles.shift)}
            onClick={this.handleShift}
          >
            {this.props.shifted ?
              'Remove':'Include'
            }
          </Button>
          <Button
            icon={this.props.downloading ? 'fa-circle-o-notch fa-spin fa-fw' : ''}
            className={css(styles.download)}
            onClick={this.props.onDownload}
          >
            {this.props.downloading ?
              'Cancel' : 'Download'
            }
          </Button>
        </div>
      </div>
    )
  }
}

Actions.propTypes = propTypes

export default Actions
