const MongoClient = require('mongodb').MongoClient
const { each } = require('bluebird')
const { NODE_ENV, MONGO_URI, MONGO_TEST_DATABASE } = process.env

if (NODE_ENV === 'production') {
  throw new Error('Test cleanup script should not be run in production')
}

if (!MONGO_URI) {
  throw new Error('MONGO_URI not defined')
}

if (!/test/.test(MONGO_TEST_DATABASE)) {
  throw new Error('MONGO_DATABASE should be set to a test db')
}

const collections = [
  'investor',
  'localToken',
  'shareholder',
  'user',
  'transaction'
]

MongoClient.connect(MONGO_URI)
  .then(client => {
    const testDb = client.db(MONGO_TEST_DATABASE)

    return each(collections, collection => testDb.collection(collection).drop().catch(e => void e))
      .then(() => client.close())
      .catch(() => client.close())
  })
