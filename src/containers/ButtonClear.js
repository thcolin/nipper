import React, { Component } from 'react'
import { connect } from 'react-redux'
import { clearErrors } from 'ducks/errors'
import { clearVideos } from 'ducks/videos'
import { clearContext } from 'ducks/context'
import { faTimes } from '@fortawesome/fontawesome-free-solid'
import Button from 'components/Button'

const mapStateToProps = (state) => ({
  show: !(state.context.total === null && state.errors.result.length === 0),
  icon: faTimes,
  appearance: 'light',
  children: '',
})

const mapDispatchToProps = (dispatch) => ({
  onClick: () => {
    dispatch(clearErrors())
    dispatch(clearVideos())
    dispatch(clearContext())
  }
})

class ButtonClear extends Component{
  render(){
    const {show, ...props} = this.props

    return show ? <Button {...props} /> : null
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ButtonClear)
