$(document).ready(function() {
// Initialize Parse app
var appID = 'hMvgCLXYrdakeP0sr2j5xrlwE1oFFRdb9RXHrDJ1';
var jID = '8gJBej9kAQGp0L4RCZhxCOrkOAjZe3lIv88fLAgb';
Parse.initialize(appID, jID);

// Create a new sub-class of the Parse.Object, with name "Music"
var Review = Parse.Object.extend('Review');

$("#rating").raty();

// Saves data into parse
$('form').submit(function() {

	// Create a new instance of your Review class 
	var reviews = new Review();
	var reviewTitle = $("#review-title")
	var reviewDesc = $("#review-desc")
	// For each input element, set a property of your new instance equal to the input's value
	reviews.set("title", reviewTitle.val());
	reviews.set("description", reviewDesc.val());
	reviews.set("rating", int($("#rating").raty('score')));

	reviews.set("totalVotes", 0);
	reviews.set("likeVotes", 0);

	// After setting each property, save your new instance back to your database
	reviews.save(null, {
		success:getData
	})
	return false
});

// Write a function to get data
var getData = function() {
	// Set up a new query for Review class
	var query = new Parse.Query(Review)
	// Set a parameter for your query -- where the website property isn't missing
	query.notEqualTo('review_desc', '')

	/* Execute the query using ".find".  When successful:
	    - Pass the returned data into your buildList function
	*/
	query.find({
		success:function(results) {
			buildList(results)
		} 
	})
}

// A function to build your list
var buildList = function(data) {
	// Empty out your ordered list
	$('ol').empty()

	// Loop through your data, and pass each element to the addItem function
	data.forEach(function(d){
		addItem(d);
	})
}


// This function takes in an item, adds it to the screen
var addItem = function(item) {
	// Get parameters (website, band, song) from the data item passed to the function
	var website = item.get('website')
	var band = item.get('band')
	var song = item.get('song')
	
	// Append li that includes text from the data item
	var li = $('<li>Check out ' + band + ', their best song is ' + song + '</li>')
	
	// Create a button with a <span> element (using bootstrap class to show the X)
	var button = $('<button class="btn-danger btn-xs"><span class="glyphicon glyphicon-remove"></span></button>')
	
	// Click function on the button to destroy the item, then re-call getData
	button.click(function() {
		item.destroy({
			success:getData
		})
	})

	// Append the button to the li, then the li to the ol
	li.append(button);
	$('ol').append(li)
	
}

// Call your getData function when the page loads
getData()

});