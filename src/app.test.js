import supertest from 'supertest';
import musicians from './musicians';

import app from './app';

const muddy = {
  firstName: 'Muddy',
  lastName: 'Waters',
  genre: 'ROCK',
};

const joel = {
  firstName: 'Billy',
  lastName: 'Joel',
  genre: 'ROCK',
};

const request = supertest(app);

it('GET ALL - Should respond 200 with all musicians', done => {
  request
    .get('/musicians')
    .expect('Content-Type', /json/)
    .expect(async res => {
      // Respond with correct muscicians
    })
    .expect(200, musicians, done);
});

it('GET BY ID - Should respond 200 musician by ID', done => {
  request
    .get('/musicians/ella')
    .expect('Content-Type', /json/)
    .expect(200, musicians.ella, done);
});

it('GET BY ID - Should respond 400 if musician does not exist', done => {
  request
    .get('/musicians/joel')
    .expect('Content-Type', /json/)
    .expect(400, done);
});

it('CREATE BY ID - Should respond 200 if musician does not exist and create it', done => {
  request
    .put('/musicians/joel')
    .send(joel)
    .expect('Content-Type', /json/)
    .expect(200, { id: 'joel' }, done);
});

it('CREATE BY ID - Should respond 400 if bad request data', done => {
  request
    .put('/musicians/example')
    .send({
      firstName: [],
      lastName: 5,
      genre: 'ROCK',
    })
    .expect('Content-Type', /json/)
    .expect(400, done);
});

it('PUT BY ID - Should respond 200 if musician does exist and update it', done => {
  request
    .put('/musicians/waters')
    .send(muddy)
    .expect('Content-Type', /json/)
    .expect(200, { id: 'waters' }, done);
});

it('PUT BY ID - Should respond 400 if bad update', done => {
  request
    .put('/musicians/waters')
    .send({ genre: 'COUNTRY' })
    .expect('Content-Type', /json/)
    .expect(400, done);
});

it('GET BY ID - Should respond 200 for Joel', done => {
  request
    .get('/musicians/joel')
    .expect('Content-Type', /json/)
    .expect(200, joel, done);
});

it('GET BY ID - Should respond 200 with update for Muddy', done => {
  request
    .get('/musicians/waters')
    .expect('Content-Type', /json/)
    .expect(200, muddy, done);
});
