$(document).ready(function(){
    $.ajax({
        method: "GET",
        url: "/scrape"
      }).then(function(){
        $.getJSON("/articles", function(data) {
            console.log("test");
            console.log(data);
            // For each one
            for (var i = 0; i < data.length; i++) {
              // Display the apropos information on the page
              $("#articles").append("<p data-id='" + data[i]._id + "'>" + data[i].title + "<br />" + data[i].link + "</p>");
            }
          });  
    })
})