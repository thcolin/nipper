import React, { Component } from 'react'
import { connect } from 'react-redux'
import Illustration from 'components/Illustration'

const mapStateToProps = (state) => ({
  hide: state.videos.result.length > 0,
  mood: (state.context.total === null && state.errors.result.length > 0) ? 'sad' : 'happy'
})

const mapDispatchToProps = (dispatch) => ({
  onHelpClick: () => {
    console.log('HELP !')
  }
})

const styles = {
  link: {
    cursor: 'pointer'
  }
}

class IllustrationHideable extends Component{
  render(){
    return (!this.props.hide ?
      <Illustration
        className={this.props.className}
        mood={this.props.mood}
        title={this.props.mood === 'happy' ? 'Hmm, working on your request' : 'Oops, no videos was found'}
        message={this.props.mood === 'happy' ?
          <span>
            <span>You will be able to annotate metadata for each video before downloading them,</span>
            <br/>
            <span>separately or as an archive, simply by selecting the ones you want</span>
          </span> :
          <span>
            <span>Something went wrong, the service didn't find any video available from provided URL,</span>
            <br/>
            <span>playlist may be empty or the video may have restrictions</span>
            <br/>
            <br/>
            <small>
              <i>
                <a style={styles.link} onClick={this.props.onHelpClick}>See help for more informations about supported links and known issues</a>
              </i>
            </small>
          </span>
        }
      /> : null
    )
  }
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(IllustrationHideable)
