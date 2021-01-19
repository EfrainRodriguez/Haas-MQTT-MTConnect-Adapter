const net = require('net')

module.exports = function (port) {

    let _port = port || 7878

    let server = net.createServer()

    server.listen(_port, () => {
        console.log('MTConnect adapter running on port', _port)
    })

    server.on('error', err => {
        console.log('TCP server error--> ' + err.message)
    })

    server.on('connection', (socket) => {
        socket.on('data', (data) => {
            console.log('o Agente diz: ' + data.toString())
            socket.write('* PONG 5000\n')
            let date = new Date();
            socket.write(
                date.getFullYear().toString() + '-' +
                '01' + '-' +
                date.getDate().toString() + 'T' +
                date.getHours().toString() + ':' +
                date.getMinutes().toString() + ':' +
                date.getSeconds().toString() + '|' +
                'x_act|' + Math.random().toString() * 100 + '\n'
            )
        })

        socket.on('error', err => {
            console.log('Socket error--> ' + err.message)
        })
    })
}
