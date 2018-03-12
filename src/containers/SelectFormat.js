import { connect } from 'react-redux'
import { configureContext } from 'ducks/context'
import { faCircleNotch, faVolumeUp, faFilm } from '@fortawesome/fontawesome-free-solid'
import Select from 'components/Select'

const mapStateToProps = (state) => ({
  icon: state.context.downloading ? Object.assign({}, faCircleNotch, {
    features: {
      spin: true
    }
  }) : null,
  selected: state.context.format,
  active: state.context.downloading,
  disabled: state.videos.result.filter(uuid => state.videos.entities[uuid].selected).length === 0,
  options: {
    mp3: {
      icon: faVolumeUp,
      label: 'audio - mp3'
    },
    aac: {
      icon: faVolumeUp,
      label: 'audio - aac'
    },
    vorbis: {
      icon: faVolumeUp,
      label: 'audio - vorbis'
    },
    opus: {
      icon: faVolumeUp,
      label: 'audio - opus'
    },
    mp4: {
      icon: faFilm,
      label: 'video - mp4'
    },
    webm: {
      icon: faFilm,
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
