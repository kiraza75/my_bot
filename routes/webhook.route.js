const express = require("express")

const router = express.Router()
const webhookController = require("../controllers/webhook.controller")
router.post("/", (req, res) => {
    webhookController.postWebhook(req, res)
})

module.exports = router