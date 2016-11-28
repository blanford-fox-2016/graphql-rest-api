const mocha = require('mocha')
const chai = require('chai')
const expect = chai.expect
const chaiHttp = require('chai-http')
const URL = 'http://localhost:3000'
chai.use(chaiHttp)

describe("Test CRUD", () => {
    describe("Test if get all users working", function () {

        it("Expect to return all list of users", function (done) {
            chai.request(URL)
                .get('/api/users')
                .end(function (err, res) {
                    expect(res.body).that.is.an('Object')
                    expect(res).to.have.status(200)
                    done()
                })
        })
    })

    describe("Test if create user working", function () {
        it("Expect to return user that has been created", function (done) {
            chai.request(URL)
                .post('/api/users')
                .send({
                    name: 'name a',
                    age: 123
                })
                .end(function (err, res) {
                    console.log(res.body)
                    expect(res).to.have.status(200)
                    expect(res.body.data.add.name).to.equal('name a')
                    expect(res.body.data.add.age).to.equal(123)
                    done()
                })
        })
    })

    describe("Test if update user working", function () {

        it("Expect to return user that has been updated", function (done) {


            chai.request(URL)
                .get('/api/users')
                .end(function (err, res) {
                    chai.request(URL)
                        .put('/api/users')
                        .send({
                            id: res.body.data.users[2].id,
                            name: 'lala',
                            age: 111
                        })
                        .end(function (err, res) {
                            console.log(res.body)
                            expect(res).to.have.status(200)
                            expect(res.body.data.update.name).to.equal('lala')
                            expect(res.body.data.update.age).to.equal(111)
                            done()
                        })
                })
        })
    })

    describe("Test if delete user working", function () {

        it("Expect to return true if delete user working", function (done) {

            chai.request(URL)
                .get('/api/users')
                .end(function (err, res) {
                    chai.request(URL)
                        .delete('/api/users')
                        .send({
                            id: res.body.data.users[2].id,
                        })
                        .end(function (err, res) {
                            console.log(res.body)
                            expect(res).to.have.status(200)
                            expect(res.body.data.delete.name).to.equal('lala')
                            expect(res.body.data.delete.age).to.equal(111)
                            done()
                        })
                })
            })
        })
})

