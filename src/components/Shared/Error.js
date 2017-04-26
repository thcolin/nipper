import React, { Component, PropTypes } from 'react'
import { css, StyleSheet } from 'aphrodite/no-important'
import Icon from 'components/Shared/Icon'

const propTypes = {
  id: PropTypes.number.isRequired,
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
    borderRadius: '20px',
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
    margin: '0 0 0 10px'
  },
  centered: {
    textAlign: 'center'
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
      this.props.onClose(this.props.id)
    }
  }

  render(){
    console.log('render error', this.props.id)
    return(
      <a className={[css(styles.container), this.props.className].join(' ')} onClick={this.handleClick}>
        <Icon label="fa-warning" />
        <p className={css(styles.text, !this.props.closable && styles.centered)}>{this.props.children}</p>
        {this.props.closable ?
          <Icon label="fa-times" className={css(styles.close)} /> : ''
        }
      </a>
    )
  }
}

Error.propTypes = propTypes
Error.defaultProps = defaultProps

export default Error
