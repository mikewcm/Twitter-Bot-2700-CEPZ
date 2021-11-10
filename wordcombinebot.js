console.log("Twitter bot starting...");

var Twit = require('twit');
var config = require('./config');
var T = new Twit(config);

var params = {q: "#georgiatech", count: 1, result_type: "recent"}; 

//  Helper function to combine words
//  Both words must be atleast 3 in length
//  Searches the closest definition on Google, then combines the two.
function combineWords(word1, word2) {
	//  Feel free to change the functionality of these functions, my idea of making this simple is 
	//  creating words from the first and last three letters of the tweet
	let combWord = "";
	combWord = word1.substring(0, 4) + word2.substring(word2.length - 3, word2.length);
	//combWord += ("\n" + combineDefinitions(word1, word2));
	return combWord;
}
function combineDefinitions(word1, word2) {
	// Get google definition, splice them together.
	// Idk how to get google definitions, so I would prefer someone else write this.
}


var stream = T.stream('user')
// When someone follows the user
stream.on('follow', followed)
function followed (event) {
	var name = event.source.name
	var screenName = event.source.screen_name
	var response = 'Thanks for following me: ' + name.substring(0, 2) + name + "\nDefinition: A really cool person!";
	// Post that tweet!
	T.post('statuses/update', { status: response }, tweeted)
  
	console.log('I was followed by: ' + name + ' @' + screenName)
  }

function runBot() {
	//  Gets the tweet, text, ID, and username
	T.get('search/tweets', params, gotData);
	function gotData(err, data, response) {
		console.log(data.statuses[0].text);
		var tweetText = data.statuses[0].text;
		console.log(data.statuses[0].id_str);
		var tweetID = data.statuses[0].id_str;
		console.log(data.statuses[0].user.screen_name);
		var tweetUser = data.statuses[0].user.screen_name;

		//  Retweets and likes the post
		T.post('statuses/retweet/', tweetID, { }, 
			function(error, data, response) {
				console.log('Successfully retweeted.');
			}
		)
		T.post('favorites/create/', {id: tweetID},
			function(err, data, response) {
				console.log('Successfully liked a post.');
			}
		)

		//  Creates the string that has combined the two words. T.post() function creates the post.
		tweetToPost = { status: combineWords(tweetText, tweetText) + "\nThis word was created at this time, on this tweet, by user: " + tweetUser }
		T.post('statuses/update', tweetToPost, tweeted);
		function tweeted(err, data, response) {
			if (err) {
				console.log("Posting failed.");
			} else {
				console.log("Posting successful.");
			}
		}	
	}
}

// Try to retweet something as soon as we run the program...
runBot();
// ...and then every hour after that. Time here is in milliseconds, so
// 1000 ms = 1 second, 1 sec * 60 = 1 min, 1 min * 60 = 1 hour --> 1000 * 60 * 60
setInterval(retweetLatest, 1000 * 60 * 60);
