import React, { Component } from 'react'
import { connect } from 'react-redux'
import VirtualList from 'react-virtual-list'
import { css, StyleSheet } from 'aphrodite/no-important'
import FilledVideo from 'containers/FilledVideo'

const styles = StyleSheet.create({
  container: {
    width: '100%'
  }
})

const mapStateToProps = (state) => ({
  items: Object.keys(state.videos)
})

class List extends Component {
  render(){
    const filleds = this.props.items.map(id => (
      <FilledVideo id={id} key={id} />
    ))

    const FilledList = VirtualList({
      itemBuffer: 10
    })(({virtual, itemHeight}) => (
      <div style={{...virtual.style, boxSizing: 'border-box'}}>
        {virtual.items}
      </div>
    ))

    return (
      <div className={[css(styles.container), this.props.className].join(' ')}>
        <FilledList items={filleds} itemHeight={window.innerWidth > 810 ? 230:780} />
      </div>
    )
  }
}

export default connect(
  mapStateToProps
)(List)
