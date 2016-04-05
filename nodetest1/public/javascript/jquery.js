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

function loadReviews(username) {
    document.getElementById("reviews").innerHTML += `<p>REVIEWS</p>`
    for (review in [1,2]){
        var string = `<div class="review">
                <div class="inline review-content">
                    <div class="leftreview">
                        <img id="reviewpic" src="/images/profile.jpg" alt="Profile Picture">
                    </div>
                    <div class="rightreview">
                        <p>Rating: ...</p>
                        <p>(THE REVIEW)</p>
                    </div>
                </div>
                <div>
                    <p>SpongeBob SquarePants</p>
                </div>
                <div class="right">
                    <button class="ratereview">Useful</button>
                    <button class="ratereview">Not Useful</button>
                </div>
            </div>`
        document.getElementById("reviews").innerHTML += string
    }
}

if(window.location.pathname.length > 18)
{
    loadUser(window.location.pathname.substring(18));
    loadReviews(window.location.pathname.substring(18));
}
