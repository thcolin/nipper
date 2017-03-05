import React, { Component } from 'react'
import { css } from 'aphrodite'
import Landing from 'components/App/Landing'
import Toolbar from 'components/App/Toolbar'
import Container from 'components/App/Container'
import Video from 'components/App/Video'
import styles from './styles'

class App extends Component{
  constructor(props){
    super(props)
    this.state = {
      analyzed: false,
      errors: [],
      videos: [],
      showMore: false,
      showLoading: false,
      downloading: false,
      toggled: false
    }

    this.handleAnalyze = this.handleAnalyze.bind(this)
    this.handleToggle = this.handleToggle.bind(this)
    this.handleDownloadVideo = this.handleDownloadVideo.bind(this)
    this.handleDownloadSelection = this.handleDownloadSelection.bind(this)
  }

  handleAnalyze(type, id){
    this.setState({analyzed: true})

    var props = {
      onDownload: this.handleDownloadVideo
    }

    var videos = [
      React.createElement(Video, Object.assign({key: 1}, props)),
      React.createElement(Video, Object.assign({key: 2}, props))
    ];

    this.setState({videos: videos})
  }

  handleToggle(toggled){
    this.setState({toggled: toggled})
    console.log('toggle', toggled)
  }

  handleDownloadVideo(){
    this.setState({downloading: true})
    console.log('download video')
  }

  handleDownloadSelection(){
    this.setState({downloading: true})
    console.log('download selection')
  }

  render(){
    return(
      <div className={css(styles.global)}>
        <Landing onAnalyze={this.handleAnalyze} />
        {true &&
          <div>
            <Toolbar
              empty={!this.state.videos.map((video) => video.selected).length}
              toggled={this.state.toggled}
              onToggle={this.handleToggle}
              downloading={this.state.downloading}
              onDownload={this.handleDownloadSelection}
            />
            <Container
              errors={this.state.errors}
              videos={this.state.videos}
              showMore={this.state.showMore}
              showLoading={this.state.showLoading}
            />
          </div>
        }
      </div>
    )
  }
}

export default App
