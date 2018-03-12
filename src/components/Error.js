import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { css, StyleSheet } from 'aphrodite/no-important'
import FontAwesomeIcon from '@fortawesome/react-fontawesome'
import { faExclamationTriangle, faTimes } from '@fortawesome/fontawesome-free-solid'

const propTypes = {
  uuid: PropTypes.string.isRequired,
  children: PropTypes.any,
  closable: PropTypes.bool,
  onClose: PropTypes.func
}

const defaultProps = {
  closable: true,
  children: 'Unknown error'
}

const styles = StyleSheet.create({
  container: {
    boxSizing: 'border-box',
    width: '100%',
    maxWidth: '700px',
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    border: '1px solid #ff1744',
    borderRadius: '40px',
    color: '#ff1744',
    padding: '10px 15px',
    margin: '10px',
    ':hover': {
      cursor: 'pointer',
      color: '#D50000',
      textDecoration: 'none'
    }
  },
  text: {
    flex: 1,
    margin: '0 0 0 10px',
    textAlign: 'center'
  },
  important: {

  }
})

class Error extends Component{
  constructor(props){
    super(props)

    this.handleClick = this.handleClick.bind(this)
  }

  handleClick(e){
    e.preventDefault()

    if(this.props.closable){
      this.props.onClose()
    }
  }

  render(){
    return(
      <a className={[css(styles.container), this.props.className].join(' ')} onClick={this.handleClick}>
        <FontAwesomeIcon icon={faExclamationTriangle} />
        <p className={css(styles.text, !this.props.closable && styles.important)}>{this.props.children}</p>
        {this.props.closable && <FontAwesomeIcon icon={faTimes} className={css(styles.close)} />}
      </a>
    )
  }
}

Error.propTypes = propTypes
Error.defaultProps = defaultProps

export default Error
