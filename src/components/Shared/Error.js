import React, { Component, PropTypes } from 'react'
import { css, StyleSheet } from 'aphrodite/no-important'
import Icon from 'components/Shared/Icon'

const propTypes = {
  id: PropTypes.number.isRequired,
  message: PropTypes.string,
  onClose: PropTypes.func.isRequired
}

const defaultProps = {
  message: 'Unknown error'
}

const styles = StyleSheet.create({
  container: {
    boxSizing: 'border-box',
    width: '100%',
    maxWidth: '600px',
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    border: '1px solid #ff1744',
    borderRadius: '20px',
    color: '#ff1744',
    padding: '10px 15px',
    ':hover': {
      cursor: 'pointer',
      color: '#D50000',
      textDecoration: 'none'
    }
  },
  text: {
    margin: '0 0 0 10px'
  },
  close: {
    flex: 1,
    textAlign: 'right'
  }
})

class Error extends Component{
  constructor(props){
    super(props)

    this.handleClick = this.handleClick.bind(this)
  }

  handleClick(e){
    e.preventDefault()
    this.props.onClose(this.props.id)
  }

  render(){
    return(
      <a className={[css(styles.container), this.props.className].join(' ')} onClick={this.handleClick}>
        <Icon label="fa-warning" />
        <p className={css(styles.text)}>{this.props.message}</p>
        <Icon label="fa-times" className={css(styles.close)} />
      </a>
    )
  }
}

Error.propTypes = propTypes
Error.defaultProps = defaultProps

export default Error
