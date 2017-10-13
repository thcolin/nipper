import { connect } from 'react-redux'
import { configureContext } from 'ducks/context'
import Select from 'components/Shared/Select'

const mapStateToProps = (state) => ({
  icon: state.context.downloading ? 'fa-circle-o-notch fa-spin fa-fw' : null,
  selected: state.context.format,
  active: state.context.downloading,
  disabled: state.videos.result.filter(uuid => state.videos.entities[uuid].selected).length === 0,
  options: {
    mp3: {
      icon: 'fa-volume-up',
      label: 'audio - mp3'
    },
    aac: {
      icon: 'fa-volume-up',
      label: 'audio - aac'
    },
    vorbis: {
      icon: 'fa-volume-up',
      label: 'audio - vorbis'
    },
    opus: {
      icon: 'fa-volume-up',
      label: 'audio - opus'
    },
    mp4: {
      icon: 'fa-film',
      label: 'video - mp4'
    },
    webm: {
      icon: 'fa-film',
      label: 'video - webm'
    }
  }
})

const mapDispatchToProps = (dispatch) => ({
  onChange: (format) => {
    dispatch(configureContext(format))
  }
})

const SelectFormat = connect(
  mapStateToProps,
  mapDispatchToProps
)(Select)

export default SelectFormat
