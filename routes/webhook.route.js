const express = require("express")

const router = express.Router()
const webhookController = require("../controllers/webhook.controller")
router.get("/", (req, res) => {
    webhookController.getWebhook(req, res)
})
router.post("/", (req, res) => {
    webhookController.postWebhook(req, res)
})
module.exports = router