const express = require('express');
const redis = require('redis');
const bodyParser = require('body-parser');
const app = express();
process.env.PORT = 4000;
$PORT = 4000;

let client = redis.createClient(process.env.REDIS_URL);
client.on('connect', function() {
    console.log('Connected to Redis...')
});

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

app.get('/api/get_all_messages', function(req, res) {
    client.lrange('messages', 0, -1, function(err, reply) {
        res.json(reply);
    });
});

app.delete('/api/delete_messages', function(req, res) {
    client.del('messages', function(err, reply) {
        res.json(reply);
    });
});

app.post('/api/new_message', function(req, res) {
    console.log(JSON.stringify(req.body));
    client.rpush(['messages', JSON.stringify(req.body.message_obj)], (err, result) => {
        res.json(result);
    });
});

app.listen($PORT, () => {
    console.log('Server is running on PORT:',$PORT);
});

module.exports = app;
