import React from 'react'
import { connect } from 'react-redux'
import { fetch } from 'actions'
import Form from 'components/App/Landing/Form'

var smoothScroll = require('smoothscroll')

const mapDispatchToProps = (dispatch) => {
  return {
    onSubmit: (kind, id) => {
      console.log('analyze ' + kind + ' - ' + id)
      // dispatch(fetch(kind, id))
      // smoothScroll(document.querySelector('.toolbar'))
    }
  }
}

const AnalyzeForm = connect(
  mapDispatchToProps
)(Form)

export default AnalyzeForm
