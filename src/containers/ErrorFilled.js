import React, { Component } from 'react'
import { connect } from 'react-redux'
import { closeError } from 'ducks/error'
import Error from 'components/Shared/Error'

const mapStateToProps = (state, ownProps) => ({
  raw: state.errors[ownProps.id]
})

const mapDispatchToProps = (dispatch, ownProps) => ({
  onClose: (id) => {
    dispatch(closeError(id))
  }
})

class ErrorFilled extends Component{
  render(){
    return (
      <Error
        {...this.props.raw}
        onClose={this.props.onClose}
      />
    )
  }
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(ErrorFilled)
