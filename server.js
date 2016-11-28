import 'babel-polyfill'
import express from 'express'
import {graphql} from 'graphql'
import GraphQLHTTP from 'express-graphql'
import {schema} from './schema'
import bodyParser from 'body-parser'

const app = express()

app.use(bodyParser.urlencoded({ extended: true }))

app.get('/', (req, res) => {
	let query = '{users {id name age}}' //or query{users {name age}}
	graphql(schema,query).then(result => {
		res.json(result)
	})
})

app.post('/', (req, res) => {
	let name = req.body.name
	let age = req.body.age

	let query = `mutation{add(name: "${name}", age:${age}){id name age}}`
	graphql(schema,query).then(result => {
		res.json({"message" : "data is added" ,result})
	})
})

app.delete('/:id', (req, res) => {
	let id = req.params.id

	let query = `mutation{delete(id:"${id}"){id name age}}`
	graphql(schema,query).then(result => {
		res.json({"message":"data is deleted" ,result})
	})
})

app.put('/:id', (req, res) => {
	let id = req.params.id
	let name = req.body.name
	let age = req.body.age

	let query = `mutation{edit(id:"${id}", name:"${name}", age:${age}){id name age}}`
	graphql(schema,query).then(result => {
		res.json({"message":"data is edited" ,result})
	})
})

app.use('/graphql', GraphQLHTTP({
  schema: schema,
  pretty: true,
  graphiql: true
}))

app.listen(3000, (err)=> {
  if (err) {
    console.log(err);
  } else {
    console.log('Server UP');
  }
})

export default app