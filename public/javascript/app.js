$.ajax({
    url: "/articles",
    method: "GET"
}).then(function (response) {
    for (let i = 0; i < 15; i++) {
        $(".articles").append(
            "<div class='card'>" +
            "<div class='card-header'>" + response[i].headline + "</div>" +
            "<div class='card-body'>" +
            "<p class='card-text'>" + response[i].summary + "</p>" +
            "<button type='button' artId='" + response[i]._id + "' class='btn btn-dark' id='savebtn'>Save Article</button>" +
            "<a href='" + response[i].url + "' class='btn btn-primary'>Visit Site</a>" +
            "</div>" +
            "</div>"
        );
    };
});

$.ajax({
    url: "/saved",
    method: "GET"
}).then(function (response) {
    for (let i = 0; i < response.length; i++) {
        $(".savedArticles").append(
            "<div class='card'>" +
            "<div class='card-header'>" + response[i].headline + "</div>" +
            "<div class='card-body'>" +
            "<p class='card-text'>" + response[i].summary + "</p>" +
            "<button type='button' artId='" + response[i]._id + "' class='btn btn-danger' id='removebtn'>Remove From Saved</button>" +
            "<button type='button' artId='" + response[i]._id + "' class='btn btn-dark' id='comment'>Comment</button>" +
            "<a href='" + response[i].url + "' class='btn btn-dark'>Visit Site</a>" +
            "</div>" +
            "</div>"
        );
    };
    console.log(response[0])
});

$("#scrape").on("click", function () {
    $.ajax({
        url: "/scrape",
        method: "GET"
    }).then(function (response) {
        window.location.reload();
    })
});

$("#saved").on("click", function () {
    $.ajax({
        url: "/saved",
        method: "GET"
    }).then(function (response) {
        window.location.reload();
    })
});

$(document).on("click", "#savebtn", function () {
    artId = $(this).attr("artId");

    $.ajax({
        url: "/saved/" + artId,
        method: "POST"
    }).then(function (response) {
        console.log(response);
        window.location.reload();
    })
});

$(document).on("click", "#removebtn", function () {
    artId = $(this).attr("artId");

    $.ajax({
        url: "/remove/" + artId,
        method: "POST"
    }).then(function (response) {
        console.log(response);
        window.location.reload();
    })
});

$(document).on("click", "#comment", function () {
    artId = $(this).attr("artId");
    console.log(artId);
    $("#modalpopup").modal();

    $.ajax({
        method: "GET",
        url: "/articles/" + artId
    })
    .then(function(data) {
        if (typeof data.comment !== "undefined") {

            doctitle = data.comment.title;
            docbody = data.comment.body;
        } else {
            doctitle = "Empty";
            docbody = "Empty";
        }
        $(".commentform").append(
        "<form>" +
        "<div class='form-group'>" +
        "<input type='text' class='form-control' id='newtitle' placeholder='Title'>" +
        "</div>" +
        "<div class='form-group'>" +
        "<input type='text' class='form-control' id='newcomment' placeholder='Comment'>" +
        "</div>" +
        "<button type='submit' artId='" + data._id + "' id='commentbtn' class='btn btn-dark'>Save Comment</button>" +
        "</form>" +

        "<div class='card'>" +
        "<div class='card-header'>'" + doctitle + "'</div></div>" +
        "<div class='card-body'>" +
        "<p class='card-text'>'" + docbody + "'</p>" +
        "</div>" +
        "</div>" +
        "</div>"
    )
    console.log(data.comment.title);
    })
    
});

$(document).on("click", "#commentbtn", function() {
    var artId = $(this).attr("artId");
    console.log($("#newtitle").val());
    $.ajax({
        method: "POST",
        url: '/articles/' + artId,
        data: {
            title: $("#newtitle").val(),
            body: $("#newcomment").val()
        }
    })
    .then(function(data) {
        console.log(data)
    })

})

$("#closebtn").on("click", function() {
    window.location.reload();
})

