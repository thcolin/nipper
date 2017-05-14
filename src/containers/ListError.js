import React, { Component } from 'react'
import { connect } from 'react-redux'
import { css, StyleSheet } from 'aphrodite/no-important'
import ErrorFilled from 'containers/ErrorFilled'

const styles = StyleSheet.create({
  container: {
    width: '100%',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center'
  }
})

const mapStateToProps = (state) => ({
  items: state.errors.result.filter(id => !state.errors.entities[id].closed)
})

class ErrorList extends Component {
  render(){
    const {items, itemProps, ...props} = this.props

    const itemRows = this.props.items.map(id => (
      <ErrorFilled id={id} key={id} />
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
