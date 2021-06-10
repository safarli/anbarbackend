const redis = require("redis");
const client = redis.createClient({ port: 6379, host: 'localhost' });

client.setex("alma", JSON.stringify("Quba"), "append");


// client.get('alma', (err, reply) => {
// 	if (err) throw err;
// 	console.log(JSON.parse(reply));
// })
