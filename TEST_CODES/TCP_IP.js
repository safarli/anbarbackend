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
	client.write(RELE_1_COMMAND)
	// client.write(RELE_2_COMMAND)
}, 5000)

client.on('data', function (data) {
	let newbuf = Buffer.from('')
	const cr_index = data.indexOf(parseInt('0x0d'), 0, 'hex')
	console.log(cr_index);
	data.copy(newbuf, 0, cr_index)
	console.log(parseInt(data.toString()));
})