const Report = require('../models/Report')
const Place = require('../models/Place')

const fetch = require('node-fetch')
const path = require('path')
const fs = require('fs')


const api_key = "AIzaSyBOfJA0Q0HblxOdU0mYk-B-ipBqyf4fSiI"

const main_page = (req, res) => {
    Report.find().select("_id body address reportImage").exec()
        .then(reports => {
            if (reports) {
                res.send({
                    result: reports,
                    count: reports.length
                })
            } else {
                res.send({detail: "No reports yet"})
            }
        })
}

// Send post request to add report to db
const add_report = (req, res) => {
    const { body, address } = req.body

    if (body && address && path.extname(req.file.originalname).toLowerCase() === ".png") {
        fs.rename(req.file.path, path.join(__dirname, `../uploads/${req.file.originalname}`), err => {
            if (err) {
                res.status(500).send({
                detail: "Server error!"
            })
            } else {
                Place.create({
                    address
                })

                Report.create({
                    body,
                    address,
                    reportImage: req.file.originalname
                })
                res.status(201).send({
                    detail: "The report added to db"
                })

                }
            })
        
    } else {
        res.status(400).send({
            detail: "Credentials were not provided"
        })
    }
}

const popular = (req, res) => {
    Report.find({}).select("address").exec()
        .then(reports => {
            let arr = []
            let items = {}
            let i=0

            for (i; i < reports.length; i++) {
                arr.push(reports[i].address)
                }
            for (let i = 0; i<arr.length; i++) {
                if (Object.keys(items).length>=20) {
                    break
                } else {
                    if (items[arr[i]]) {
                        items[arr[i]] += 1;
                        arr.splice(i, 1);
                    } else {
                        items[arr[i]] = 1;
                    }
                }
                
            }
            const result = Object.entries(items).map(([ key, val ]) => ({ val, address: key })).sort((a, b) => b.val - a.val)
            res.send({ result: result })


    })
}



const findPlaceID = (req, res) => {
    const { query } = req.query
    fetch(`https://maps.googleapis.com/maps/api/place/findplacefromtext/json?input=${query}&inputtype=textquery&key=${api_key}`)
        .then(response => response.json())
        .then(response => {
            if (response["candidates"][0]) {
                const place_id = response["candidates"][0].place_id
                fetch(`https://maps.googleapis.com/maps/api/place/details/json?place_id=${place_id}&key=${api_key}`)
                    .then(response => response.json())
                    .then(response => {
                        if (response.result === undefined) {
                            res.status(404).send({
                                detail: "Place has not found"
                            })
                        } else {
                            res.send(response.result)
                        }
                    })

            } else {

                res.status(404).send({
                    detail: "Place has not found"
                })
            }
        })
}



const setPlaceProperties = (req, res) => {
    const { address, isAdaptive, hasRamps, hasTactileCover } = req.body

    if (address && isAdaptive && hasRamps && hasTactileCover) {
        Place.find({ address }).exec()
            .then(place => {
                if (place) {
                    place.isAdaptive = isAdaptive
                    place.hasRamps = hasRamps
                    place.hasTactileCover = hasTactileCover
                    res.send({
                        detail: "Place properties has been changed!"
                    })
                } else {
                    res.status(404).send({
                        detail: "Place has not found"
                    })
                }
            })
    }
}

class PlaceAdaptive {
    constructor(response) {
        this.isAdaptive = response.isAdaptive
        this.hasRamps = response.hasRamps
        this.hasTactileCover = response.hasTactileCover
    }
}

const isPlaceAdaptive = (req, res) => {
    const { address } = req.query

    Place.find({ address }).exec()
        .then(place => {
            if (!place) {
                res.status(404).send({
                    detail: "Place has not found"
                })
            } else {
                res.send({
                    result: new PlaceAdaptive(place[0])
                })

            }
        })

}

module.exports = {
    main_page,
    add_report,
    popular,
    findPlaceID,
    setPlaceProperties,
    isPlaceAdaptive
}