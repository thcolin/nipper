import React from 'react'
import { connect } from 'react-redux'
import { processAnalyze } from 'ducks/context'
import Form from 'components/App/Landing/Form'
import smoothScroll from 'smoothscroll'

const mapStateToProps = (state) => ({
  disabled: false
})

const mapDispatchToProps = (dispatch) => ({
  onSubmit: (kind, id) => {
    dispatch(processAnalyze(kind, id))
    // smoothScroll(document.querySelector('.toolbar'))
  }
})

const FormAnalyze = connect(
  mapStateToProps,
  mapDispatchToProps
)(Form)

export default FormAnalyze
