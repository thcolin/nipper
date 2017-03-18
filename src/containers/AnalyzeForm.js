import React from 'react'
import { connect } from 'react-redux'
import { processAnalyze } from 'actions'
import Form from 'components/App/Landing/Form'

var smoothScroll = require('smoothscroll')

const mapStateToProps = (state) => ({})

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
