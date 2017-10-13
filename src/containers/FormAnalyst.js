import React from 'react'
import { connect } from 'react-redux'
import { initializeContext, inspectSubject } from 'ducks/context'
import Form from 'components/App/Web/Landing/Form'

const mapStateToProps = (state) => ({
  link: state.context.subject,
  ready: state.context.ready
})

const mapDispatchToProps = (dispatch) => ({
  onLoad: () => {
    dispatch(initializeContext())
  },
  onSubmit: (subject) => {
    dispatch(inspectSubject(subject))
  }
})

const FormAnalyst = connect(
  mapStateToProps,
  mapDispatchToProps
)(Form)

export default FormAnalyst
