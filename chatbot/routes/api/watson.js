/*1. Load dependencies*/
const express = require("express");
const router = express.Router();
const AssistantV2 = require("ibm-watson/assistant/v2");
const {IamAuthenticator} = require("ibm-watson/auth");
/*2. Create instance of assistant*/
/*2.1: First authenticate*/
const authenticator = new IamAuthenticator({apikey: process.env.WATSON_ASSISTANT_APIKEY,}); 
/*2.2: Connect to assistant*/
const assistant = new AssistantV2({
    version: "2021-11-27",
    authenticator: authenticator,
    url: process.env.WATSON_ASSISTANT_URL,
});

/*3. Route to handle session tokens*/
/*GET api/watson/session*/ 
router.get("/session", async (req,res) => {
    /*If successful*/
    try{
    const session = await assistant.createSession({
        assistantId: process.env.WATSON_ASSISTANT_ID,
    });
    res.json(session["result"]);
    /*error message for failures*/
}catch(err){
    res.send("Sorry, an error occurrued while processing your request");
    console.log(err);

}
});
/*4. Handle messages*/
/*incoming*/

/*5. Export routes*/ 
module.exports = router; 