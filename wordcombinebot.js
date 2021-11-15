console.log("Twitter bot starting...");

var Twit = require('twit');
var config = require('./config');
var T = new Twit(config);


//Word bank for nouns, verbs, adjectives
var noun = ["cat", "bee", "person", "firefighter", "musician", "marathon runner", "apple", "ice", "raincoat", "egg", "yak", "oil", "ghost", "bread", "cabinet", "poetry",
 "software", "tooth", "user", "year", "xylophone"];
var verb = ["run", "dance", "award", "travel", "reinforce", "study", "adopt", "behave", "drag", "deny", "offer", "repair", "forbid", "explore", "beat", "appear", "weep", 
"whip", "tolerate", "slip", "smell"];
var adjective = ["happy", "sad", "creative", "fun", "political", "bad", "medical", "physical", "democratic", "republican", "popular", "dank", "local", "amusing", "raspy", 
"juvenile", "exuberant"];

var params = {q: "#UGA", count: 1, result_type: "recent"}; 
var mentions = {q: "@MashupTB", count: 1, result_type: "recent"}; 

//  Helper function to combine words
//  Both words must be atleast 3 in length
//  Searches the closest definition on Google, then combines the two.
function combineWords(text) {
	//  Feel free to change the functionality of these functions, my idea of making this simple is 
	//  creating words from the first and last three letters of the tweet
	/*let combWord = "";
	for (var i = 0; i < text.length; i++) {
		if (text[i] == " ") {
			break;
		}
		combWord += text[i];
	}
	let reverseWord = "";
	for (var i = text.length - 1; i > 0; i--) {
		if (text[i] == " ") {
			break;
		}
		reverseWord += text[i];
	}

	for (var i = 0; i < reverseWord.length; i++) {
		combWord += reverseWord[reverseWord.length - i];
	}*/
	var combWord = "";
	const textArray = text.split(" ");
	
	for (let i = 0; i < textArray.length; i++) {
		if (textArray[i].indexOf("#") != -1) {
			textArray[i] = textArray[i].substring(textArray[i].indexOf("#") + 1);
		} else if (textArray[i].indexOf("\n") != -1) {
			textArray[i] = textArray[i].substring(textArray[i].indexOf("\n") + 1);
		}
	}
	console.log(textArray);

	combWord = textArray[getRandomInt(1, textArray.length - 1)] + textArray[getRandomInt(1, textArray.length - 1)].toLowerCase();


	combWord += ("\n" + combineDefinitions());
	return combWord;
}
function combineDefinitions() {
	// Get google definition, splice them together.
	// Idk how to get google definitions, so I would prefer someone else write this.
	// Or: Create a word bank and randomly select from
	// Noun: "noun: A" + [noun] + " that " + " is " + [adjective]
	// Verb: "verb: To " + [verb] + " in a very " + [adjective] + "way"
	// Adjective: "adjective: To be " + ["very"/"slightly"/"not"] + [adjective] + " in a " + [adjective] + " way."
	var chooseType = getRandomInt(1, 13);
	if (chooseType == 1) {
		return "Noun: A " + noun[getRandomInt(0, noun.length - 1)] + " that is " + adjective[getRandomInt(0, noun.length - 1)] + ".";
	} else if (chooseType == 2) {
		return "Verb: To " + verb[getRandomInt(0, verb.length - 1)] + " in a very " + adjective[getRandomInt(0, verb.length - 1)] + " way.";
	} else if (chooseType == 3) {
		var chooseModifier = getRandomInt(1, 2);
		var modifier = "";
		if (chooseModifier == 1) {
			modifier = "very ";
		} else {
			modifier = "slightly ";
		}
		return "Adjective: To be " + modifier + adjective[getRandomInt(0, adjective.length - 1)] + " in a " + adjective[getRandomInt(0, adjective.length - 1)] + " way.";
	} else if (chooseType == 4) {
		return "Noun: A(n) " + adjective[getRandomInt(0, adjective.length - 1)]+ " " + noun[getRandomInt(0, noun.length - 1)] + " that " + verb[getRandomInt(0, verb.length - 1)] + "s.";
	} else if (chooseType == 5) {
		var chooseNorV = getRandomInt(1, 2);
		var norV = "";
		if (chooseNorV == 1) {
			norV = noun[getRandomInt(0, noun.length - 1)];
			return "Noun: A fancy way to say " + norV + "."
		} else {
			norV = verb[getRandomInt(0, verb.length - 1)];
			return "Verb: A fancy way to say " + norV + "."
		}
	} else if (chooseType == 6) {
		return "Noun: A world renown " + noun[getRandomInt(0, noun.length - 1)] + " sometimes seen committing " + verb[getRandomInt(0, verb.length - 1)] + ".";
	} else if (chooseType == 7) {
		return "Adjective: Of or pertaining to " + noun[getRandomInt(0, noun.length - 1)] + ".";
	} else if (chooseType == 8) {
		return "See " + noun[getRandomInt(0, noun.length - 1)];
	} else if (chooseType == 9) {
		return "Verb: When someone tries to introduce " + noun[getRandomInt(0, noun.length - 1)] + " as a new form of pigment.";
	} else if (chooseType == 10) {
		return "Gerund: " + verb[getRandomInt(0, verb.length - 1)] + "ing.";
	} else if (chooseType == 11) {
		return "Noun: Tissue composed of " + adjective[getRandomInt(0, adjective.length - 1)] + " cells.";
	} else if (chooseType == 12) {
		return "Adjective: Said in a " + adjective[getRandomInt(0, adjective.length - 1)] + " manner that often comes off " + adjective[getRandomInt(0, adjective.length - 1)] + ".";
	} else {
		return "Adjective: Situated near " + noun[getRandomInt(0, noun.length - 1)] + " that often leads to " + noun[getRandomInt(0, noun.length - 1)] + ".";
	}
}
// Helper function for generating a random integer from min to max (inclusive)
function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

