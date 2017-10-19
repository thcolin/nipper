export default {
  duration: {
    // ex: 00:03:20
    fromDotFormat: (source) => {
      const time = source.split(':')

      return Array(3 - time.length).fill('00').concat(time)
        .map((v, i) => [3600000, 60000, 1000][i] * v)
        .reduce((a, v) => a + v, 0)
    },
    // ex: PT3M20S
    fromISO8601: (source) => {
      const matches = source.match(/P(.*?)T(\d+H)?(\d+M)?(\d+S)/) || []

      const hours = (matches[2] || 'H').slice(0, -1)
      const minutes = (matches[3] || '0M').slice(0, -1)
      const seconds = (matches[4] || '0S').slice(0, -1)

      return [hours, minutes, seconds]
        .filter(value => value !== '')
        .map(value => value < 10 ? '0' + value : value)
        .join(':')
    }
  }
}
