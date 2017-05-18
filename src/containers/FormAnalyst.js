import React from 'react'
import { connect } from 'react-redux'
import { analyzeSubject } from 'ducks/context'
import Form from 'components/App/Landing/Form'
import smoothScroll from 'smoothscroll'

const mapStateToProps = (state) => ({
  error: state.errors.result.map(id => state.errors.entities[id]).filter(error => error.origin === 'landing')[0],
  disabled: false
})

const mapDispatchToProps = (dispatch) => ({
  onSubmit: (subject) => {
    dispatch(analyzeSubject(subject))
    // smoothScroll(document.querySelector('.toolbar'))
  }
})

const FormAnalyst = connect(
  mapStateToProps,
  mapDispatchToProps
)(Form)

export default FormAnalyst
