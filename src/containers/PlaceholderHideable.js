import React, { Component } from 'react'
import { connect } from 'react-redux'
import Placeholder from 'components/App/Web/Content/Placeholder'

const mapStateToProps = (state) => ({
  hide: !!state.videos.result.length,
  mood: state.context.total === (state.videos.result.length + state.errors.result.length) ? 'sad' : 'happy'
})

class PlaceholderHideable extends Component{
  render(){
    return (!this.props.hide ?
      <Placeholder
        className={this.props.className}
        mood={this.props.mood}
        title={this.props.mood === 'happy' ? 'Hmm, working on your request' : 'Oops, no videos was found'}
        message={this.props.mood === 'happy' ?
          `You will be able to annotate metadata of each video before downloading them,
          separately or as a bundle, simply by selecting the ones you want` :
          `Something went wrong, the service didn\'t find any video available from your request,
          playlist may be empty or the video may have restrictions`
        }
      /> : null
    )
  }
}

export default connect(
    mapStateToProps
)(PlaceholderHideable)
