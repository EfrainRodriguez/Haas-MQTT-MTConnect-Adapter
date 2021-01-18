const SerialPort = require('serialport')
const readline = require('readline-sync')

const port = new SerialPort(
    'COM9', //assumes machine connected to COM9 port on Windows system
    {
        baudRate: 115200, 
        parity: 'even',
        stopBits: 1,
        dataBits: 7
    }
)

port.on('error', (err) => {
    console.log('Error: ' + err.message)
})

const parser = port.pipe(new SerialPort.parsers.Readline({delimiter: '\n'}))

let cont = 0
parser.on('data', (data) => {
    console.log('Machine status: ' + data)
    cont++
    if(cont == 3){
        cont = 0
        sendLine()
    }
})

function sendLine() {
    var line = readline.question('\nType a Haas command\t')
    port.write(line + '\r\n', (err) => {
        if(err) {
            return console.log('Error on write: ' + err.message)
        }
        console.log('message written')
    })
}

sendLine()