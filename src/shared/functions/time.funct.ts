import { Time } from "@sapphire/time-utilities"

function seconds(num: number) {
    return Time.Second * num
}

function minutes(num: number) {
    return Time.Minute * num
}


function hours(num: number) {
    return Time.Hour * num
}

function days(num: number) {
    return Time.Day * num
}

function weeks(num: number) {
    return Time.Week * num
}

function years(num: number) {
    return Time.Year * num
}

export {
    seconds,
    minutes,
    hours,
    days,
    weeks,
    years
}