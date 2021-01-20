const Adapter = require('./mtconnect-adapter')
const Serial = require('./haas-serial')
const config = require('./config.json')

//init
const adapter = new Adapter(config.adapter)
const serialcomm = new Serial(config.serial)

// loop
setInterval(() => {
    start()
}, 250)

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

    status = status.substr(indexStr + 1, (indexEnd - indexStr) - 1).split(',')

    return status
}

/**
 * Variable Q100: get machine availability
 */
async function cmdQ100() {
    const status = await serialcomm.sendCommand('Q100')
    if(status != null){
        adapter.addDataItem('avail', 'AVAILABLE')
    }else{
        adapter.addDataItem('avail', 'UNAVAILABLE')
    }
}

/**
 * Variable Q104: get operation mode
 */
async function cmdQ104() {

    let status = await serialcomm.sendCommand('Q104')

    if (status != null) {

        status = cleanStatus(status)

        if(status[1] != null){
            switch (status[1].trim()) {
                case 'MDI':
                    adapter.addDataItem('mode', 'MANUAL_DATA_INPUT')
                    break;
                case 'JOG':
                    adapter.addDataItem('mode', 'MANUAL')
                    break;
                case 'ZERORET':
                    adapter.addDataItem('mode', 'MANUAL')
                    break;
                default:
                    adapter.addDataItem('mode', 'AUTOMATIC')
                    break;
            }
        }
    }

}

/**
 * Variable Q500: get machine status
 */
async function cmdQ500() {

    let status = await serialcomm.sendCommand('Q500')

    if (status != null) {
        
        status = cleanStatus(status)
        
        if (status[0].trim() === 'PROGRAM') {
            if(status[1] != null){
                adapter.addDataItem('program', status[1].trim())
            }

            if(status[2] != null){
                adapter.addDataItem('execution', status[2].trim())
            }

            if(status[3] != null && status[4] != null){
                if(status[3] === 'PARTS') adapter.addDataItem('part_count', status[4].trim())
            }
        }else if(status[0].trim() === 'STATUS'){
            if(status[1] != null){
                adapter.addDataItem('execution', status[1].trim())
            }
        }
    }
}


/**
 * MACRO Q600: fetch machine condition
 */
async function cmdQ600() {

    await cmd5041()
    await cmd5042()
    await cmd5043()
    await cmd3027()

}

/**
 * Variable 5041: get current x position
 */
async function cmd5041() {
    let status = await serialcomm.sendCommand('Q600 5041')
    status = cleanStatus(status)
    if(status[2] != null){
        adapter.addDataItem('x_act', status[2].trim())
    }
}

/**
 * Variable 5042: get current y position
 */
async function cmd5042() { 
    let status = await serialcomm.sendCommand('Q600 5042')
    status = cleanStatus(status)
    if(status[2] != null){
        adapter.addDataItem('y_act', status[2].trim())
    }
}

/**
 * Variable 5043: get current z position
 */
async function cmd5043() {
    let status = await serialcomm.sendCommand('Q600 5043')
    status = cleanStatus(status)
    if(status[2] != null){
        adapter.addDataItem('z_act', status[2].trim())
    }
}

/**
 * Variable 3027: get spindle speed
 */
async function cmd3027() {
    let status = await serialcomm.sendCommand('Q600 3027')
    status = cleanStatus(status)
    if(status[2] != null){
        adapter.addDataItem('speed', status[2].trim())
    }
}

