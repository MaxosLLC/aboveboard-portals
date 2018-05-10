const MongoClient = require('mongodb').MongoClient
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

const testUser = {
  email: 'local@local.com',
  password: '$2a$12$bzRHsmTkWP5tavHMOl9rMe1QAGm26dERz2EcGCE4EFrsn7cuBfbVa',
  walletHost: 'http://testrpc',
  walletPort: '8547',
  walletAccount: '0x51595ee792a82607071109b61fff7925585c0e4b',
  walletPassword: 'test'
}

MongoClient.connect(MONGO_URI)
  .then(client => {
    const testDb = client.db(MONGO_TEST_DATABASE)

    return testDb.collection('user').insert(testUser)
      .then(() => client.close())
      .catch(() => client.close())
  })
