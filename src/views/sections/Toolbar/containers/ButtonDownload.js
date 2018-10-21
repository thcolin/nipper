import { connect } from 'react-redux'
import Button from 'components/atoms/Button'
import shajs from 'sha.js'
import { doDownloads, abortDownloads } from 'store/ducks/downloader'

export default connect(
  (state) => {
    const selection = state.selection
    const playlist = state.library[(Object.values(state.digger).pop() || {}).uri] || {}
    const hash = shajs('sha256').update(selection.join('')).digest('hex').substring(0, 7)
    const progress = Object.values(state.downloader.zip || {})
      .reduce((total, download, index, downloads) => total += (download / downloads.length), null) // eslint-disable-line no-return-assign

    const crumbs = {
      selection,
      format: state.preferences.format,
      filename: `Nipper - ${playlist.title} (${playlist.author}) - ${hash}.zip`
    }

    if (selection.length === 0) {
      return {
        title: 'First, select some videos',
        appearance: progress === null ? 'light' : 'plain',
        disabled: true,
        progress,
        crumbs
      }
    } else {
      return {
        title: `Download (${selection.length})`,
        appearance: progress === null ? 'light' : 'plain',
        progress,
        crumbs
      }
    }
  },
  null,
  ({ crumbs, ...state }, { dispatch }, props) => ({
    ...props,
    ...state,
    onClick: () => dispatch(state.progress === null
      ? doDownloads(crumbs.selection, crumbs.format, { zip: crumbs.filename }, 'zip')
      : abortDownloads(crumbs.selection, 'zip')
    )
  })
)(Button)
