'use strict';

var should = require('should'),
  request = require('supertest'),
  path = require('path'),
  mongoose = require('mongoose'),
  User = mongoose.model('User'),
  Reunion = mongoose.model('Reunion'),
  express = require(path.resolve('./config/lib/express'));

/**
 * Globals
 */
var app,
  agent,
  credentials,
  user,
  reunion;

/**
 * Reunion routes tests
 */
describe('Reunion CRUD tests', function () {

  before(function (done) {
    // Get application
    app = express.init(mongoose);
    agent = request.agent(app);

    done();
  });

  beforeEach(function (done) {
    // Create user credentials
    credentials = {
      username: 'username',
      password: 'M3@n.jsI$Aw3$0m3'
    };

    // Create a new user
    user = new User({
      firstName: 'Full',
      lastName: 'Name',
      displayName: 'Full Name',
      email: 'test@test.com',
      username: credentials.username,
      password: credentials.password,
      provider: 'local'
    });

    // Save a user to the test db and create new Reunion
    user.save(function () {
      reunion = {
        name: 'Reunion name'
      };

      done();
    });
  });

  it('should be able to save a Reunion if logged in', function (done) {
    agent.post('/api/auth/signin')
      .send(credentials)
      .expect(200)
      .end(function (signinErr, signinRes) {
        // Handle signin error
        if (signinErr) {
          return done(signinErr);
        }

        // Get the userId
        var userId = user.id;

        // Save a new Reunion
        agent.post('/api/reunions')
          .send(reunion)
          .expect(200)
          .end(function (reunionSaveErr, reunionSaveRes) {
            // Handle Reunion save error
            if (reunionSaveErr) {
              return done(reunionSaveErr);
            }

            // Get a list of Reunions
            agent.get('/api/reunions')
              .end(function (reunionsGetErr, reunionsGetRes) {
                // Handle Reunions save error
                if (reunionsGetErr) {
                  return done(reunionsGetErr);
                }

                // Get Reunions list
                var reunions = reunionsGetRes.body;

                // Set assertions
                (reunions[0].user._id).should.equal(userId);
                (reunions[0].name).should.match('Reunion name');

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should not be able to save an Reunion if not logged in', function (done) {
    agent.post('/api/reunions')
      .send(reunion)
      .expect(403)
      .end(function (reunionSaveErr, reunionSaveRes) {
        // Call the assertion callback
        done(reunionSaveErr);
      });
  });

  it('should not be able to save an Reunion if no name is provided', function (done) {
    // Invalidate name field
    reunion.name = '';

    agent.post('/api/auth/signin')
      .send(credentials)
      .expect(200)
      .end(function (signinErr, signinRes) {
        // Handle signin error
        if (signinErr) {
          return done(signinErr);
        }

        // Get the userId
        var userId = user.id;

        // Save a new Reunion
        agent.post('/api/reunions')
          .send(reunion)
          .expect(400)
          .end(function (reunionSaveErr, reunionSaveRes) {
            // Set message assertion
            (reunionSaveRes.body.message).should.match('Please fill Reunion name');

            // Handle Reunion save error
            done(reunionSaveErr);
          });
      });
  });

  it('should be able to update an Reunion if signed in', function (done) {
    agent.post('/api/auth/signin')
      .send(credentials)
      .expect(200)
      .end(function (signinErr, signinRes) {
        // Handle signin error
        if (signinErr) {
          return done(signinErr);
        }

        // Get the userId
        var userId = user.id;

        // Save a new Reunion
        agent.post('/api/reunions')
          .send(reunion)
          .expect(200)
          .end(function (reunionSaveErr, reunionSaveRes) {
            // Handle Reunion save error
            if (reunionSaveErr) {
              return done(reunionSaveErr);
            }

            // Update Reunion name
            reunion.name = 'WHY YOU GOTTA BE SO MEAN?';

            // Update an existing Reunion
            agent.put('/api/reunions/' + reunionSaveRes.body._id)
              .send(reunion)
              .expect(200)
              .end(function (reunionUpdateErr, reunionUpdateRes) {
                // Handle Reunion update error
                if (reunionUpdateErr) {
                  return done(reunionUpdateErr);
                }

                // Set assertions
                (reunionUpdateRes.body._id).should.equal(reunionSaveRes.body._id);
                (reunionUpdateRes.body.name).should.match('WHY YOU GOTTA BE SO MEAN?');

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should be able to get a list of Reunions if not signed in', function (done) {
    // Create new Reunion model instance
    var reunionObj = new Reunion(reunion);

    // Save the reunion
    reunionObj.save(function () {
      // Request Reunions
      request(app).get('/api/reunions')
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Array).and.have.lengthOf(1);

          // Call the assertion callback
          done();
        });

    });
  });

  it('should be able to get a single Reunion if not signed in', function (done) {
    // Create new Reunion model instance
    var reunionObj = new Reunion(reunion);

    // Save the Reunion
    reunionObj.save(function () {
      request(app).get('/api/reunions/' + reunionObj._id)
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Object).and.have.property('name', reunion.name);

          // Call the assertion callback
          done();
        });
    });
  });

  it('should return proper error for single Reunion with an invalid Id, if not signed in', function (done) {
    // test is not a valid mongoose Id
    request(app).get('/api/reunions/test')
      .end(function (req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'Reunion is invalid');

        // Call the assertion callback
        done();
      });
  });

  it('should return proper error for single Reunion which doesnt exist, if not signed in', function (done) {
    // This is a valid mongoose Id but a non-existent Reunion
    request(app).get('/api/reunions/559e9cd815f80b4c256a8f41')
      .end(function (req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'No Reunion with that identifier has been found');

        // Call the assertion callback
        done();
      });
  });

  it('should be able to delete an Reunion if signed in', function (done) {
    agent.post('/api/auth/signin')
      .send(credentials)
      .expect(200)
      .end(function (signinErr, signinRes) {
        // Handle signin error
        if (signinErr) {
          return done(signinErr);
        }

        // Get the userId
        var userId = user.id;

        // Save a new Reunion
        agent.post('/api/reunions')
          .send(reunion)
          .expect(200)
          .end(function (reunionSaveErr, reunionSaveRes) {
            // Handle Reunion save error
            if (reunionSaveErr) {
              return done(reunionSaveErr);
            }

            // Delete an existing Reunion
            agent.delete('/api/reunions/' + reunionSaveRes.body._id)
              .send(reunion)
              .expect(200)
              .end(function (reunionDeleteErr, reunionDeleteRes) {
                // Handle reunion error error
                if (reunionDeleteErr) {
                  return done(reunionDeleteErr);
                }

                // Set assertions
                (reunionDeleteRes.body._id).should.equal(reunionSaveRes.body._id);

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should not be able to delete an Reunion if not signed in', function (done) {
    // Set Reunion user
    reunion.user = user;

    // Create new Reunion model instance
    var reunionObj = new Reunion(reunion);

    // Save the Reunion
    reunionObj.save(function () {
      // Try deleting Reunion
      request(app).delete('/api/reunions/' + reunionObj._id)
        .expect(403)
        .end(function (reunionDeleteErr, reunionDeleteRes) {
          // Set message assertion
          (reunionDeleteRes.body.message).should.match('User is not authorized');

          // Handle Reunion error error
          done(reunionDeleteErr);
        });

    });
  });

  it('should be able to get a single Reunion that has an orphaned user reference', function (done) {
    // Create orphan user creds
    var _creds = {
      username: 'orphan',
      password: 'M3@n.jsI$Aw3$0m3'
    };

    // Create orphan user
    var _orphan = new User({
      firstName: 'Full',
      lastName: 'Name',
      displayName: 'Full Name',
      email: 'orphan@test.com',
      username: _creds.username,
      password: _creds.password,
      provider: 'local'
    });

    _orphan.save(function (err, orphan) {
      // Handle save error
      if (err) {
        return done(err);
      }

      agent.post('/api/auth/signin')
        .send(_creds)
        .expect(200)
        .end(function (signinErr, signinRes) {
          // Handle signin error
          if (signinErr) {
            return done(signinErr);
          }

          // Get the userId
          var orphanId = orphan._id;

          // Save a new Reunion
          agent.post('/api/reunions')
            .send(reunion)
            .expect(200)
            .end(function (reunionSaveErr, reunionSaveRes) {
              // Handle Reunion save error
              if (reunionSaveErr) {
                return done(reunionSaveErr);
              }

              // Set assertions on new Reunion
              (reunionSaveRes.body.name).should.equal(reunion.name);
              should.exist(reunionSaveRes.body.user);
              should.equal(reunionSaveRes.body.user._id, orphanId);

              // force the Reunion to have an orphaned user reference
              orphan.remove(function () {
                // now signin with valid user
                agent.post('/api/auth/signin')
                  .send(credentials)
                  .expect(200)
                  .end(function (err, res) {
                    // Handle signin error
                    if (err) {
                      return done(err);
                    }

                    // Get the Reunion
                    agent.get('/api/reunions/' + reunionSaveRes.body._id)
                      .expect(200)
                      .end(function (reunionInfoErr, reunionInfoRes) {
                        // Handle Reunion error
                        if (reunionInfoErr) {
                          return done(reunionInfoErr);
                        }

                        // Set assertions
                        (reunionInfoRes.body._id).should.equal(reunionSaveRes.body._id);
                        (reunionInfoRes.body.name).should.equal(reunion.name);
                        should.equal(reunionInfoRes.body.user, undefined);

                        // Call the assertion callback
                        done();
                      });
                  });
              });
            });
        });
    });
  });

  afterEach(function (done) {
    User.remove().exec(function () {
      Reunion.remove().exec(done);
    });
  });
});
