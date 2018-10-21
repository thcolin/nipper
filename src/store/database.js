import RxDB from 'rxdb'

RxDB.plugin(require('pouchdb-adapter-idb'))

const DATABASE = {
  name: 'nipper',
  adapter: 'idb',
  multiInstance: false
}

const SCHEMAS = {
  tracks: {
    title: 'track',
    version: 0,
    description: 'Describe a Nipper track (from services like YouTube)',
    type: 'object',
    required: ['uri', 'service', 'kind', 'id'],
    attachments: {},
    properties: {
      uri: {
        type: 'string',
        primary: true
      },
      service: {
        type: 'string'
      },
      kind: {
        type: 'string'
      },
      id: {
        type: 'string'
      },
      title: {
        type: 'string'
      },
      author: {
        type: 'string'
      },
      link: {
        type: 'string'
      },
      channel: {
        type: 'string'
      },
      description: {
        type: 'string'
      },
      thumbnail: {
        type: 'string'
      },
      duration: {
        type: 'string'
      },
      artist: {
        type: 'string'
      },
      song: {
        type: 'string'
      }
    }
  }
}

const bootstrap = async () => {
  const database = await RxDB.create(DATABASE)
  await Promise.all(Object.keys(SCHEMAS).map(name => database.collection({ name, schema: SCHEMAS[name] })))
  // Object.keys(SCHEMAS).map(name => database[name].sync({ remote: `http://localhost:5984/${name}/` }))
  return database
}

let instance = null

export default {
  get: () => {
    if (!instance) {
      instance = bootstrap()
    }

    return instance
  }
}
