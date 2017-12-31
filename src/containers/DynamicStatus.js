import React, { Component } from 'react'
import { css, StyleSheet } from 'aphrodite/no-important'
import { connect } from 'react-redux'
import ToggleVideoSelect from 'containers/ToggleVideoSelect'
import ButtonStatus from 'containers/ButtonStatus'
import { faCircleNotch } from '@fortawesome/fontawesome-free-solid'

const styles = StyleSheet.create({
  container:{
    width: '175px'
  }
})

const mapStateToProps = (state) => ({
  completed: state.context.total === null || (state.videos.result.length + state.errors.result.filter(uuid => state.errors.entities[uuid].origin === 'context').length) === state.context.total
})

class DynamicStatus extends Component{
  render(){
    return (
      <div className={css(styles.container)}>
        {this.props.completed ?
          <ToggleVideoSelect className={this.props.className} />
          :
          <ButtonStatus
            appearance="light"
            icon={Object.assign({}, faCircleNotch, {
              features: {
                spin: true
              }
            })}
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
