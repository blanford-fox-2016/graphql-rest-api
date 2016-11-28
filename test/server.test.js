'use strict'
const chai = require('chai')
const chaiHttp = require('chai-http')

const expect = chai.expect
const urlApi = 'http://localhost:3000/api'
chai.use(chaiHttp);



// CRUD ROUTE TEST

describe('create biodata with graphql', function() {
    it('expect to return new created id name and age', function(done) {
        chai.request(urlApi)
            .post(`/biodata`)
            .send({
              name: 'test',
              age: 22
            })
            .end(function(req, res) {
                expect(res.body.data.add.name).to.be.equal('test')
                expect(res.body.data.add.age).to.be.equal(22)
                done()
            })
    })
})


describe('get all biodata', function() {
    it('expect to return all biodata', function(done) {
            chai.request(urlApi)
                .get('/biodata')
                .end(function(err, res) {
                  expect(res.body.data.users[0].name).to.be.equal('test')
                  expect(res.body.data.users[0].age).to.be.equal(22)
                  expect(res.body.data.users.length).to.be.equal(1)
                    done()
                }) // chai
        }) // it
})
//
//
describe('edit biodata', function() {
        it('expect to return new edited biodata', function(done) {
          chai.request(urlApi)
              .get('/biodata')
              .end(function(err, res) {
          chai.request(urlApi)
              .put(`/biodata`)
              .send({
                  id: res.body.data.users[0].id,
                  name: 'newUser',
                  age: 44
              })
              .end(function(err, res) {
                expect(res.body.data.edit.name).to.be.equal('newUser')
                expect(res.body.data.edit.age).to.be.equal(44)
                done()
              })
            })
        })
    })

describe('Route delete all biodata', function() {
    it('expect to return biodata length', function(done) {
      chai.request(urlApi)
          .get('/biodata')
          .end(function(err, res) {
      chai.request(urlApi)
          .delete(`/biodata`)
          .send({
              id: res.body.data.users[0].id
          })
          .end(function(err, res) {
            chai.request(urlApi)
                .get('/biodata')
                .end(function(err, res) {
                  expect(res.body.data.users.length).to.be.equal(0)
                  done()
            })
          })
        })
    })
})
