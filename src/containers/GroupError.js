import React, { Component } from 'react'
import { connect } from 'react-redux'
import Error from 'components/Error'
import RowError from 'containers/RowError'
import uuidv4 from 'uuid/v4'

const mapStateToProps = (state) => ({
  total: state.context.total,
  errors: Object.values(state.errors.entities)
})

class GroupError extends Component{
  constructor(props){
    super(props)

    this.state = {
      uuid: uuidv4()
    }
  }

  render(){
    const fragment = []
    const global = this.props.errors.filter(error => error.origin === 'context').length

    if (global > 0 && this.props.total > 1) {
      fragment.push(
        <Error
          uuid={this.state.uuid}
          key="videos"
          closable={false}
        >
          Hmm.. Something went wrong for <strong>{ global }</strong> videos, { global > 1 ? 'they' : 'it' } seems <strong>unavailable</strong> for some reason
        </Error>
      )
    }

    this.props.errors
      .filter(error => error.origin === 'videos' && !error.closed)
      .map(error => fragment.push(<RowError uuid={error.uuid} key={error.uuid} />))

    return fragment
  }
}

export default connect(
    mapStateToProps
)(GroupError)
