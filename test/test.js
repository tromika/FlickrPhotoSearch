 var app = require('../app');
 var request = require('supertest');
 
  describe('GET /', function(){
    it('respond with plain text', function(done){
      request(app)
        .get('/')
        .expect(200, done);
    })
  })
  
  
  describe('GET /api/search', function(){
  it('respond with json', function(done){
    request(app)
      .get('/api/test')
      .set('Accept', 'application/json')
      .expect(200)
      .end(function(err, res){
        if (err) return done(err);
        done()
      });
  })
})