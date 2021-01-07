$(document).ready(function() {
    // initMap();
});

var config = {
    apiKey: "AIzaSyDFC1cC6KikOuwzuzewSx-_YTvt8NKRhZE",
    authDomain: "trainschedule-83bff.firebaseapp.com",
    databaseURL: "https://trainschedule-83bff.firebaseio.com",
    projectId: "trainschedule-83bff",
    storageBucket: "trainschedule-83bff.appspot.com",
    messagingSenderId: "684261256470"
};
firebase.initializeApp(config);

// var trainData = firebase.database();

var database = firebase.database();
var train = database.ref("/train");
var trainCount = 0;


function read() {
    let query = firebase.database().ref("/train").orderByKey();
    let val = query.once("value");
    console.log("query : " + query.val);
}

$("#submitButton").on("click", function(event) {
    event.preventDefault();
    var user = $("#user").val().trim().toLowerCase();
    var email = $("#email").val().trim();
    var password = $("#password").val();
    var password2 = $("#password2").val().trim();
    var type = $("#type").val().trim();
    var exists = true;
    $("#user").val("")
    $("#email").val("")
    $("#password").val("")
    $("#password2").val("")
    $("#type").val("");

    var user = {
        user: user,
        email: email,
        password: password,
        password2: password2,
        type: type
    }

    train.push().set(user);
});

train.on("child_added", function(snapshot) {
    var user = snapshot.val().user;
    var email = snapshot.val().email;
    var password = snapshot.val().password;
    var password2 = snapshot.val().password2;
    var type = snapshot.val().type;
    trainCount++;
    console.log("FROM DB :", snapshot.val().user, email, password, password2, type);

});

function initMap() {
    const map = new google.maps.Map(document.getElementById("map"), {
        center: { lat: -33.8688, lng: 151.2195 },
        zoom: 13,
    });
    const card = document.getElementById("pac-card");
    const input = document.getElementById("pac-input");
    map.controls[google.maps.ControlPosition.TOP_RIGHT].push(card);
    const autocomplete = new google.maps.places.Autocomplete(input);
    autocomplete.bindTo("bounds", map);
    autocomplete.setFields(["address_components", "geometry", "icon", "name"]);
    const marker = new google.maps.Marker({
        map,
        anchorPoint: new google.maps.Point(0, -29),
    });
    autocomplete.addListener("place_changed", () => {
        marker.setVisible(false);
        const place = autocomplete.getPlace();

        if (!place.geometry) {
            window.alert("No details available for input: '" + place.name + "'");
            return;
        }
        if (place.geometry.viewport) {
            map.fitBounds(place.geometry.viewport);
        } else {
            map.setCenter(place.geometry.location);
            map.setZoom(17);
        }
        marker.setPosition(place.geometry.location);
        marker.setVisible(true);
        let address = "";

        if (place.address_components) {
            address = [
                (place.address_components[0] &&
                    place.address_components[0].short_name) ||
                "",
                (place.address_components[1] &&
                    place.address_components[1].short_name) ||
                "",
                (place.address_components[2] &&
                    place.address_components[2].short_name) ||
                "",
            ].join(" ");
        }
    });
}

$("#signUpButton").click(function() {
    event.preventDefault();
    $(".form-signup").css("display", "inline-block");
});

$(".x-btn").click(function() {
    $(".form-signup").hide();
});

$(".price").click(function() {
    $(".price").removeClass("active");
    $(".price").removeClass("btn-primary");
    $(this).addClass("active");
    $(this).addClass("btn-primary");
})