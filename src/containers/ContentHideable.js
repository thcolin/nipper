import React, { Component } from 'react'
import { css, StyleSheet } from 'aphrodite'
import { connect } from 'react-redux'

const styles = StyleSheet.create({
  hidden:{
    display: 'none'
  }
})

const mapStateToProps = (state) => ({
  hide: (state.context.total === null)
})

class ContentHideable extends Component{
  render(){
    return (
      <div className={[this.props.className, this.props.hide && css(styles.hidden)].join(' ')}>
        {
          this.props.hide || this.props.children
        }
      </div>
    )
  }
}

export default connect(
  mapStateToProps
)(ContentHideable)
