import React, { Component } from 'react'
import { connect } from 'react-redux'
import Placeholder from 'components/Shared/Placeholder'
import RowVideo from 'containers/RowVideo'
import VirtuaList from 'react-virtualist'

const mapStateToProps = (state) => {
  const total = state.videos.result.length ? (state.context.total - state.errors.result.filter(uuid => state.errors.entities[uuid].origin === 'context').length) : 0

  return {
    height: 220,
    items: [].concat(state.videos.result, Array(total - state.videos.result.length).fill(null)),
    render: (uuid, row, style) => (
      <div key={row} style={Object.assign({ width: '100%' }, style)}>
        { uuid ? <RowVideo uuid={uuid} /> : <Placeholder /> }
      </div>
    ),
    offset: 5,
    style: {
      width: '100%'
    }
  }
}

export default connect(
  mapStateToProps
)(VirtuaList)
