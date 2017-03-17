import React, { Component } from 'react'
import { connect } from 'react-redux'
import SelectionToggle from 'containers/SelectionToggle'
import LoadingButton from 'containers/LoadingButton'

const mapStateToProps = (state) => {
  return {
    completed: (state.videos.length === state.analyze.total)
  }
}

class StatusComponent extends Component{
  render(){
    return (
      <div>
        {this.props.completed ?
          <SelectionToggle className={this.props.className} />
          :
          <LoadingButton
            appearance="light"
            icon="fa-circle-o-notch fa-spin fa-fw"
            className={this.props.className}
          />
        }
      </div>
    )
  }
}

export default connect(
    mapStateToProps
)(StatusComponent)
