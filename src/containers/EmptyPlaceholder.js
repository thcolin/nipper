import React, { Component } from 'react'
import { connect } from 'react-redux'
import Placeholder from 'components/App/Content/Placeholder'

const mapStateToProps = (state) => ({
    show: state.videos.length === 0
})

class EmptyPlaceholder extends Component{
  render(){
    return (
      <div>
        { this.props.show ?
          <Placeholder />:''
        }
      </div>
    )
  }
}

export default connect(
    mapStateToProps
)(EmptyPlaceholder)
