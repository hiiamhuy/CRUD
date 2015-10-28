$(document).ready(function() {
    // Initialize Parse app
    var appID = 'hMvgCLXYrdakeP0sr2j5xrlwE1oFFRdb9RXHrDJ1';
    var jID = '8gJBej9kAQGp0L4RCZhxCOrkOAjZe3lIv88fLAgb';
    Parse.initialize(appID, jID);

    // Create a new sub-class of the Parse.Object, with name "Review"
    var Review = Parse.Object.extend('Review');

    $("#rating").raty();

    // Saves data into parse
    $('form').submit(function() {
        // Create a new instance of Review class 
        var reviews = new Review();
        var reviewTitle = $("#review-title");
        var reviewDesc = $("#review-desc");
      
        reviews.set("title", reviewTitle.val());
        reviews.set("description", reviewDesc.val());
        reviews.set("rating", parseInt($("#rating").raty('score')));

        reviews.set("totalVotes", 0);
        reviews.set("likeVotes", 0);

        reviews.save(null, {
            success: function() {
                reviewTitle.val("");
                reviewDesc.val("");
                $("#rating").raty({
                    score: 0
                });
                getData();
            }
        });
        return false
    });

    var getData = function() {
        var query = new Parse.Query(Review)
        query.find({
            success: function(results) {
                buildList(results)
            }
        })
    }

    // A function to build your list
    var buildList = function(data) {
        // Empty out your ordered list
        $('ol').empty()
        var rating = 0;
        // Loop through data, and pass each element to the addItem function
        data.forEach(function(element) {
            rating += element.get("rating");
            addItem(element);
        })
        $("#avgrating").raty({
            score: rating / data.length,
            readOnly: true,
        });

    }

    // This function takes in an item, adds it to the screen
    var addItem = function(item) {
        var title = item.get('title');
        var description = item.get('description');
        var rating = item.get('rating');
        var totalVotes = item.get('totalVotes');
        var likeVotes = item.get('likeVotes');

        var li = $("<li></li>");
        var divRate = $("<div>");
        var h5 = $("<h5>");
        var thumbsUp = $("<button class='voting'><span class='glyphicon glyphicon-thumbs-up'></span></button>");
        var thumbsDown = $("<button class='voting'><span class='glyphicon glyphicon-thumbs-down'></span></button>");
        var h6 = $("<h6>");
        var h7 = $("<h7>");
        var votes = $("<p>");
        // Create a button with a <span> element (using bootstrap class to show the X)
        var button = $('<button class="btn-danger btn-xs"><span class="glyphicon glyphicon-remove"></span></button>')

        // Click function on the button to destroy the item, then re-call getData
        button.click(function() {
            item.destroy({
                success: getData
            })
        })
        thumbsUp.click(function() {
            item.set('totalVotes', totalVotes += 1);
            item.set('likeVotes', likeVotes += 1);
            item.save();
            getData();
        })

        thumbsDown.click(function() {
            item.set('totalVotes', totalVotes += 1);
            item.save();
            getData();
        })
        h5.text(title);
        h6.text(description);
        votes.text(likeVotes + " out of " + totalVotes + " found this helpful ");

        h7.append(thumbsUp);
        h7.append(thumbsDown);
        h7.append(button);

        $('ol').append(h5, h6, h7, votes, divRate);

        divRate.raty({
            score: rating,
            readOnly: true
        });
    }
    // Call your getData function when the page loads
    getData()

});