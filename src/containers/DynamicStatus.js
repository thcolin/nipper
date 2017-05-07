import React, { Component } from 'react'
import { connect } from 'react-redux'
import ToggleVideoSelect from 'containers/ToggleVideoSelect'
import ButtonStatus from 'containers/ButtonStatus'

const mapStateToProps = (state) => ({
  completed: ((Object.keys(state.videos).length + Object.keys(state.errors).length) === state.context.total)
})

class DynamicStatus extends Component{
  render(){
    return (
      <div>
        {this.props.completed ?
          <ToggleVideoSelect className={this.props.className} />
          :
          <ButtonStatus
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
)(DynamicStatus)
