
// Here we are 'requiring' the whole express library and assigning it to the variable 'express'
// (https://expressjs.com/)
var express = require('express');
// Now we run the express function (this is why there are the '()' after 'express')
var app = express();
// Now we create the 'server' and pass it the instance of the express app we created
var server = require('http').createServer(app);

// We have to explicitly define where the html is going to be. This is how it's done with Express.
// Note: The bigger web frameworks (Rails, Django etc) have all of this configured for you so it's much 'easier'.
// However, you also don't know 100% what's going on so it can seem quite 'magical'.
app.use(express.static(__dirname + '/views'));

// We need to tell our web server what it needs to do! Here, we are saying that when a user goes to the 'root' of our website,
// just '/', then as part of the response action, 'render' the html named named 'index'. Express knows where to find this as we defined it above!
app.get('/', function(request, response) {
	response.render('index');
});

// Finally, listen for incoming connections on port 4567 and log out a message. This means that you need to go to localhost:4567 to see the site
server.listen(4567);
console.log('Server started on 4567');

// You could stop here and have a fully functioning webiste that you could work on. Perhaps add some more 'views' and 'routes'?
// How would you add an about page to the website? Give it a go!

// In order to get the tweets from twitter displaying on the page in realtime, we need to use websockets.
// One library we can use is from socket.io. We need to 'require' it again and pass it an instance of our server so it knows where to send stuff to/from.
var io = require('socket.io')(server);

// Then we need to get the tweets from the twitter api. We can use another library for this!
var Twit = require('twit');
// We instantiate a new instance of 'Twit' and pass it our credentials so we can access tweets.
// But we need credentials. You can set up a fake twitter account using a random email address.
// Then go to https://apps.twitter.com and create a new 'app'.
// - Name: tweet-streamer
// - Description: Small app to stream tweets from twitter.
// - Website: http://127.0.1.1

// Navigate to 'Keys and Access Tokens' and copy the keys and generate 'Your Access Token' and instantiate new Twit object.
var twitter = new Twit({
  consumer_key: 'YOUR KEY HERE',
  consumer_secret: 'YOUR SECRET HERE',
  access_token: 'YOUR TOKEN HERE',
  access_token_secret: 'YOU SECRET HERE'
});

// Then we create a new 'stream' with some parameters.
// The first is a selection of filtered statuses (tweets).
// The second (track), is the keyword we want to search on.
// Check out for more options and config. https://github.com/ttezel/twit
var stream = twitter.stream('statuses/filter', { track: 'trump' });

// Finally, we create the socket server connection and emit the tweets.
// Anything in here happens when a 'client' connects to the websocket server
io.on('connect', function(socket) {
  // Then when a new tweets comes from the 'stream'
	stream.on('tweet', function(tweet) {
    // 'emit' (send down the channel to the client) on the 'tweets' channel, the 'tweet'
		socket.emit('tweets', tweet);
	});
});
