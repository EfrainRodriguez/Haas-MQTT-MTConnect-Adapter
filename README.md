## MTConnect Adapter for Haas

This Node js project creates an MTConnect adapter to fetch machine status data from a Haas CNC Machine via RS-232, and send it to an MTConnect agent client.

## Install

You can download or clone this project [here](https://github.com/EfrainRodriguez/Haas-MTConnect-Adapter). However, keep in mind that to install this project you must have `Node js` and `npm` installed on your computer or IoT device. You can download both from [here](https://nodejs.org/en/).

In the project directory, you can install the solution by using:

```console
npm install
```

## How to use

You should add the respective settings for both serial communication and adapter server in the `config.json` file like this:

```json
{
    "serial": {
        "port": "COM9",
        "baudrate": 115200,
        "parity": "even",
        "stopBits": 1,
        "dataBits": 7
    },

    "adapter": {
        "host": "localhost",
        "port": 7878,
        "heartbit": 1000
    },

    "publisher": {

        "host": "localhost",
        "port": 7870,
        "simulation": true

    }

}
```

Depending on your operating system you should set the serial port name (e.g. `'COM9'` on Windows or `'/dev/ttyUSB0'` on Linux).

This adapter has been used with a Haas Mini Mill machine sending status data to the MTConnect cpp agent from MTConnect Institute, which can be found at https://github.com/mtconnect/cppagent. Also the `Devices.xml` file in this repository contains a xml model for running the cppagent, which is already configured for receiving the data that this adapter is originally intended to get. So far, fetch parameters supported by this adapter are:

- `Q100`: get machine availability
- `Q104`: get machine operating mode
- `Q500`: get machine status and program information
- `Q600`: MACRO
    - `5041`: current X axis position
    - `5042`: current Y axis position
    - `5043`: current Z axis position
    - `3027`: spindle speed
    - `1094`: coolant level
    - `1098`: spindle load
    - `3026`: tool in spindle

More variables to use with the MACRO Q600 can be added on the basis of your need by appending the adapter code with functions for that. 

To start the adapter, being in the project directory, you can run:

```console
npm run adapter
```

There is also a MQTT solution which you can run with the following command:

```console
npm run publisher
```

In order for it to work you need to install and set up a MQTT broker, the broker used to test this project can be found at `https://github.com/eclipse/mosquitto`. In the `config.json` file mentioned above, adjustments are needed in the "publisher" section accordingly to the configurations done to set up the broker. 

## Credits
The project is part of the research developments in the LaDPRER laboratory, UnB, Brazil.

Contributor: Efrain Rodriguez <br/>
[Github profile](https://github.com/EfrainRodriguez) <br/>
[Researchgate profile](https://www.researchgate.net/profile/Efrain_Rodriguez7)

## License

This software is Open Source provided "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.
