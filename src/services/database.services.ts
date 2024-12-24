import { MongoClient, ServerApiVersion } from 'mongodb'
import { config } from 'dotenv'

config()

const uri = `mongodb+srv://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@twitter.vpjqx.mongodb.net/?retryWrites=true&w=majority&appName=Twitter`

class DatabaseServices {
  private client: MongoClient

  constructor() {
    this.client = new MongoClient(uri, {
      serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true
      }
    })
  }

  async connect(): Promise<void> {
    try {
      await this.client.connect()
      await this.client.db('admin').command({ ping: 1 })
      console.log('Pinged your deployment. You successfully connected to MongoDB!')
    } catch (error) {
      console.error('Failed to connect to MongoDB', error)
      throw error
    }
  }

  async close(): Promise<void> {
    try {
      await this.client.close()
    } catch (error) {
      console.error('Failed to close MongoDB connection', error)
      throw error
    }
  }
}

const databaseServices = new DatabaseServices()
export default databaseServices
