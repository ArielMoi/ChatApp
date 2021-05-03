const generateMessage = (username, text) => {
    return {
        text,
        createdAt: new Date().getTime(),
        username,
    }
}

const generateLocationMessage = (username, location) => {
    return {
        location,
        createdAt: new Date().getTime(),
        username,
    }
}

module.exports = { generateMessage, generateLocationMessage };