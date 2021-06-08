const request = require("request")
const { TOKEN_FB } = process.env

const postWebhook = (req, res) => {
    // Parse the request body from the POST
    let body = req.body;

    // Check the webhook event is from a Page subscription
    if (body.object === 'page') {

        // Iterate over each entry - there may be multiple if batched
        body.entry.forEach(function (entry) {

            // Get the webhook event. entry.messaging is an array, but 
            // will only ever contain one event, so we get index 0
            let webhook_event = entry.messaging[0];

            let user_id = webhook_event.sender

            let message = webhook_event.message

            handleMessage(user_id, message)
            console.log(webhook_event);

        });

        // Return a '200 OK' response to all events
        res.status(200).send('EVENT_RECEIVED');

    } else {
        // Return a '404 Not Found' if event is not from a page subscription
        res.sendStatus(404);
    }

}

const getWebhook = (req, res) => {
    let VERIFY_TOKEN = "cacapopo"

    // Parse the query params
    let mode = req.query['hub.mode'];
    let token = req.query['hub.verify_token'];
    let challenge = req.query['hub.challenge'];

    // Checks if a token and mode is in the query string of the request
    if (mode && token) {

        // Checks the mode and token sent is correct
        if (mode === 'subscribe' && token === VERIFY_TOKEN) {

            // Responds with the challenge token from the request
            console.log('WEBHOOK_VERIFIED');
            res.status(200).send(challenge);

        } else {
            // Responds with '403 Forbidden' if verify tokens do not match
            res.sendStatus(403);
        }
    }

}

function handleMessage(sender_psid, received_message) {
    const user_id = sender_psid.id
    const message = received_message.text

    let first_name;


    const payload = {
        recipient: {
            id: user_id
        },
        message: message
    }

    request({
        uri: `https://graph.facebook.com/v2.6/${user_id}?fields=first_name&access_token=${TOKEN_FB}`,
        json: payload

    }, (error, response, body) => {
        if (error) console.log(error);

        first_name = response.body.first_name

        console.log(first_name);
    })

    responseMessage(user_id, message)
}

function responseMessage(sender_psid, response) {
    let payload = {
        "recipient": {
            "id": sender_psid
        },
        "message": response
    }
    request({
        "uri": `https://graph.facebook.com/v2.6/me/messages?access_token=${TOKEN_FB}`,
        "method": "POST",
        "json": payload
    }, (err, res, body) => {
        if (!err) {
            console.log('message sent!')
        } else {
            console.error("Unable to send message:" + err);
        }
    });

}





module.exports = {
    postWebhook: postWebhook,
    getWebhook: getWebhook
}


