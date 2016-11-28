import server from '../server'
import chai from 'chai'
import chaiHttp from 'chai-http'
import {User} from '../schema'

let should = chai.should()
let URL = 'http://localhost:3000'

chai.use(chaiHttp)

describe('Users', () => {
    beforeEach((done) => {
        User.remove({}, (err) => { //empty database
            done()
        })
    })

    describe('/GET data', () => {
        it('it should GET all datas', (done) => {
            chai.request(URL)
                .get('/')
                .end((err, res) => {
                    res.should.have.status(200)
                    res.body.should.be.a('object')
                    res.body.should.have.property('data')
                    res.body.data.should.have.property('users')
                    res.body.data.users.should.be.a('array')
                    done()
                })
        })
    })

    describe('/POST data', () => {
        it('it should POST a data ', (done) => {
            let data = {
                "name": "ken",
                "age": 22,
            }
            chai.request(URL)
                .post('/')
                .send(data)
                .end((err, res) => {
                    console.log(res.body.result)
                    res.should.have.status(200)
                    res.body.should.be.a('object')
                    res.body.should.have.property('message').eql('data is added')
                    done()
                })
        })
    })

    describe('/PUT/:id data', () => {
        it('it should UPDATE a data given the id', (done) => {
            let data = new User({ "name": "ken", "age": 22})
            data.save((err, data) => {
                chai.request(URL)
                    .put('/' + data.id)
                    .send({ name: "kena", "age": 220 })
                    .end((err, res) => {
                        res.should.have.status(200)
                        res.body.should.be.a('object')
                        res.body.should.have.property('message').eql('data is edited')
                        done()
                    })
            })
        })
    })

    describe('/DELETE/:id data', () => {
        it('it should DELETE a data given the id', (done) => {
            let data = new User({ "name": "ken", "age": 22})
            data.save((err, data) => {
                chai.request(URL)
                    .delete('/' + data.id)
                    .end((err, res) => {
                        res.should.have.status(200)
                        res.body.should.be.a('object')
                        res.body.should.have.property('message').eql('data is deleted')
                        done()
                    })
            })
        })
    })

})