import React, { Component } from 'react'
import { connect } from 'react-redux'
import { closeError } from 'ducks/error'
import Error from 'components/Error'

const mapStateToProps = (state, ownProps) => ({
  raw: state.errors.entities[ownProps.uuid]
})

const mapDispatchToProps = (dispatch, ownProps) => ({
  onClose: () => dispatch(closeError(ownProps.uuid))
})

class RowError extends Component{
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
)(RowError)
