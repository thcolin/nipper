import React, { Component } from 'react'
import { connect } from 'react-redux'
import 'react-virtualized/styles.css'
import WindowScroller from 'react-virtualized/dist/commonjs/WindowScroller'
import AutoSizer from 'react-virtualized/dist/commonjs/AutoSizer'
import List from 'react-virtualized/dist/commonjs/List'
import { css, StyleSheet } from 'aphrodite/no-important'
import Placeholder from 'components/Shared/Placeholder'
import VideoFilled from 'containers/VideoFilled'

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
    this.state = {
      placeholder: <Placeholder />,
      rows: []
    }
  }

  componentWillReceiveProps(props){
    if(!props.items.length){
      this.state.rows = []
      return
    }

    props.items
      .filter(id => !~this.state.rows.map(e => e.props.id).indexOf(id))
      .map(id => this.setState({
        rows: this.state.rows.concat(<VideoFilled id={id} />)
      }))
  }

  render(){
    return (
      <div className={[css(styles.container), this.props.className].join(' ')}>
        <WindowScroller>
          {({ height, isScrolling, scrollTop }) => (
            <AutoSizer disableHeight>
              {({ width }) => (
                <List
                  autoHeight
                  height={height}
                  isScrolling={isScrolling}
                  overscanRowCount={5}
                  rowCount={this.props.total}
                  rowHeight={220}
                  rowRenderer={({index, style}) => (
                    <div key={index} style={style}>
                      {
                        this.state.rows[index] || this.state.placeholder
                      }
                    </div>
                  )}
                  scrollTop={scrollTop}
                  width={width}
                />
              )}
            </AutoSizer>
          )}
        </WindowScroller>
      </div>
    )
  }
}

export default connect(
  mapStateToProps
)(ListVideo)
