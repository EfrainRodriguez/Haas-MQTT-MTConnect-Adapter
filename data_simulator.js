module.exports = function() {

    this.Q100 = async function() {

        return this.randomize([null, 'AVAILABLE'])


    }
    this.Q104 = async function() {

        return `Q104 \x02MODE, ${this.randomize(['MDI', 'JOG', 'ZERORET'])}\x17 >` 

    }
    this.Q500 = async function() {

        status = this.randomize(['PROGRAM', 'STATUS'])
        let str = ''
        if (status == 'PROGRAM') {

            str = `Q500 \x02${status},SIMULACAO,IDLE,PARTS,${this.getRandomInt(0, 10)}\x17 >`

        } else {

            str = `Q500 \x02${status}, BUSY\x17 >`

        }
        return str

    }
    this.Q600_5021 = async function() {

        str = `Q600 5021 \x02MACRO, 5021,       ${(this.getRandomInt(-600000, 200000)/1000).toFixed(3)}\x17 >`
        return str

    }
    this.Q600_5022 = async function() {

        str = `Q600 5022 \x02MACRO, 5022,       ${(this.getRandomInt(-300000, 100000)/1000).toFixed(3)}\x17 >`
        return str

    }
    this.Q600_5023 = async function() {

        str = `Q600 5023 \x02MACRO, 5023,       ${(this.getRandomInt(-250000, 100000)/1000).toFixed(3)}\x17 >`
        return str

    }
    this.Q600_3027 = async function() {

        str = `Q600 3027 \x02MACRO, 3027,       ${(this.getRandomInt(0, 6000000)/1000).toFixed(3)}\x17 >`
        return str

    }
    this.Q600_1094 = async function() {

        str = `Q600 1094 \x02MACRO, 1094,       ${(this.getRandomInt(0, 151000000)/1000).toFixed(3)}\x17 >`
        return str

    }
    this.Q600_1098 = async function() {

        str = `Q600 1098 \x02MACRO, 1098,       ${Math.floor(this.getRandomInt(0, 8192)).toFixed(3)}\x17 >`
        return str

    }
    this.getRandomInt = function(min, max) {

        min = Math.ceil(min);
        max = Math.floor(max);
        return Math.floor(Math.random() * (max - min)) + min;

    }
    this.randomize = function(array_of_random_elements) {

        return array_of_random_elements[Math.round(Math.random() * (array_of_random_elements.length - 1))]

    }

}