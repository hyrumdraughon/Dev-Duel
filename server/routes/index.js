import { Router } from 'express'
import axios from 'axios'
import validate from 'express-validation'
import token from '../../token'

import validation from './validation'
import getUserData from './getUserData'

export default () => {
  let router = Router()

  /** GET /health-check - Check service health */
  router.get('/health-check', (req, res) => res.send('OK'))

  // The following is an example request.response using axios and the
  // express res.json() function
  /** GET /api/rate_limit - Get github rate limit for your token */
  router.get('/rate', (req, res) => {
    axios.get(`http://api.github.com/rate_limit`, {
      headers: {
        'Authorization': token
      }
    }).then(({ data }) => res.json(data))
  })

  /** GET /api/user/:username - Get user */
  router.get('/user/:username', validate(validation.user), async (req, res) => {
    /*
      TODO
      Fetch data for user specified in path variable
      parse/map data to appropriate structure and return as JSON object
    */
    const username = req.params.username

    try {
      res.json(await getUserData(username))
    } catch (err) {
      res.send(err.message)
    }

  })

  /** GET /api/users? - Get users */
  router.get('/users/', validate(validation.users), async (req, res) => {
    /*
      TODO
      Fetch data for users specified in query
      parse/map data to appropriate structure and return as a JSON array
    */
    //console.log(req.query)
    const username1 = req.query.username[0]
    const username2 = req.query.username[1]

    try {
      let userDataArray = []
      userDataArray[0] = await getUserData(username1)
      userDataArray[1] = await getUserData(username2)
      res.json(userDataArray)
    } catch (err) {
      res.send(err.message)
    }

  })

  return router
}
