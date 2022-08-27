import { API } from 'aws-amplify';

const apiName = 'booking'
const path = "/booking"
const myInit = {
    body: {},
    headers: {},
}

/**
 * get a list of booking
 * @param {} sub 
 */
async function list(sub) {
    const response = await API.get(apiName, `${path}/sub/${sub}`)
    return response
}

/**
 * get a booking
 * @param {*} sub 
 * @param {*} time 
 */
async function get(sub, time) {
}

/**
 * create a booking
 * @param {*} body 
 */
async function create(body) {
    let result = {}
    await API.post(apiName, path, { ...myInit, body })
        .then(_ => { /* nop */ })
        .catch(error => {
            const { status } = error.response
            console.log('error', status, error.response)
            if (status === 409) {
                result = { ...result, status: 409 }
            } else {
                throw new Error(error)
            }
        });
    return result
}

/**
 * update a booking
 * @param {*} body 
 */
async function update(body) {
    let result = {}
    await API.put(apiName, path, { ...myInit, body })
        .then(_ => { /* nop */ })
        .catch(error => {
            const { status } = error.response
            console.log('error', status, error.response)
            if (status === 409) {
                result = { ...result, status: 409 }
            } else {
                throw new Error(error)
            }
        });
    return result
}

/**
 * cancel a booking
 * @param {} sub 
 * @param {*} time 
 */
async function cancel(sub, time) {
    const response = await API.del(apiName, `${path}/object/${sub}/${time}`, myInit)
    return response
}

/**
 * remove a booking
 * @param {} sub 
 * @param {*} time 
 */
async function remove(sub, time) {
}

const BookingService = {
    list,
    get,
    create,
    update,
    cancel,
    remove
}

export default BookingService