import React from 'react'
import { connect } from 'react-redux'
import { analyze } from 'actions'
import Analyzer from './index.js'

const mapStateToProps = (state) => {
  return {}
}

const mapDispatchToProps = (dispatch) => {
  return {
    onAnalyze: (model, id) => {
      dispatch(analyze(model, id))
    }
  }
}

const AnalyzerContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(Analyzer)

export default AnalyzerContainer
