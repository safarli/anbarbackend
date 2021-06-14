const net = require('net');

const CONN = {
	host: '192.168.1.13',
	port: 5555
}

const RELE_1_COMMAND = 'A1100000001'
const RELE_2_COMMAND = 'A1100000011'

const client = new net.Socket();
client.connect(CONN.port, CONN.host, () => {
	console.log('CONNECTED!')
})


setInterval(() => {
	// client.write(RELE_1_COMMAND)
	client.write(RELE_2_COMMAND)
}, 1500)

client.on('data', function (data) {
	console.log(data);
	console.log(typeof data);
	console.log(typeof data.toString());
})