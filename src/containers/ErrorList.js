import React, { Component } from 'react'
import { connect } from 'react-redux'
import { css, StyleSheet } from 'aphrodite/no-important'
import FilledError from 'containers/FilledError'

const styles = StyleSheet.create({
  container: {
    width: '100%',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center'
  }
})

const mapStateToProps = (state) => ({
  items: Object.keys(state.errors).filter(id => !state.errors[id].closed)
})

class List extends Component {
  render(){
    const {items, itemProps, ...props} = this.props

    const itemRows = this.props.items.map(id => (
      <FilledError id={id} key={id} />
    ))

    return (
      <div className={[css(styles.container), props.className].join(' ')}>
        {itemRows}
      </div>
    )
  }
}

export default connect(
  mapStateToProps
)(List)
