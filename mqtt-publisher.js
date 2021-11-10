/*  
**  MQTT:           Messages associated to a certain topic
**  Publisher:      Sends the messages to the broker
**  Broker:         Server that manages the messages sent from publishers to subscribers
**  Subscribers:    Receives the messages sent from publishers
**
**  Main topic:     haas/minimill/*    
**  (standard topic, you can modify at config.json, keep in mind that it has to be the same topic of your subscribers' configurations)
**  *:              Subtopics (avail, mode, program, execution, part_count, x_act, y_act, z_act, speed, coolant_level, load)
*/

const Serial = require('./haas-serial')
const Simulator = require('./data_simulator')
const config = require('./config.json')

const mqtt = require('mqtt')
const Broker = require('./mqtt-broker')

const simulation = config.publisher.simulation
const serialcomm = simulation ? null : new Serial(config.serial)
const simulator = simulation ? new Simulator() : null


const broker = new Broker(config.publisher)
const pub = mqtt.connect(`mqtt://${config.publisher.host}:${config.publisher.port}`)
var position = ""
//console.log(config.publisher.heartbit)
pub.on('connect', () => {

    setInterval(() => {

        if (broker.connected >= 1) {

            start()

        }

    }, config.publisher.heartbit)

})

process.on('SIGINT', function() {

    console.log('Finishing process and closing publisher.')
    pub.publish('haas/minimill/status', 'OFFLINE')
    pub.end()
    broker.server.close()

})

var first = true
// loop


/**
 * Start machine monitoring
 */
function start() {
    cmdQ100()
    .then(() => {
        return cmdQ104()
    })
    .then(() => {
        return cmdQ500()
    })
    .then(() => {
        return cmdQ600()
    })
}

/**
 * Clean and splits the string with the machine status
 */
 function cleanStatus(status) {
    const indexStr = status.indexOf('\x02')
    const indexEnd = status.indexOf('\x17')
    //console.log(status)
    
    status = status.substr(indexStr + 1, (indexEnd - indexStr) - 1).split(',')
    /*for( item in status) {

        console.log(status[item])
        console.log(' ')

    }*/
    //console.log('\n')
    return status
}

/**
 * Variable Q100: get machine availability
 */
async function cmdQ100() {

    
    if (first || !first) {

        let status
        if (simulation) {

            status = await simulator.Q100()
    
        } else {
    
            status = await serialcomm.sendCommand('Q100')
    
        }
        if(status != null){
            pub.publish(config.publisher.topic + 'avail', 'AVAILABLE')
        }else{
            pub.publish(config.publisher.topic + 'avail', 'UNAVAILABLE')
        }
        first = false

    }

}

/**
 * Variable Q104: get operation mode
 */
async function cmdQ104() {

    let status
    if (simulation) {

        status = await simulator.Q104()

    } else {

        status = await serialcomm.sendCommand('Q104')

    }
    if (status != null) {

        status = cleanStatus(status)

        if(status[1] != null){
            switch (status[1].trim()) {
                case 'MDI':
                    pub.publish(config.publisher.topic + 'mode', 'MANUAL_DATA_INPUT')
                    break;
                case 'JOG':
                    pub.publish(config.publisher.topic + 'mode', 'MANUAL')
                    break;
                case 'ZERORET':
                    pub.publish(config.publisher.topic + 'mode', 'MANUAL')
                    break;
                default:
                    pub.publish(config.publisher.topic + 'mode', 'AUTOMATIC')
                    break;
            }
        }
    }

}

/**
 * Variable Q500: get machine status
 */
async function cmdQ500() {

    let status
    if (simulation) {

        status = await simulator.Q500()

    } else {

        status = await serialcomm.sendCommand('Q500')

    }
    if (status != null) {
        
        status = cleanStatus(status)
        
        if (status[0].trim() === 'PROGRAM') {
            if(status[1] != null){
                pub.publish(config.publisher.topic + 'program', status[1].trim())
            }

            if(status[2] != null){
                pub.publish(config.publisher.topic + 'execution', status[2].trim())
            }

            if(status[3] != null && status[4] != null){
                if(status[3] === 'PARTS') pub.publish(config.publisher.topic + 'part_count', status[4].trim())
            }
        }else if(status[0].trim() === 'STATUS'){
            if(status[1] != null){
                pub.publish(config.publisher.topic + 'execution', status[1].trim())
            }
        }
    }
}


/**
 * MACRO Q600: fetch machine condition
 */
async function cmdQ600() {

    await cmd5021()
    await cmd5022()
    await cmd5023()
    await cmd3027()
    await cmd1094()
    //await sleep(500)
    await cmd1098()
    //await cmd3026()

}

/**
 * Variable 5021: get current machine x position
 */
async function cmd5021() {
    let status
    if (simulation) {

        status = await simulator.Q600_5021()

    } else {

        status = await serialcomm.sendCommand('Q600 5021')

    }
    status = cleanStatus(status)
    if(status[2] != null){
        position = String(Number(status[2].trim()).toFixed([3]))
        pub.publish(config.publisher.topic + 'x_act', String(Number(status[2].trim()).toFixed([3])))
    }
}

/**
 * Variable 5022: get current machine y position
 */
async function cmd5022() { 
    let status
    if (simulation) {

        status = await simulator.Q600_5022()

    } else {

        status = await serialcomm.sendCommand('Q600 5022')

    }
    status = cleanStatus(status)
    if(status[2] != null){
        position += ';'
        position += String(Number(status[2].trim()).toFixed([3]))
        pub.publish(config.publisher.topic + 'y_act', String(Number(status[2].trim()).toFixed([3])))
    }
}

/**
 * Variable 5023: get current machine z position
 */
async function cmd5023() {
    let status
    if (simulation) {

        status = await simulator.Q600_5023()

    } else {

        status = await serialcomm.sendCommand('Q600 5023')

    }
    status = cleanStatus(status)
    if(status[2] != null){
        position += ';'
        position += String(Number(status[2].trim()).toFixed([3]))
        pub.publish(config.publisher.topic + 'z_act', String(Number(status[2].trim()).toFixed([3])))
        pub.publish(config.publisher.topic + 'position', position)
    }
}

/**
 * Variable 3027: get spindle speed
 */
async function cmd3027() {
    let status
    if (simulation) {

        status = await simulator.Q600_3027()

    } else {

        status = await serialcomm.sendCommand('Q600 3027')

    }
    status = cleanStatus(status)
    if(status[2] != null){
        pub.publish(config.publisher.topic + 'speed', status[2].trim())
    }
}

/**
 * Variable 1094: get coolant level
 */
async function cmd1094() {
    let status
    if (simulation) {

        status = await simulator.Q600_1094()

    } else {

        status = await serialcomm.sendCommand('Q600 1094')

    }
    status = cleanStatus(status)
    if(status[2] != null){
        pub.publish(config.publisher.topic + 'coolant_level', status[2].trim())
    }
}

/**
 * Variable 1098: get spindle load
 */
async function cmd1098() {
    let status
    if (simulation) {

        status = await simulator.Q600_1098()

    } else {

        status = await serialcomm.sendCommand('Q600 1098')

    }
    status = cleanStatus(status)
    if(status[2] != null){
        status[2] = String((Number(status[2])/81.9200).toFixed(3))
        pub.publish(config.publisher.topic + 'load', status[2].trim())
    }
}

/**
 * Variable 3026: get tool in spindle
 */
async function cmd3026() {
    let status = await serialcomm.sendCommand('Q600 3026')
    status = cleanStatus(status)
    if(status[2] != null){
        pub.publish(config.publisher.topic + 'tool', status[2].trim())
    }
}

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}