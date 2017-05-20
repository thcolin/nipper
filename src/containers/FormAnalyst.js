import React from 'react'
import { connect } from 'react-redux'
import { analyzeSubject } from 'ducks/context'
import Form from 'components/App/Landing/Form'

const mapStateToProps = (state) => ({
  disabled: false
})

const mapDispatchToProps = (dispatch) => ({
  onSubmit: (subject) => {
    dispatch(analyzeSubject(subject))
  }
})

const FormAnalyst = connect(
  mapStateToProps,
  mapDispatchToProps
)(Form)

export default FormAnalyst
