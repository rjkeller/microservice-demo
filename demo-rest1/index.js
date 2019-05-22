const express = require('express');
const bodyParser = require('body-parser');
const compression = require('compression');
const superagent = require('superagent');

const isValid = async (token) =>
  (await superagent
    .post(`${process.env.AUTH_MICROSERVICE_URL}/v1/isValid`)
    .send({token: token}))
    .body;

const main = async () => {
  // Then boot up express:
  const app = express();

  app.use(bodyParser.json({
    extended: true
  }));
  app.use(bodyParser.urlencoded({
    extended: true
  }));
  app.use(compression());

  app.post('/v1/test', async (req, res) => {
    const tokenValidResult = await isValid(req.body.token)
    console.log('got valid result:', tokenValidResult)

    if (tokenValidResult.status !== 'ok') {
      res.json({status: 'Invalid username or password'})
    }

    res.json({status: 'yay!'});
  });

  app.set('port', process.env.PORT || 80);
  const server = app.listen(app.get('port'), () => {
    console.log(`Express server listening on port ${app.get('port')}`);
  });
}

main()
  .catch(ex => console.log(ex));
