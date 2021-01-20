# MTConnect Adapter for Haas

This project create an MTConnect adapter to fetch machine status data from a Haas CNC Machine via RS-232, and send the status data to an MTConnect agente client.

## Install

You can download or clone this project from [here](https://github.com/EfrainRodriguez/Haas-MTConnect-Adapter)

In the project directory, you can install the solution by using:

```console
`npm install`
```

## How to use

You should add the respective settings for both serial communication and adapter server in the `config.json` file like this:

```json
`{
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
    }
}`
```

Depending on your operating system you should set the serial port name (e.g. `'COM9'` on Windows or `'/dev/ttyUSB0'` on Linux).

This adapter has been used with a Haas Mini Mill machine sending status data to the MTConnect cpp agent from MTConnect Institute, which can be found at https://github.com/mtconnect/cppagent. So far, fetch parameters supported by this adapter are:

- `Q100`: get machine availabity
- `Q104`: get machine operating mode
- `Q500`: get machine status and program information
- `Q600`: MACRO
    - `5041`: current X axis position
    - `5042`: current Y axis position
    - `5043`: current Z axis position
    - `3027`: spindle speed

More variables to use with the MACRO Q600 can be added on the basis of your need by appending the adapter code with functions for that.

To start the adapter, being in the project directory, you can run:

```console
`npm run start`
```

## Credits
The project is part of the research developments in the LaDPRER laboratory, UnB, Brazil.
Contributor: Efrain Rodriguez

## License

This software is Open Source provided "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.