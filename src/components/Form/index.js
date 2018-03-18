import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { css } from 'aphrodite'
import loadJS from 'load-js'
import config from 'config'
import setRandomInterval from 'randomized-interval'
import { faCircleNotch } from '@fortawesome/fontawesome-free-solid'
import Button from 'components/Button'
import styles from './styles'

const propTypes = {
  value: PropTypes.string.isRequired,
  label: PropTypes.string,
  placeholder: PropTypes.string,
  ready: PropTypes.bool.isRequired,
  onSubmit: PropTypes.func.isRequired
}

const defaultProps = {
  onLoad: () => {},
  label: 'Label',
  placeholder: ''
}

class Form extends Component{
  constructor(props){
    super(props)

    this.state = {
      value: props.value,
      progress: 0,
      quartz: setRandomInterval(() => {
        this.setState({
          progress: this.state.progress + (Math.random() * 10)
        })
      }, 1000)
    }

    this.handleChange = this.handleChange.bind(this)
    this.handleSubmit = this.handleSubmit.bind(this)
  }

  componentWillReceiveProps(next){
    if(next.ready){
      this.state.quartz.clear()
    }

    this.setState({
      value: next.value
    })
  }

  handleChange(e){
    this.setState({
      value: e.target.value
    })
  }

  handleSubmit(e){
    e.preventDefault()
    this.props.onSubmit(this.state.value)
  }

  render(){
    return(
      <div className={[css(styles.container), this.props.className].join(' ')}>
        <form className={css(styles.form)} onSubmit={this.handleSubmit}>
          <input
            type="search"
            className={css(styles.element, styles.input)}
            onChange={this.handleChange}
            value={this.state.value}
            placeholder={this.props.placeholder}
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
            { this.props.ready ? this.props.label : 'Loading' }
          </Button>
        </form>
      </div>
    )
  }
}

Form.propTypes = propTypes
Form.defaultProps = defaultProps

export default Form
