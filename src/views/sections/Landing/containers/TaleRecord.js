import { connect } from 'react-redux'
import { doDig, clearDigger } from 'store/ducks/digger'
import { clearToaster } from 'store/ducks/toaster'
import { clearSelection } from 'store/ducks/selection'
import Tale from 'components/Tale'

const mapStateToProps = (state, props) => ({
  link: state.library[props.uri].link,
  thumbnail: state.library[props.uri].thumbnail,
  title: state.library[props.uri].title,
  author: state.library[props.uri].author
})

const mapDispatchToProps = (dispatch, props) => ({
  onClick: () => {
    dispatch(clearDigger())
    dispatch(clearToaster())
    dispatch(clearSelection())
    dispatch(doDig(props.uri))
  }
})

export default connect(mapStateToProps, mapDispatchToProps)(Tale)
