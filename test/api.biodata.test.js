const chai = require('chai')
const expect = chai.expect
const chaiHTTP = require('chai-http')
chai.use(chaiHTTP)
const should = chai.should()

const URL = 'http://localhost:3000/'

describe('Add new biodata', () => {
  it('it should add new biodata', (done) => {
    chai.request(URL)
      .post('api/biodata')
      .send({
        "name" : "testing",
        "age" : 100
      })
      .end((err, res) => {
        res.should.be.json
        res.should.have.status(200)
        // console.log(res.body);
        res.body.data.add.name.should.equal("testing")
        res.body.data.add.age.should.equal(100)
        done()
      })
  })
})

describe('Update a biodata', () => {
  let index = 0
  it('it should update a specific memo', (done) => {
    chai.request(URL)
      .get('api/biodata')
      .end((err, res) => {
        chai.request(URL)
          .put('api/biodata')
          .send({
            "name": "test edit from testing",
            "age" : 500,
            "id"  : res.body.data.users[index].id
          })
          .end((err, respond) => {
            // console.log(respond.body);
            respond.should.have.status(200);
            respond.should.be.json;
            respond.body.data.edit.name.should.equal("test edit from testing")
            respond.body.data.edit.age.should.equal(500)
            done()
          })
      })
  })
})

describe('Get all biodata', () => {
  it('it should return all list of biodata in databases', (done) => {
    chai.request(URL)
      .get('api/biodata')
      .end((err, res) => {
        expect(res.body).to.be.an('object');
        res.body.data.users[0].name.should.equal("test edit from testing")
        res.body.data.users[0].age.should.equal(500)
        res.should.be.json
        res.should.have.status(200)
        done()
      })
  })
})

describe('Delete all biodata', () => {
  let index = 0
  it('it should delete all biodata from database', (done) => {
    chai.request(URL)
      .get('api/biodata')
      .end((err, res) => {
        chai.request(URL)
          .delete('api/biodata')
          .send({
            id: res.body.data.users[index].id
          })
          .end((err, del_res) => {
            del_res.should.have.status(200);
            del_res.should.be.json;
            del_res.body.data.delete.name.should.equal(res.body.data.users[index].name)
            del_res.body.data.delete.age.should.equal(res.body.data.users[index].age)
            done()
          })
      })
  })
})
