import mongoose from 'mongoose'
import {
  GraphQLObjectType,
  GraphQLID,
  GraphQLSchema,
  GraphQLNonNull,
  GraphQLList,
  GraphQLString,
  GraphQLInt
} from 'graphql'

let User = mongoose.model('User', {
  id: mongoose.Schema.Types.ObjectId,
  name: String,
  age: Number
})

mongoose.connect('mongodb://localhost:27017/biodatadb', (err) => {
  if(err){
    console.log(err);
  }else{
    console.log(`mongo connected`);
  }
})

let UserType = new GraphQLObjectType({
  name: 'user',
  fields: () => ({
    id: {
      type: GraphQLID,
      description: 'ID User'
    },
    name: {
      type: GraphQLString,
      description: "Name of User"
    },
    age: {
      type: GraphQLInt,
      description: "Age of User"
    }
  })
})

let getAll = () => {
  return new Promise((resolve, reject) => {
    User.find((err, users) =>  {
      if(err){
        reject(err);
      }else{
        resolve(users)
      }
    })
  })
}

let QueryType = new GraphQLObjectType({
  name: 'Query',
  fields: () => ({
    users: {
      type: new GraphQLList(UserType),
      resolve: () => {
        return getAll()
      }
    }
  })
})

let MutationAdd = {
  type: UserType,
  description: "Add a user",
  args: {
    name: {
      name: 'user\'s name',
      type: new GraphQLNonNull(GraphQLString)
    },
    age: {
      age: 'user\'s age',
      type: GraphQLInt
    }
  },
  resolve: (root, args) => {
    let newUser = new User({
      name: args.name,
      age: args.age
    })
    newUser.id = newUser._id
    return new Promise((resolve, reject) => {
      newUser.save((err) => {
        if(err){
          reject(err)
        }else{
          resolve(newUser)
        }
      })
    })
  }
}

let MutationEdit = {
  type: UserType,
  description: "Edit a user",
  args: {
    id: {
      name: 'Id name',
      type: GraphQLID
    },
    name: {
      name: 'Edit user\'s name',
      type: new GraphQLNonNull(GraphQLString)
    },
    age: {
      age: 'Edit user\'s age',
      type: GraphQLInt
    }
  },
  resolve: (root, args) => {
    return new Promise((resolve, reject) => {
      User.findOneAndUpdate({
        id: args.id
      }, {
        name: args.name,
        age: args.age
      }, {
          new: true
      },
      (err, edited_data) => {
        if(err){
          reject(err)
        }else{
          resolve(edited_data)
        }
      })
    })
  }
}

let MutationDelete = {
  type: UserType,
  description: "Delete a user",
  args: {
    id: {
      name: 'Id name',
      type: GraphQLID
    }
  },
  resolve: (root, args) => {
    return new Promise((resolve, reject) => {
      User.findOneAndRemove({
        id: args.id
      },
      (err, deleted_data) => {
        if(err){
          reject(err)
        }else{
          resolve(deleted_data)
        }
      })
    })
  }
}

let MutationType = new GraphQLObjectType({
  name: 'Mutation',
  fields: {
    add: MutationAdd,
    edit: MutationEdit,
    delete: MutationDelete
  }
})

let schema = new GraphQLSchema({
  query: QueryType,
  mutation: MutationType
})

export default schema
/*
mutation{add(name:"ken", age:22) {
  id name age
}}
query{users {
  id name age
}}
*/
