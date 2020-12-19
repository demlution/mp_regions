
const fs = require('fs')
const path = require('path')
const { promisify } = require('util')

const readFile = promisify(fs.readFile)
const writeFile = promisify(fs.writeFile)

const splitLines = source => source.split(/\r?\n/)

require('dotenv').config({
    path: path.resolve(fs.realpathSync(process.cwd()), '.env'),
})

const REGION_PATH = path.join(process.env.WXDT, '../code/package.nw/js/libs/region')
const OUTPUT_PATH = path.resolve(fs.realpathSync(process.cwd()), 'dist')

const buildingConfigs = [
    {
        name: 'mp_regions.json',
        builder: descendantListBuilder,
    },
    {
        name: 'mp_regions.min.json',
        builder: descendantListMinBuilder,
    },
    {
        name: 'mp_vant_area.json',
        builder: vantAreaListBuilder,
    },
    {
        name: 'adcode_to_postcode.json',
        builder: adcodeToPostcodeBuilder,
    },
]


async function main () {
    const source = await readSource()
    return Promise.all(buildingConfigs.map(({name, builder}) => build(source, builder, name)))
}


async function build (source, builder, outputPath) {
    return writeFile(
        path.join(OUTPUT_PATH, outputPath),
        JSON.stringify(builder(source)),
        'utf-8',
    )
}


async function readSource () {
    if (!fs.existsSync(REGION_PATH)) {
        console.warn('NOT FOUND', REGION_PATH)
        process.exit(1)
    }

    return readFile(REGION_PATH, 'utf-8')
}


function vantAreaListBuilder (source) {
    const output = {
        province_list: {},
        city_list: {},
        county_list: {},
    }

    traverseSource(source, (code, name, postcode, level) => {
        if (level === 0) {
            output.province_list[code] = name
        } else if (level === 1) {
            output.city_list[code] = name
        } else {
            output.county_list[code] = name
        }
    })

    return output
}


function descendantListMinBuilder (source) {
    const output = []

    let province
    let city
    traverseSource(source, (code, name, postcode, level) => {
        let area = {code, name}
        if (level === 0) {
            province = area = Object.assign(area, {children: []})
            output.push(province)
        } else if (level === 1) {
            city = area = Object.assign(area, {children: []})
            province.children.push(city)
        } else {
            city.children.push(area)
        }
    })

    return output
}


function descendantListBuilder (source) {
    const output = []

    let province
    let city
    traverseSource(source, (code, name, postcode, level) => {
        let area = {code, name, postcode}
        if (level === 0) {
            province = area = Object.assign(area, {children: []})
            output.push(province)
        } else if (level === 1) {
            city = area = Object.assign(area, {children: []})
            province.children.push(city)
        } else {
            city.children.push(area)
        }
    })

    return output
}


function adcodeToPostcodeBuilder (source) {
    const output = {}
    traverseSource(source, (code, name, postcode, level) => {
        output[code] = postcode
    })

    return output
}


function traverseSource (source, traverser) {
    const lines = splitLines(source)
    for (const line of lines) {
        const [code, name, postcode] = line.split(/\s+/g)
        const level = [1, 3, 8].indexOf(line.match(/\s+/g)[0].length)
        traverser(code, name, postcode, level)
    }
}


main()
