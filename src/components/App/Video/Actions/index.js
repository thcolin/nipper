import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { css } from 'aphrodite'
import Input from 'components/Shared/Input'
import Button from 'components/Shared/Button'
import styles from './styles'

const propTypes = {
  values: PropTypes.object,
  selected: PropTypes.bool.isRequired,
  locked: PropTypes.bool.isRequired,
  progress: PropTypes.number,
  onChange: PropTypes.func.isRequired,
  onSelect: PropTypes.func.isRequired,
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
      selected: false
    }

    this.handleSelect = this.handleSelect.bind(this)
  }

  componentWillReceiveProps(next){
    this.setState({selected: next.selected})
  }

  handleSelect(){
    this.setState({
      selected: !this.state.selected
    })

    this.props.onSelect()
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
            disabled={this.props.progress !== null}
          />
          <Input
            icon="fa-music"
            type="text"
            name="song"
            value={this.props.values.song}
            placeholder="Song"
            onChange={this.props.onChange}
            disabled={this.props.progress !== null}
          />
        </div>
        <div className={css(styles.buttons)}>
          <Button
            appearance="light"
            icon={this.props.selected ? 'fa-undo':'fa-plus'}
            className={css(styles.select)}
            onClick={this.handleSelect}
            disabled={this.props.locked}
          >
            {this.props.selected ?
              'Remove':'Include'
            }
          </Button>
          <Button
            icon={this.props.progress === null ? '' : (this.props.progress === 100 ? 'fa-check' : 'fa-circle-o-notch fa-spin fa-fw')}
            className={css(styles.download)}
            style={{display: 'flex', flex: 1}}
            progress={this.props.progress}
            onClick={this.props.onDownload}
            disabled={this.props.locked}
          >
            {this.props.progress === null ?
              'Download' : this.props.progress === 100 ? 'Done' : 'Cancel'
            }
          </Button>
        </div>
      </div>
    )
  }
}

Actions.propTypes = propTypes

export default Actions
