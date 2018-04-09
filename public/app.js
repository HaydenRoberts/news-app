$(document).ready(function () {
    $.ajax({
        method: "GET",
        url: "/scrape"
    })
        .then(function (data) {
            console.log("scrape complete")
            $.ajax({
                method: "GET",
                url: "/articles"
            })
                .then(function (data) {
                    console.log(data);
                    for (let i = 0; i < data.length; i++) {
                        // $("#articles").append("<p data-id='" + data[i]._id + "'>" + data[i].title + "<br>" + data[i].summary + "<br /></p>" + "<a href='https://www.bbc.com" + data[i].link + "' target='_blank'>Link");

                        const newArticleDiv = $("<div>").addClass("article");

                        const newTitleDiv = $("<div>").addClass("title");
                        $(newTitleDiv).text(data[i].headline)
                        $(newTitleDiv).wrapInner('<a target="_blank" href= https://www.bbc.com' + data[i].link + '></a>')
                        $(newArticleDiv).append(newTitleDiv);

                        const newSaveButtonDiv = $("<div>").addClass("note-button");
                        $(newSaveButtonDiv).text("Add Note");
                        $(newSaveButtonDiv).attr("data-id", data[i]._id)
                        $(newArticleDiv).append(newSaveButtonDiv);

                        const newDescriptionDiv = $("<div>").addClass("description");
                        if (data[i].summary === '') {
                            $(newDescriptionDiv).text("No description available.")
                        } else {
                            $(newDescriptionDiv).text(data[i].summary)
                        }
                        $(newArticleDiv).append(newDescriptionDiv);

                        $("#articles").append(newArticleDiv);
                    }
                });
        })

    $(document).on("click", ".note-button", function () {
        $("#notes").empty();
        console.log("HERE I AM!")

        var articleId = $(this).attr("data-id");

        $.ajax({
            method: "GET",
            url: "/articles/" + articleId
        })

            .then(function (data) {
                console.log(data);
              
                var noteDiv = $("<div>").addClass("notes")

                $(noteDiv).append("<h3>" + data.headline + "</h3>");
                $(noteDiv).append("<h4>Title</h4><input id='titleinput' name='title' label=title>");
                $(noteDiv).append("<h4>Note</h4><textarea id='bodyinput' name='body'></textarea>");
                $(noteDiv).append("<button data-id='" + data._id + "' id='savenote'>Save Note</button>");

                $("#notes").append(noteDiv);
                // If there's already a note
                if (data.note) {
                    // Place the title of the note in the title input
                    $("#titleinput").val(data.note.title);
                    // Place the body of the note in the body textarea
                    $("#bodyinput").val(data.note.body);
                }
            });
    });

    $(document).on("click", "#savenote", function () {
        // Grab the id associated with the article from the submit button
        var articleId = $(this).attr("data-id");
  
        // Run a POST request to change the note, using what's entered in the inputs
        $.ajax({
          method: "POST",
          url: "/articles/" + articleId,
          data: {
            // Value taken from title input
            title: $("#titleinput").val(),
            // Value taken from note textarea
            body: $("#bodyinput").val()
          }
        })
          // With that done
          .then(function (data) {
            // Log the response
            console.log(data);
            // Empty the notes section
            $("#notes").empty();
          });
  
        // Also, remove the values entered in the input and textarea for note entry
        $("#titleinput").val("");
        $("#bodyinput").val("");
      });
  
})