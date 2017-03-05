import React from 'react'
import { connect } from 'react-redux'
import { analyze } from 'actions'
import Search from 'components/App/Landing/Search'

let Analyze = ({ dispatch }) => {
  let input

  return (
    <Search onAnalyze={v => dispatch(analyze(v))} />
  )
}

Analyze = connect()(Analyze)

export default Analyze
