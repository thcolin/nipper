import React, { Component } from 'react'
import { connect } from 'react-redux'
import { css, StyleSheet } from 'aphrodite/no-important'
import RowError from 'containers/RowError'

const styles = StyleSheet.create({
  container: {
    width: '100%',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center'
  }
})

const mapStateToProps = (state) => ({
  items: state.errors.result.filter(uuid => !state.errors.entities[uuid].closed)
})

class ErrorList extends Component {
  render(){
    const {items, itemProps, ...props} = this.props

    const itemRows = this.props.items.map(uuid => (
      <RowError uuid={uuid} key={uuid} />
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
)(ErrorList)
