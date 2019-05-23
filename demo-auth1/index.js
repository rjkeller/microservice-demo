const express = require('express');
const bodyParser = require('body-parser');
const compression = require('compression');
const jwt = require('jsonwebtoken');
const mysql = require('promise-mysql');

const main = async () => {
  // Start MySQL connection
  let conn
  while (!conn) {
    try {
      conn = await mysql.createConnection({
        host: process.env.MYSQL_DB_HOST,
        user: process.env.MYSQL_DB_USER,
        password: process.env.MYSQL_DB_PASSWORD,
        database: process.env.MYSQL_DB_NAME
      });
    } catch (ex) {
      console.log(ex);
      await sleep(1000)
    }
  }

  // Then boot up express:
  const app = express();

  app.use(bodyParser.json({
    extended: true
  }));
  app.use(bodyParser.urlencoded({
    extended: true
  }));
  app.use(compression());

  app.post(`/${process.env.VERSION}/authenticate`, async (req, res) => {
    console.log('Starting to authenticate!');
    const rows = await conn.query(`
      SELECT
        *
      FROM
        users
      WHERE 
        username = ?
    `, [req.body.username]);

    if (rows.length <= 0) {
      res.status(404).json({error: 'Username or password invalid'});
    } else {
      res.json({
        jwt: jwt.sign({ username: req.body.username }, process.env.JWT_SECRET_KEY)
      });
    }
  })

  app.post(`/${process.env.VERSION}/isValid`, async (req, res) => {
    console.log('Trying to authenticate token:', req.body.token);
    jwt.verify(req.body.token, process.env.JWT_SECRET_KEY, (err, token) => {
      if (err) {
        res.json({status: 'bad'});
      } else {
        res.json({status: 'ok'});
      }
    });
  });

  app.set('port', process.env.PORT || 80);
  const server = app.listen(app.get('port'), () => {
    console.log(`Express server listening on port ${app.get('port')}`);
  });
}

main()
  .catch(ex => console.log(ex));
