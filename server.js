const express = require('express');
const bodyParser = require('body-parser');
const server = express();

const crypto = require('crypto');

//Env variables
const hash_secret = require('./localenv').hash_secret;

//Custom modules
const db = require('./modules/dbhandler');

server.use(bodyParser.json());

server.use(express.static('public'));

server.post('/createUser', async (req, res)=>{
    const [username, password] = Buffer.from(req.headers.user,'base64').toString('utf-8').split(':');

    //Encrypt password
    const hmac = crypto.createHmac('sha256', hash_secret);
    hmac.update(password);
    const encryptedPassword = hmac.digest('hex');
    
    //Send username and encrypted password to database
    let result = await db.createUser(username, encryptedPassword);
    console.log(result);

});

server.set('port', (process.env.PORT || 8080));
server.listen(server.get('port'), function() {
    console.log('server running', server.get('port'));
});