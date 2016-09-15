# ibm-conversation-agent

A simple virtual agent template that uses IBM conversation API.

## Setup

>Fill the credentials for init watson conversation service

```javascript
//Server.js

//Conversation Service Credentials
var conversation = watson.conversation({
  username: 'fill your conversation service username id here',
  password: 'fill your conversation service password here',
  version: 'v1',
  version_date: '2016-07-11'
});

//Conversation workspace_id
var WorkspaceID = 'fill your workspace id here';
```

### Installation
ibm-conversation-agent requires [Node.js](https://nodejs.org/) to run.

Install the dependencies and devDependencies and start the server.

```sh
$ cd ibm-conversation-agent
$ npm install -d
$ node server
```
Goto [localhost:3000](127.0.0.1:3000/)
