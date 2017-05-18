import React, { Component, PropTypes } from 'react'
import { css } from 'aphrodite'
import loadJS from 'load-js'
import config from 'config'
import Button from 'components/Shared/Button'
import styles from './styles'

const propTypes = {
  onSubmit: PropTypes.func.isRequired
}

class Form extends Component{
  constructor(props){
    super(props)
    this.state = {
      ready: false,
      link: ''
    }

    this.handleChange = this.handleChange.bind(this)
    this.handleSubmit = this.handleSubmit.bind(this)
  }

  componentWillMount(){
    loadJS(['https://apis.google.com/js/api.js'])
      .then(() => new Promise(resolve => gapi.load('client', resolve)))
      .then(() => new Promise(resolve => gapi.client.load('youtube', 'v3', resolve)))
      .then(() => gapi.client.setApiKey(config.apiKey))
      .then(() => this.setState({
        ready: true
      }))
  }

  handleChange(e){
    this.setState({
      link: e.target.value
    })
  }

  handleSubmit(e){
    e.preventDefault()
    this.props.onSubmit(this.state.link)
  }

  render(){
    return(
      <div className={css(styles.container)}>
        <form onSubmit={this.handleSubmit}>
          <input
            type="text"
            className={css(styles.element, styles.input)}
            onChange={this.handleChange}
            placeholder="Youtube link (playlist or video)"
            disabled={!this.state.ready}
          />
          <Button
            className={css(styles.element, styles.button)}
            type="submit"
            disabled={!this.state.ready}
          >
            {this.state.ready ?
              'Analyze' : 'Loading'
            }
          </Button>
          <p className={css(styles.element, styles.subtitle)}>
            {
              (!!this.props.error && this.props.error.children) || '\u00A0' // keep line height
            }
          </p>
        </form>
      </div>
    )
  }
}

Form.propTypes = propTypes

export default Form
