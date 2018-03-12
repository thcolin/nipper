import React from 'react'
import { connect } from 'react-redux'
import { initializeContext, inspectSubject } from 'ducks/context'
import Form from 'components/Form'

const mapStateToProps = (state) => ({
  value: state.context.subject,
  label: 'Analyze',
  placeholder: 'YouTube link (playlist or video)',
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

const FormAnalysis = connect(
  mapStateToProps,
  mapDispatchToProps
)(Form)

export default FormAnalysis
