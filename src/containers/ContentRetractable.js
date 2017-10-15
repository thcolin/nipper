import React, { Component } from 'react'
import { css, StyleSheet } from 'aphrodite'
import { connect } from 'react-redux'

const styles = StyleSheet.create({
  container:{
    height: '100%',
    overflowY: 'hidden'
  },
  ground: {
    height: '500px',
    transition: 'height 500ms',
    '@media (max-width: 810px)': {
      height: '100vh'
    }
  },
  full: {
    height: '100vh'
  }
})

const mapStateToProps = (state) => ({
  retracted: (state.context.total === null),
  empty: (state.errors.result.length + state.videos.result.length === 0)
})

class ContentRetractable extends Component{
  render(){
    // warning: only 2 childrens required (specification impossible with prop-types)
    const ground = this.props.children[0]
    const basement = this.props.children[1]

    return (
      <div className={[this.props.className, this.props.retracted && css(styles.container)].join(' ')}>
        { React.cloneElement(ground, { className: [ground.props.className, css(styles.ground, this.props.retracted && styles.full)].join(' ') }) }
        { React.cloneElement(basement, { className: [basement.props.className, css(this.props.empty && styles.full)].join(' ') }) }
      </div>
    )
  }
}

export default connect(
  mapStateToProps
)(ContentRetractable)
