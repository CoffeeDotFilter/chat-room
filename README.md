# chatters and coders


[![Build Status](https://travis-ci.org/CoffeeDotFilter/chat-room.svg?branch=master)](https://travis-ci.org/threeLoops/chat-room)
[![codecov.io](https://codecov.io/github/CoffeeDotFilter/chat-room/coverage.svg?branch=master)](https://codecov.io/github/threeLoops/chat-room?branch=master)
[![Codecrystal](https://img.shields.io/badge/code-crystal-5CB3FF.svg)](http://codecrystal.herokuapp.com/crystalise/CoffeeDotFilter/chat-room/master)
[![Dependency Status](https://david-dm.org/CoffeeDotFilter/chat-room.svg)](https://david-dm.org/threeloops/chat-room)
[![devDependency Status](https://david-dm.org/CoffeeDotFilter/chat-room/dev-status.svg)](https://david-dm.org/threeloops/chat-room#info=devDependencies)

Chatters and coders is a realtime chat application built with node.js, socket.io and redis. It lets you edit code whilst chatting to your friends!

[Try out our app](https://chatters-coders.herokuapp.com/)

### Why?

Because it's great to chat in realtime! And socket.io makes this possible by emitting events over a web socket that can be listened to on the server and any other connected clients. Magic! :tada::tada:


### How?

+ the user will login on the first screen:

<img width="895" alt="screen shot 2016-02-26 at 12 13 24" src="https://cloud.githubusercontent.com/assets/14013616/13352007/657f8342-dc82-11e5-9bd6-edb85cbd8584.png">

+ this will store the users name on the client side js
+ Sockets on the client and server will then relay chat messages back and forth in the chat boxes and the collaborative code editor

<img width="992" alt="screen shot 2016-02-26 at 12 16 04" src="https://cloud.githubusercontent.com/assets/14013616/13352088/e92b00c2-dc82-11e5-8edc-ad127de5c285.png">

+ Redis will store the chat messages and current code editor content so the data is consistent when a new user logs on

### How?

You can see our app in action on [heroku](https://chatters-coders.herokuapp.com/)

Or you can run it locally

clone the repo with `git clone https://github.com/threeLoops/chat-room.git` and run
```
$ npm install
```
to install the dependencies.

Make sure you have redis installed (mac users with homebrew can run `brew install redis`) and start a redis server with

```
$ redis-server
```

Then start the node server with

```
$ npm start
```

Visit `localhost:3000` to see the app running and make all the changes you want!


These are some initial sketches:

![readme chatroom copy](https://cloud.githubusercontent.com/assets/14013616/13260413/3d45b792-da53-11e5-81c2-45e0c24bccd7.jpg)

![photo 23-02-2016 17 23 43](https://cloud.githubusercontent.com/assets/14013616/13260383/154fb9e0-da53-11e5-9c96-a21ac52ece42.jpg)

![photo 23-02-2016 17 23 58](https://cloud.githubusercontent.com/assets/14013616/13260384/15610290-da53-11e5-9033-809f0ae50837.jpg)
