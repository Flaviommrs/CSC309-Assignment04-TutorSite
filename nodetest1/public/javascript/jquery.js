var uname = "";

function seeSched()
{
    if(uname != "")
    {
            window.location.href = '/weekView&username=' + uname;
    }
}
function seeMsg()
{
    //TODO!
}

function loadUser(username) {
    var request = $.ajax({
        method: "GET",
        url: "/username=" + username
    });

    request.done(function(msg) {
        var json = JSON.parse(msg);
        uname = json["username"];
        document.getElementById("name").innerHTML = "Name: " + json["name"];
        document.getElementById("occupation").innerHTML = "Occupation: " + json["occupation"];
        document.getElementById("education").innerHTML = "Education: " + json["education"];
        document.getElementById("experience").innerHTML = "Experience: " + json["experience"];
        document.getElementById("about").innerHTML = "About Me: " + json["about"];
        document.getElementById("rating").innerHTML = "Overall Rating: " + Number(json["sum_rating"]/json["rating_count"]).toFixed(2);
        document.getElementById("phone").innerHTML = "Phone Number: " + json["phone"];
        document.getElementById("email").innerHTML = "Email: " + json["email"];
        if(json["location"])
        {
            document.getElementById("location").innerHTML = "Location: " + json["location"]["city"] + ", " + json["location"]["country"];
        }
        else
        {
            document.getElementById("location").innerHTML = "Location: Unknown";
        }

        document.getElementById("tutoring").innerHTML = "Tutoring: " + json["subjects"];
        document.getElementById("rate").innerHTML = "Base Rate Per Hour: " + json["rate"];
    });
    request.fail(function( jqXHR, textStatus ) {
        alert( "Request failed: " + textStatus );
        uname = "";
    });
};

if(window.location.pathname.length > 18)
{
        loadUser(window.location.pathname.substring(18));
}
