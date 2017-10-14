import React, { Component } from 'react'
import { connect } from 'react-redux'
import Error from 'components/Shared/Error'
import uuidv4 from 'uuid/v4'

const mapStateToProps = (state) => ({
  length: state.errors.result.length
})

class GroupError extends Component{
  constructor(props){
    super(props)

    this.state = {
      uuid: uuidv4()
    }
  }

  render(){
    return (this.props.length > 0 ?
      <Error
        uuid={this.state.uuid}
        closable={false}
      >
        Hmm.. Something went wrong for <strong>{this.props.length}</strong> videos, {this.props.length > 1 ? 'they' : 'it'} seems <strong>unavailable</strong> for some reason
      </Error> :
      <span></span>
    )
  }
}

export default connect(
    mapStateToProps,
    () => ({})
)(GroupError)
