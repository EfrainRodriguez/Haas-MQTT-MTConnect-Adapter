const SerialPort = require('serialport')
const {promisify} = require('util')

const sleep = promisify(setTimeout)

module.exports = function (port, baudrate) {

    let _port
    switch (process.platform) {
        case 'win32':
            _port = port || 'COM9'
            break
        case 'linux':
            _port = port || '/dev/ttyUSB0'
            break
        default:
            _port = port || 'COM9'
            break
    }

    let serialcomm = new SerialPort(
        _port,
        {
            baudRate: baudrate || 115200, 
            parity: 'even',
            stopBits: 1,
            dataBits: 7
        }
    )

    let parser = serialcomm.pipe(new SerialPort.parsers.Readline({delimiter: '\n'}))

    let status = ''

    parser.on('data', data => {
        //console.log('Machine status: ' + data)
        status += ' ' + data
    })

    serialcomm.on('error', err => {
        console.log('Serial port error--> ' + err.message)
    })

    this.sendCommand = async (line) => {
        status = ''
        serialcomm.write(line + '\r\n', err => {
            if(err) {
                return console.log('Error writting to port ' + _port + '-->' + err.message)
            }
            //console.log('Command sent!')
        })
        await sleep(500)
        return status
    }
    
}