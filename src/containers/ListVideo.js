import React, { Component } from 'react'
import { connect } from 'react-redux'
import { css, StyleSheet } from 'aphrodite/no-important'
import Placeholder from 'components/Shared/Placeholder'
import RowVideo from 'containers/RowVideo'

const styles = StyleSheet.create({
  container: {
    width: '100%'
  }
})

const mapStateToProps = (state) => ({
  items: state.videos.result,
  total: state.videos.result.length ? (state.context.total - state.errors.result.filter(id => state.errors.entities[id].origin === 'context').length) : 0
})

class ListVideo extends Component {
  constructor(props){
    super(props)
  }

  render(){
    const rows = []

    for(var i = 0; i < this.props.total; i++){
      rows.push(this.props.items[i] ? <RowVideo id={this.props.items[i]} key={this.props.items[i]} /> : <Placeholder key={i} />)
    }

    return (
      <div className={[css(styles.container), this.props.className].join(' ')}>
        { rows }
      </div>
    )
  }
}

export default connect(
  mapStateToProps
)(ListVideo)
