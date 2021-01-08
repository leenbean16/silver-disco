$(document).ready(function() {
    $(".red-text").hide();
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
    validate();
    if (validated === true) {
        event.preventDefault();
        var user = $("#user").val().trim().toLowerCase();
        var email = $("#email").val().trim();
        var password = $("#password").val();
        var password2 = $("#password2").val().trim();
        var zipcode = $("#zipcode").val().trim();
        var type = $("#type").val().trim();
        var exists = true;
        $("#user").val("")
        $("#email").val("")
        $("#password").val("")
        $("#password2").val("")
        $("#type").val("");
        $("#zipcode").val("");

        var user = {
            user: user,
            email: email,
            password: password,
            password2: password2,
            type: type,
            zipcode: zipcode
        }

        train.push().set(user);
    } else if (validated === false) {
        console.log("Form needs to be fixed.");
    }
});

train.on("child_added", function(snapshot) {
    var user = snapshot.val().user;
    var email = snapshot.val().email;
    var password = snapshot.val().password;
    var password2 = snapshot.val().password2;
    var zipcode = snapshot.val().zipcode;
    var type = snapshot.val().type;
    trainCount++;
    console.log("FROM DB :", snapshot.val().user, email, password, password2, zipcode, type);

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
    $("#signUpPopUp").show();
    $(".form-signup").css("display", "inline-block");
});

$(".btn-close").click(function() {
    $("#signUpPopUp").hide();
});

$(".price").click(function() {
    $(".price").removeClass("active");
    $(".price").removeClass("btn-primary");
    $(this).addClass("active");
    $(this).addClass("btn-primary");
})

var validated = false;
var validatedCount = 0;

$(".form-control").click(function() {
    $('.form-control').removeClass("red");
})

function validate() {
    $(".red-text").hide();
    var user = $("#user").val().trim().toLowerCase();
    var email = $("#email").val().trim();
    var password = $("#password").val();
    var password2 = $("#password2").val().trim();
    var zipcode = $("#zipcode").val().trim();
    var type = $("#type").val().trim();
    if (user.length <= 4) {
        console.log("username not long enough");
        validated = false;
        $(".user-text").show();
        validatedCount++;
    } else if (/^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/.test(email) === false) {
        console.log("email wrong");
        validated = false;
        $(".email-text").show();
        validatedCount++;
    } else if (/^(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{8,16}$/.test(password) === false) {
        console.log("password ", password);
        validated = false;
        $(".password-text").show();
        validatedCount++;
    } else if (password != password2) {
        console.log("passwords don't match!");
        $(".password2-text").show();
        validated = false;
        validatedCount++;
    } else if (/(^\d{5}$)|(^\d{5}-\d{4}$)/.test(zipcode) === false) {
        console.log("zip code wrong!");
        validated = false;
        $(".zipcode-text").show();
        validatedCount++;
    } else {
        $('.form-control').removeClass("red");
        console.log("all good.");
        validated = true;
    }
}