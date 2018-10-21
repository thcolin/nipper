import React, { PureComponent } from 'react'
import { connect } from 'react-redux'
import { filter } from 'rxjs/operators'
import database from 'store/database'
import { insertSelection, removeSelection } from 'store/ducks/selection'
import { doDownloads, abortDownloads } from 'store/ducks/downloader'
import Track from 'components/Track'

class Wrapper extends PureComponent {
  constructor (props) {
    super(props)

    this.state = {
      doc: null,
      raw: {}
    }

    this.subs = []
    this.handleChange = this.handleChange.bind(this)
  }

  async componentDidMount () {
    const instance = await database.get()

    const sub = instance.tracks
      .findOne()
      .where('uri')
      .eq(this.props.uri)
      .$.pipe(
        filter(doc => doc)
      ).subscribe(doc => {
        if (!this.state.doc) {
          this.setState({ doc })
        }

        this.setState({ raw: doc.toJSON() })
      })

    this.subs.push(sub)
  }

  componentWillUnmount () {
    this.subs.forEach(sub => sub.unsubscribe())
  }

  handleChange (key, value) {
    this.state.doc.atomicSet(key, value)
  }

  render () {
    return !this.state.doc ? (
      <Track
        placeholder
      />
    ) : (
      <Track
        {...this.props}
        {...this.state.raw}
        onDownload={format => this.props.onDownload(format)}
        onChange={this.handleChange}
      />
    )
  }
}

export default connect(
  (state, props) => ({
    selected: state.selection.includes(props.uri),
    progress: (state.downloader.zip || {})[props.uri] || state.downloader.default[props.uri],
    disabled: {
      selection: !!Object.keys(state.downloader.zip || {}).length || typeof state.downloader.default[props.uri] !== 'undefined',
      download: Object.keys(state.downloader.zip || {}).includes(props.uri)
    }
  }),
  (dispatch, props) => ({
    onSelect: (to) => dispatch(to ? insertSelection(props.uri) : removeSelection(props.uri)),
    onDownload: (format) => dispatch(doDownloads(props.uri, format)),
    onAbort: () => dispatch(abortDownloads(props.uri))
  })
)(Wrapper)
