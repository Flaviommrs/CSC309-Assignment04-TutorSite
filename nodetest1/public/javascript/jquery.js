function loadUser(username) {
    var request = $.ajax({ 
        method: "GET",
        url: "http://127.0.0.1:3000/username=" + username
    });

    request.done(function(msg) {
        var json = JSON.parse(msg);
        document.getElementById("name").innerHTML = "Name: " + json["name"];
        document.getElementById("occupation").innerHTML = "Occupation: " + json["occupation"];
        document.getElementById("education").innerHTML = "Education: " + json["education"];
        document.getElementById("experience").innerHTML = "Experience: " + json["experience"];
        document.getElementById("about").innerHTML = "About Me: " + json["about"];
        document.getElementById("rating").innerHTML = "Overall Rating: " + Number(json["sum_rating"]/json["rating_count"]).toFixed(2);
        document.getElementById("phone").innerHTML = "Phone Number: " + json["phone"];
        document.getElementById("email").innerHTML = "Email: " + json["email"];
        document.getElementById("location").innerHTML = "Location: " + json["location"]["city"] + ", " + json["location"]["country"];
        var string = " ";
        for (var sub in json["subjects"]) {
            string += sub + ","
        }
        document.getElementById("tutoring").innerHTML = "Tutoring:" + string.substring(0,length(string)-1);
        document.getElementById("rate").innerHTML = "Base Rate Per Hour: " + json["rate"];
    });
    request.fail(function( jqXHR, textStatus ) {
        alert( "Request failed: " + textStatus );
    });
};

loadUser(window.location.pathname.substring(18));
