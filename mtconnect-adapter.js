const net = require('net')

module.exports = function (options) {

    let _port = options.port || 7878
    let _host = options.host || 'localhost'
    this.heartbit = options.heartbit || 1000

    let shdrLine = ''
    let dataItems = {}

    let server = net.createServer()

    server.listen(_port, _host, () => {
        console.log('MTConnect adapter running on port', _port)
    })

    server.on('error', err => {
        console.log('TCP server error--> ' + err.message)
    })

    server.on('connection', (socket) => {
        const clientAddress = socket.remoteAddress + ' ' + socket.remotePort
        console.log("New socket client connected: " + clientAddress)
        socket.on('data', (data) => {
            if (data.includes('* PING')) {
                socket.write('* PONG ' + this.heartbit.toString() + '\n')
                buildSHDR()
                //console.log(shdrLine)
                socket.write(shdrLine)
            }
        })

        socket.on('error', err => {
            console.log('Socket error--> ' + err.message)
        })
    })

    function buildSHDR() {
        //console.log('write to client')
        shdrLine = ''
        shdrLine += getTimestamp()
        for (let item in dataItems) {
            shdrLine += '|' + item + '|' + dataItems[item]
        }
        shdrLine += '\n'
    }

    function getTimestamp() {
        const date = new Date()
        return date.getFullYear().toString() + '-' +
        (date.getMonth() + 1).toString() + '-' +
        date.getDay().toString() + 'T' +
        date.getHours().toString() + ':' +
        date.getMinutes().toString() + ':' +
        date.getSeconds().toString()
    }

    this.addDataItem = (name, value) => {
        if (name != null && value != null) {
            dataItems[name] = value
        }
    }
    
}
