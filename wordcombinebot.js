console.log("Twitter bot starting...");

var Twit = require('twit');
var config = require('./config');
var T = new Twit(config);

var params = {q: "#georgiatech", count: 1, result_type: "recent"}; 

//  Helper function to combine words
//  Both words must be atleast 3 in length
//  Searches the closest definition on Google, then combines the two.
function combineWords(word1, word2) {
	let combWord = "";
	combWord = word1.substring(0, 3) + word2.substring();
	return combWord;
}




// This function finds the latest tweet with the #mediaarts hashtag, and retweets it.
function retweetLikeLatest() {
	T.get('search/tweets', mediaArtsSearch, function (error, data) {
	  // log out any errors and responses
	  console.log(error, data);
	  // If our search request to the server had no errors...
	  if (!error) {
	  	// ...then we grab the ID of the tweet we want to retweet...
		var retweetLikeID = data.statuses[0].id_str;
		// ...and then we tell Twitter we want to retweet it!
		T.post('statuses/retweet/' + retweetLikeID, { }, function (error, response) {
			if (response) {
				console.log('Success! Check your bot, it should have retweeted something.')
			}
			// If there was an error with our Twitter call, we print it out here.
			if (error) {
				console.log('There was an error with Twitter:', error);
			}
		})
		T.post('favorites/create/' + retweetLikeID, { }, function (error, response) {
			if (response) {
				console.log('Success! Just liked a post')
			}
			if (error) {
				console.log('There was an error with Twitter:', error);
			}
		})
	  }
	  // However, if our original search request had an error, we want to print it out here.
	  else {
	  	console.log('There was an error with your hashtag search:', error);
	  }
	});
}

function postWord() {
	T.get('search/tweets', mediaArtsSearch, function (error, data) {
		console.log(error, data);
		if (!error) {
		  var postID = data.statuses[0].id_str;
		  var tweet = { status: combineWords("", "") + "This word was created at this time, on this tweet, by " + data.statuses[0].author }
		  T.post('statuses/update', tweet, function (error, response) {
			  if (response) {
				  console.log('Success! Check your bot, it should have posted something.')
			  }
			  if (error) {
				  console.log('There was an error with Twitter:', error);
			  }
		  })
		}
		else {
			console.log('There was an error with your hashtag search:', error);
		}
	});  
}

// Try to retweet something as soon as we run the program...
retweetLikeLatest();
// ...and then every hour after that. Time here is in milliseconds, so
// 1000 ms = 1 second, 1 sec * 60 = 1 min, 1 min * 60 = 1 hour --> 1000 * 60 * 60
setInterval(retweetLatest, 1000 * 60 * 60);
