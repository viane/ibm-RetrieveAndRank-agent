'use strict';
var http = require('http');
const https = require('https');
var path = require('path');
var express = require('express');
var fs = require('fs');
var bodyParser = require('body-parser');
var watson = require('watson-developer-cloud');
var qs = require('qs'); //  Use a querystring parser to encode output.

var router = express();
var server = http.createServer(router);
var root = __dirname;



router.use(bodyParser.json({
  limit: '50mb'
}));
router.use(bodyParser.urlencoded({
  limit: '50mb',
  extended: true
}));

// //init watson conversation service
// var conversation = watson.conversation({
//   username: 'fill your conversation service username id here',
//   password: 'fill your conversation service password here',
//   version: 'v1',
//   version_date: '2016-07-11'
// });
//
// var WorkspaceID = 'fill your workspace id here';
//
// //global conversation variables
// var dialog_stack = ["root"],
//   dialog_turn_counter = 1,
//   dialog_request_counter = 1;

router.get('/', function(req, res) {
  fs.readFile('index.html', 'utf8', function(err, data) {
    if (err) {
      return console.log(err);
    }
    res.status(200).send(data);
  });
});

router.get('/css/*', function(req, res) {
  res.sendfile(req.path, {
    'root': root
  }, function(err) {
    if (err) {
      console.log(err);
      res.status(err.status).end();
    }
    else {
      console.log('Sent:', req.path);
    }
  });
});

router.get('/fonts/*', function(req, res) {
  res.sendfile(req.path, {
    'root': root
  }, function(err) {
    if (err) {
      console.log(err);
      res.status(err.status).end();
    }
    else {
      console.log('Sent:', req.path);
    }
  });
});

router.get('/js/*', function(req, res) {
  res.sendfile(req.path, {
    'root': root
  }, function(err) {
    if (err) {
      console.log(err);
      res.status(err.status).end();
    }
    else {
      console.log('Sent:', req.path);
    }
  });
});

router.get('/img/*', function(req, res) {
  res.sendfile(req.path, {
    'root': root
  }, function(err) {
    if (err) {
      pmt(err);
      res.status(err.status).end();
    }
    else {
      console.log('Sent:', req.path);
    }
  });
});

//getting serice credentials from local json file
var crendtials = JSON.parse(fs.readFileSync('credentials.json', 'utf8'));

var retrieve_and_rank = watson.retrieve_and_rank({
  username: crendtials.retrieve_and_rank.username,
  password: crendtials.retrieve_and_rank.password,
  version: 'v1'
});
var ranker_id = crendtials.retrieve_and_rank.ranker_id;

var rrparams = {
  cluster_id: crendtials.rrparams.cluster_id,
  collection_name: crendtials.rrparams.collection_name
};

var solrClient = retrieve_and_rank.createSolrClient(rrparams);

router.get("/query", function(req, res) {
  //store what user submit
  var queryString = req.query.input;
  console.log("client asked: " + queryString);

  ///////////////////////////
  //Conversation service
  ///////////////////////////

  // conversation.message({
  //   input: {
  //     "text": queryString
  //   },
  //   context: {
  //     "conversation_id": "1",
  //     "system": {
  //       "dialog_stack": dialog_stack,
  //       "dialog_turn_counter": dialog_turn_counter,
  //       "dialog_request_counter": dialog_request_counter
  //     }
  //   },
  //   workspace_id: WorkspaceID
  // }, function(err, response) {
  //   if (err) {
  //     console.log('error:', err);
  //   }
  //   else {
  //     //handle conversation responds
  //     var conversationResponseText = response.output.text[0]; //response text is always in a array
  //
  //     res.send({
  //         "status": 'conversation',
  //         "result": response.output.text
  //       });

  //     //update dialog path
  //     dialog_stack = response.context.system.dialog_stack;
  //     dialog_turn_counter = response.context.system.dialog_turn_counter;
  //     dialog_request_counter = response.context.system.dialog_request_counter;
  //   }
  // });

            /////////////////////////////////////
            // retrieve and rank
            /////////////////////////////////////

            var query = qs.stringify({
              q: queryString,
              ranker_id: ranker_id,
              fl: 'id,answer_id,score,confidence,title,body'
            });
            solrClient.get('fcselect', query, function(err, searchResponse) {
              if (err) {
                console.log(err);
              }
              else {
                console.log(JSON.stringify(searchResponse.response.docs, null, 2));
                res.send({
                  "status": 'retrive_and_rank',
                  "result": searchResponse
                });
              }
            });
});



server.listen(process.env.PORT || 3000, process.env.IP || "localhost", function() {
  var addr = server.address();
  console.log("Chat server listening at", addr.address + ":" + addr.port);
});
