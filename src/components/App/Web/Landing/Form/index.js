import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { css } from 'aphrodite'
import loadJS from 'load-js'
import config from 'config'
import setRandomInterval from 'randomized-interval'
import { faCircleNotch } from '@fortawesome/fontawesome-free-solid'
import Button from 'components/Shared/Button'
import styles from './styles'

const propTypes = {
  link: PropTypes.string.isRequired,
  ready: PropTypes.bool.isRequired,
  onLoad: PropTypes.func,
  onSubmit: PropTypes.func.isRequired
}

const defaultProps = {
  onLoad: () => {}
}

class Form extends Component{
  constructor(props){
    super(props)
    this.state = {
      link: props.link,
      progress: 0,
      ticker: setRandomInterval(() => {
        this.setState({
          progress: this.state.progress + (Math.random() * 10)
        })
      }, 1000)
    }

    this.handleChange = this.handleChange.bind(this)
    this.handleSubmit = this.handleSubmit.bind(this)
  }

  componentWillMount(){
    this.props.onLoad()
  }

  componentWillReceiveProps(next){
    if(next.ready){
      this.state.ticker.clear()
    }

    this.setState({
      link: next.link
    })
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
            type="search"
            className={css(styles.element, styles.input)}
            onChange={this.handleChange}
            value={this.state.link}
            placeholder="Youtube link (playlist or video)"
            disabled={!this.props.ready}
            required
          />
          <Button
            icon={this.props.ready ? {} : Object.assign({}, faCircleNotch, {
              features: {
                spin: true
              }
            })}
            className={css(styles.element, styles.button)}
            type="submit"
            progress={this.props.ready ? null : this.state.progress}
            disabled={!this.props.ready}
          >
            { this.props.ready ? 'Analyze' : 'Loading' }
          </Button>
        </form>
      </div>
    )
  }
}

Form.propTypes = propTypes
Form.defaultProps = defaultProps

export default Form
