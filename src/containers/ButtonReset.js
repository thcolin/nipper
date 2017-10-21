import React, { Component } from 'react'
import { connect } from 'react-redux'
import { clearContext } from 'ducks/context'
import Button from 'components/Shared/Button'

const mapStateToProps = (state) => ({
  icon: state.context.total === null ? '' : 'fa-close',
  appearance: 'light',
  children: '',
})

const mapDispatchToProps = (dispatch) => ({
  onClick: () => {
    dispatch(clearContext())
  }
})

class ButtonReset extends Component{
  render(){
    return this.props.icon ? <Button {...this.props} /> : null
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ButtonReset)
