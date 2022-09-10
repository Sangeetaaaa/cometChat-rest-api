
// const http = require('http').Server(app);
// const io = require('socket.io')(http);
const port = process.env.PORT || 3000;
const { json } = require('body-parser');
const express = require('express');
// const bodyParser = require('body-parser')
const request = require('request');

const app = express();


app.use(express.urlencoded({extended: true})); 
app.use(express.json()); 

app.get('/', (req, res) => {
    console.log("All working good")
})


// create new user
// input body - uid - unquie id for user eg. id7

app.post('/createUser', (req, res) => {

    const options = {
    method: 'POST',
    url: 'https://218520b4f9359d6f.api-us.cometchat.io/v3/users',
    headers: {
        apiKey: 'e15689e71c946c93c1171d19142eef2355cf0de2',
        'Content-Type': 'application/json',
        Accept: 'application/json'
    },
    body: {
        metadata: {'@private': {email: req.body.email, contactNumber: req.body.contactNumber}},
        name: req.body.name,
        uid: req.body.uid,
        avatar: req.body.avatar
    },
    json: true
    };

    request(options, function (error, response, body) {
    if (error) throw new Error(error);

    return res.status(response.statusCode).json(body)
    });
});

// send message to Person A from Person B
app.get("/sendMessage", (req, res) => {
    const request = require('request');

    const options = {
    method: 'POST',
    url: 'https://218520b4f9359d6f.api-us.cometchat.io/v3/messages',
    headers: {
        apiKey: 'e15689e71c946c93c1171d19142eef2355cf0de2',
        'Content-Type': 'application/json',
        Accept: 'application/json',
        onBehalfOf: req.body.onBehalfOf
    },
    body: {
        category: 'message',
        type: 'text',
        data: {text: req.body.text},
        receiver: req.body.receiver,
        receiverType: 'user'
    },
    json: true
    };

    request(options, function (error, response, body) {
    if (error) throw new Error(error);

    console.log(body);
    res.status(200).json(body)
    });
})


// an user can send similar message to multiple user
// this is as similar as cc in email 
// app.get("/sendMessagetoMultiple", (req, res) => {

//     const options = {
//     method: 'POST',
//     url: 'https://218520b4f9359d6f.api-us.cometchat.io/v3/messages',
//     headers: {
//         apiKey: 'e15689e71c946c93c1171d19142eef2355cf0de2',
//         'Content-Type': 'application/json',
//         Accept: 'application/json',
//         onBehalfOf: req.body.onBehalfOf
//     },
//     body: {
//         category: 'message',
//         type: 'text',
//         data: {text: req.body.text, metadata: {key1: 'value1', key2: 'value2'}},
//         multipleReceivers: {uids: ['id1', 'id4']}
//     },
//     json: true
//     };

//     request(options, function (error, response, body) {
//     if (error) throw new Error(error);

//     // console.log(body);
//     res.status(response.statusCode).json(body)
//     });

// })



// get all the messages from one user on behalf of other (individual message)
app.get("/getMessage", (req, res) => {

    const options = {
      method: 'GET',
      url: 'https://218520b4f9359d6f.api-us.cometchat.io/v3/users/'+ req.body.ofuser  + '/messages',
      headers: {
        apiKey: 'e15689e71c946c93c1171d19142eef2355cf0de2',
        'Content-Type': 'application/json',
        Accept: 'application/json',
        onBehalfOf: req.body.onBehalfOf
      }
    };
    
    request(options, function (error, response, body) {
      if (error) throw new Error(error);
    
    
      let newBody = JSON.parse(body)
    //   let BODY = newBody.data[0]
    //    console.log(typeof BODY)
      let arr = []
      for (let ele of newBody.data) { 
        let data = {
            id : ele.id,
            sender: ele.sender,
            receiver: ele.receiver,
            text: ele.data.text
        }

        arr.push(data)

      }
      return res.status(response.statusCode).json(arr)
    });
})


// View all the messages in the database    
app.get("/viewMessages", (req, res) => {
    const request = require('request');

    const options = {
    method: 'GET',
    url: 'https://218520b4f9359d6f.api-us.cometchat.io/v3/messages',
    headers: {
        apiKey: 'e15689e71c946c93c1171d19142eef2355cf0de2',
        'Content-Type': 'application/json',
        Accept: 'application/json'
    }
    };

    request(options, function (error, response, body) {
    if (error) throw new Error(error);

    console.log(body);
    let newBody = JSON.parse(body)
    return res.status(response.statusCode).json(newBody)
    });
})


//get all the list of conversation happening 
app.get("/ConversationList", (req, res) => {

    const options = {
    method: 'GET',
    url: 'https://218520b4f9359d6f.api-us.cometchat.io/v3/conversations',
    headers: {
        apiKey: 'e15689e71c946c93c1171d19142eef2355cf0de2',
        'Content-Type': 'application/json',
        Accept: 'application/json'
    }
    };

    request(options, function (error, response, body) {
    if (error) throw new Error(error);

    console.log(body);
    let newBody = JSON.parse(body)
        res.status(200).json(newBody)
    });
})

// get list of particular users conversation. 
app.get("/particularConversationList", (req, res) => {
    const request = require('request');

    const options = {
    method: 'GET',
    url: 'https://218520b4f9359d6f.api-us.cometchat.io/v3/conversations',
    headers: {
        apiKey: 'e15689e71c946c93c1171d19142eef2355cf0de2',
        'Content-Type': 'application/json',
        Accept: 'application/json',
        onBehalfOf: req.body.onBehalfOf
    }
    };

    request(options, function (error, response, body) {
    if (error) throw new Error(error);

    console.log(body);
    let newBody = JSON.parse(body)
    res.status(200).json(newBody)
    });
})






app.listen(port, () => {
  console.log(`Server has Started http://localhost:${port}/`);
});