var stream = T.stream('statuses/filter', { track : '@MashupTB'});
stream.on('tweet', tweetReply);
function tweetReply(eventMsg) {
	var replyName = eventMsg.in_reply_to_screen_name;
	var tweetedText = eventMsg.text;
	var user = eventMsg.screen_name;
	if (replyName == "MashupTB" || tweetText.includes("MashupTB")) {
		var response = "Word: " + combineWords(tweetedText) + '\nThanks for mentioning me: ' + user + "!\nDefinition: A really cool person!";
		// Post that tweet!
		T.post('statuses/update', { status: response }, tweeted);
		function tweeted(err, data, response) {
			if (err) {
				console.log("Replying failed.");
			} else {
				console.log("Replying successful.");
			}
		}	
		console.log('I was followed by: ' +  + ' @' + user);
	}
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
		/*T.post('statuses/retweet/' + tweetID, { }, 
			function(error, data, response) {
				console.log('Successfully retweeted.');
			}
		)*/
		T.post('favorites/create/', {id:tweetID},
			function(err, data, response) {
				console.log('Successfully liked a post.');
			}
		)

		//  Creates the string that has combined the two words. T.post() function creates the post.
		if (tweetText.substring(0, 2) == "RT") {
			for (let i = 4; i < tweetText.indexOf(":"); i++) {
				tweetUser += tweetText.substring(i, i++);
			}
		}
		tweetToPost = { status: "Word: " + combineWords(tweetText) + "\nThis word was created at this time, on this tweet, by user: " + tweetUser }
		T.post('statuses/update', tweetToPost, tweeted);
		function tweeted(err, data, response) {
			if (err) {
				console.log("Posting failed.");
			} else {
				console.log("Posting successful.");
			}
		}	
	}

	/*//Used to reply to mentions
	T.get('search/tweets', mentions, gotMentionData);
	function gotMentionData(err, data, response) {
		console.log(data.statuses[0].text);
		var tweetText = data.statuses[0].text;
		console.log(data.statuses[0].id_str);
		var tweetID = data.statuses[0].id_str;
		console.log(data.statuses[0].user.screen_name);
		var tweetUser = data.statuses[0].user.screen_name;

		//  Retweets and likes the post
		T.post('statuses/retweet/' + tweetID, { }, 
			function(error, data, response) {
				console.log('Successfully retweeted.');
			}
		)
		T.post('favorites/create/', {id:tweetID},
			function(err, data, response) {
				console.log('Successfully liked a post.');
			}
		)

		//  Creates the string that has combined the two words. T.post() function creates the post.
		tweetToPost = { status: "Word: " + combineWords(tweetText) + "\nThis word was created at this time, on this tweet, by user: @" + tweetUser + "\nThank you for mentioning us!"}
		T.post('statuses/update', tweetToPost, tweeted);
		function tweeted(err, data, response) {
			if (err) {
				console.log("Posting failed.");
			} else {
				console.log("Posting successful.");
			}
		}	
	}*/
}

// Try to retweet something as soon as we run the program...
runBot();
// ...and then every hour after that. Time here is in milliseconds, so
// 1000 ms = 1 second, 1 sec * 60 = 1 min, 1 min * 60 = 1 hour --> 1000 * 60 * 60
//setInterval(runBot, 1000 * 60);