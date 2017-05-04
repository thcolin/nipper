import React, { Component } from 'react'
import { connect } from 'react-redux'
import Illustration from 'components/App/Content/Illustration'

const mapStateToProps = (state) => ({
    show: state.videos.length === 0
})

class EmptyPlaceholder extends Component{
  render(){
    return (
      <div>
        { this.props.show ?
          <Illustration /> : ''
        }
      </div>
    )
  }
}

export default connect(
    mapStateToProps
)(EmptyPlaceholder)
