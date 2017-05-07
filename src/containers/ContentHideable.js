import React, { Component } from 'react'
import { connect } from 'react-redux'

const mapStateToProps = (state) => ({
  hide: (state.context.total === null)
})

class ContentHideable extends Component{
  render(){
    return (
      <div>
        {this.props.hide ?
          '':this.props.children
        }
      </div>
    )
  }
}

export default connect(
    mapStateToProps
)(ContentHideable)
