import React, { Component } from 'react'
import { connect } from 'react-redux'
import SelectionToggle from 'containers/SelectionToggle'
import LoadingButton from 'containers/LoadingButton'

const mapStateToProps = (state) => {
  return {
    hide: (state.analyze.total === null)
  }
}

class EmptyHideable extends Component{
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
)(EmptyHideable)
