import xhook from 'xhook'

xhook.before(request => {
  if (request.url.match(/youtu\.?be(\.com)?|ytimg\.com|googlevideo\.com/)) {
    request.url = '/proxify?url=' + btoa(request.url)
  }
})
