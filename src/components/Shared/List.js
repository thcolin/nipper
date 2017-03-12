import React, { Component, PropTypes } from 'react'
import { css, StyleSheet } from 'aphrodite/no-important'

const propTypes = {
  items: PropTypes.array.isRequired,
  renderItem: PropTypes.func.isRequired,
  itemProps: PropTypes.object
}

const defaultProps = {
  itemProps: {}
}

const styles = StyleSheet.create({
  global: {
    width: '100%',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center'
  },
  item: {
    margin: '10px 0'
  }
})

class List extends Component{
  render(){
    var {items, renderItem, itemProps, ...props} = this.props

    itemProps.className = [css(styles.item), itemProps.className].join(' ')

    return(
      <div {...props} className={[css(styles.global), props.className].join(' ')}>
        {items.map(item =>
          renderItem(item, itemProps)
        )}
      </div>
    )
  }
}

List.propTypes = propTypes
List.defaultProps = defaultProps

export default List
