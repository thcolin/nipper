import React from 'react'
import { connect } from 'react-redux'
import { closeError } from 'actions'
import List from 'components/Shared/List'
import Error from 'components/Shared/Error'

const mapStateToProps = (state) => {
  return {
    items: state.errors.filter(e => !e.closed)
  }
}

const mapDispatchToProps = (dispatch, ownProps) => {
  var props = Object.assign({}, ownProps)

  props.renderItem = (item, props) => {
    return (
      <Error
        key={item.id}
        {...item}
        {...props}
      />
    )
  }

  if(typeof props.itemProps === 'undefined'){
    props.itemProps = {}
  }

  props.itemProps.onClose = (id) => {
    dispatch(closeError(id))
  }

  return props
}

const ErrorList = connect(
  mapStateToProps,
  mapDispatchToProps
)(List)

export default ErrorList
