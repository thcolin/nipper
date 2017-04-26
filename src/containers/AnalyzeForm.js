import React from 'react'
import { connect } from 'react-redux'
import { processAnalyze } from 'ducks/analyze'
import Form from 'components/App/Landing/Form'

var smoothScroll = require('smoothscroll')

const mapStateToProps = (state) => ({
  disabled: false
})

const mapDispatchToProps = (dispatch) => ({
  onSubmit: (kind, id) => {
    dispatch(processAnalyze(kind, id))
    // smoothScroll(document.querySelector('.toolbar'))
  }
})

const AnalyzeForm = connect(
  mapStateToProps,
  mapDispatchToProps
)(Form)

export default AnalyzeForm
