const aedes = require('aedes')()
const net = require('net')


module.exports = function (options) {

    let _port = options.port || 1883
    this.connected = 0

    this.server = net.createServer(aedes.handle)
    this.server.listen(_port, function () {

        console.log('MQTT server started and listening on port ', _port)
      
    })
    this.server.on('connection', (socket) => {

        const clientAddress = socket.remoteAddress.split(':')[3] + ' ' + socket.remotePort
        console.log("New socket client connected: " + clientAddress)
        this.connected += 1

    })
    /*server.on('timeout', (socket) => {

        const clientAddress = socket.remoteAddress.split(':')[3] + ' ' + socket.remotePort
        console.log("Socket client disconnected: " + clientAddress)
        this.connected -= 1

    })*/


}