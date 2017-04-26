import React, { Component } from 'react'
import { connect } from 'react-redux'
import { closeError } from 'ducks/errors'
import Error from 'components/Shared/Error'

const mapStateToProps = (state, ownProps) => ({
  raw: state.errors[ownProps.id]
})

const mapDispatchToProps = (dispatch, ownProps) => ({
  onClose: (id) => {
    console.log('close error ' + id)
    dispatch(closeError(id))
  }
})

class FilledError extends Component{
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
)(FilledError)
