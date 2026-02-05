/* eslint-disable no-console */
import express from 'express'
import cors from 'cors'
import { corsOptions } from '~/config/cors'
import exitHook from 'async-exit-hook'
import { CONNECT_DB, CLOSE_DB } from '~/config/mongodb'
import { env } from '~/config/environment'
import { APIs_V1 } from '~/routes/v1'
import { errorHandlingMiddleware } from '~/middlewares/errorHandlingMiddleware'

const START_SERVER = () => {
  const app = express()

  //Xu ly CORS
  app.use(cors(corsOptions))

  //Enable req.body json data
  app.use(express.json())

  //Use API v1
  app.use('/v1', APIs_V1)

  //Middleware xu ly loi tap trung
  app.use(errorHandlingMiddleware)

  app.listen(env.APP_PORT, env.APP_HOST, () => {
    // eslint-disable-next-line no-console
    console.log(`Hello ${env.AUTHOR}, Back-end Server is running successfully at Host: ${ env.APP_HOST } and Port ${ env.APP_PORT }`)
  })
  //Thực hiện các tác vụ cleanup trước khi dừng server
  exitHook( () => {
    CLOSE_DB()
    console.log('Disconnected from MongoDB Cloud Atlas')
  })
}

(async () => {
  try {
    await CONNECT_DB()
    console.log('Connected to MongoDB Cloud Atlas')
    START_SERVER()
  } catch (error) {
    console.error(error)
    process.exit(0)
  }
})()

// CONNECT_DB()
//   .then(() => console.log('Connected to MongoDB Cloud Atlas'))
//   .then(() => START_SERVER())
//   .catch(error => {
//     console.error(error)
//     process.exit(0)
//   })