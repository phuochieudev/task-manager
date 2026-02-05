import { MongoClient, ServerApiVersion } from 'mongodb'
import { env } from '~/config/environment'
//Khơỉ tạo một đối tượng treloDatabaseInstance ban đầu là null (Vì chúng ta chưa connect)
let treloDatabseInstance = null

//Khởi tạo một đối tượng mongoClientInstance để connect tới MongoDB
const mongoClientInstance = new MongoClient(env.MONGODB_URI, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true
  }
})

export const CONNECT_DB = async () => {
  await mongoClientInstance.connect()
  treloDatabseInstance = mongoClientInstance.db(env.DATABASE_NAME)
}

export const CLOSE_DB = async () => {
  await mongoClientInstance.close()
}

export const GET_DB = () => {
  if (!treloDatabseInstance) throw new Error('Must connect to Database first')
  return treloDatabseInstance
}

