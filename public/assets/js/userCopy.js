var business = "";
var type = "";
var whatCompare = "";
var newlat;
var newlon;
var userData;
var vehicleData;
var footData;

function initMap() {
    var options = {
        zoom: 13,
        center: { lat: -33.865143, lng: 151.209900 }
    }
    
    var map = new google.maps.Map(document.getElementById("map"), options);

    google.maps.event.addListener(map, "click", function (event) {
        var newMark = new google.maps.Marker({
            position: event.latLng,
            map: map
        });
        newlat = event.latLng.lat();
        newlon = event.latLng.lng();
    });
}

$(document).ready(function () {
    $(document).on("click", ".compare", function () {
        $("#reload").removeClass('hide');
        $(".dataTitle").removeClass('hide');
        $("#update").removeClass('hide');
        // var userIndex = $(this.id);
        var userIndex = $(this).attr('id');
        console.log(userIndex);
        const inRangeArray = [];
        $.get("/api/user/" + userIndex, function (data) {
            console.log("user", data);
            userData = data;
        })
            .then(userData => {
                // displayMarker(userData.lat, userData.lon);
                $.get("/api/vehicletraffic", function (data) {
                    console.log("vehicle", data);
                    vehicleData = data;
                    vehicleData.forEach(element => {
                        const dist = getDrivingDistance(element.wgs84_latitude, userData.lat, element.wgs84_longitude, userData.lon);
                        console.log(dist);
                        if (dist < 3) {
                            inRangeArray.push(element)
                        }
                    })
                })
            })
            .then(vehicleData => {
                console.log(inRangeArray);
                $.get("/api/foottraffic", function (data) {
                    console.log("foot", data);
                    footData = data;
                    footData.forEach(element => {
                        dist = getDrivingDistance(element.wgs84_latitude, userData.lat, element.wgs84_longitude, userData.lon);
                        console.log(dist);
                        if (dist < 5) {
                            inRangeArray.push(element)
                        }
                    })
                    // displayMarker(userData.lat, userData.lon);
                    initializeInfoRows(userData.lat, userData.lon, inRangeArray);
                })
            })
    });

    function displayMarker(latitude, longitude, array01, array02) {
        var map = new google.maps.Map(document.getElementById("map"), {
            zoom: 15,
            center: new google.maps.LatLng(latitude, longitude),
            mapTypeId: google.maps.MapTypeId.ROADMAP
        });
        var icon = {
            // url: 'https://ya-webdesign.com/transparent250_/coffee-cup.png',
            // url: "https://ya-webdesign.com/transparent250_/palm-clipart-2.png",
            // url: "https://ya-webdesign.com/transparent250_/brighter-palm-tree.png",
            // url: 'https://ya-webdesign.com/transparent250_/mario-background-png-3.png',
            url: 'https://ya-webdesign.com/transparent250_/public-clipart-comunity-10.png',
            scaledSize: new google.maps.Size(50, 50), // scaled size
            origin: new google.maps.Point(0, 0), // origin
            anchor: new google.maps.Point(0, 0) // anchor
        };
        var markerInit = new google.maps.Marker({
            position: new google.maps.LatLng(latitude, longitude),
            map: map,
            draggable: true,
            icon: icon,
            animation: google.maps.Animation.DROP
        });

        //this stuff just makes the marker bounce in a pretty way when we drop it
        markerInit.addListener('click', toggleBounce);

        function toggleBounce() {
            if (markerInit.getAnimation() !== null) {
                markerInit.setAnimation(null);
            } else {
                markerInit.setAnimation(google.maps.Animation.BOUNCE);
            }
        }

        // To add the marker to the map, call setMap();
        markerInit.setMap(map);

        var infowindow = new google.maps.InfoWindow();

        var marker, i;

        for (i = 0; i < array01.length; i++) {
            marker = new google.maps.Marker({
                position: new google.maps.LatLng(array01[i].wgs84_latitude, array01[i].wgs84_longitude),
                map: map
            });

            google.maps.event.addListener(marker, 'click', (function (marker, i) {
                return function () {
                    infowindow.setContent(`${array01[i].id}." "${array01[i].road_name} Vehicle Count: ${array01[i].traffic_count}`);
                    infowindow.open(map, marker);
                }
            })(marker, i));
        }
        for (i = 0; i < array02.length; i++) {
            marker = new google.maps.Marker({
                position: new google.maps.LatLng(array02[i].wgs84_latitude, array02[i].wgs84_longitude),
                map: map
            });

            google.maps.event.addListener(marker, 'click', (function (marker, i) {
                return function () {
                    infowindow.setContent(`${array02[i].id}." "${array02[i].road_name} Foot Count: ${array02[i].count}`);
                    infowindow.open(map, marker);
                }
            })(marker, i));
        }
    }

    function getDrivingDistance(lat1, lat2, lon1, lon2) {
        var R = 6371; // km (change this constant to get miles)
        var dLat = (lat2 - lat1) * Math.PI / 180;
        var dLon = (lon2 - lon1) * Math.PI / 180;
        var a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
            Math.sin(dLon / 2) * Math.sin(dLon / 2);
        var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        var d = R * c;

        if (d > 1) return Math.round(d);
        else if (d <= 1) return Math.round(d);
        return d;
    }

    $(document).on("click", "#submit", displayLatLon)

    function displayLatLon(event) {
        event.preventDefault();
        business = $("#businessname").val().trim();
        type = $("#typeinput option:selected").val();
        console.log(newlat);
        console.log(business);
        console.log(type);
        var string = "State of Mind"
        if (type === string) {
            var errorField = $(".error");
            errorField.css("display", "block");
            return;
        }
        else {
            if (!business || type === string || !newlat || !newlon) {
                var errorField = $(".error");
                errorField.css("display", "block");
            } else {
                postUserData(business, type, newlat, newlon);
            }
        }
    }
    function postUserData(business, type, lat, lon) {
        let userData = {
            user: business,
            businessType: type,
            lat: lat,
            lon: lon
        }
        $.post("/api/user", userData).then(data => {
            console.log(data);
            console.log("user created successfully");
            location.reload();
        });
        // User route for saving a new user data
        // $.ajax({
        //     url: '/api/user',
        //     type: 'POST',
        //     data: {
        //         user: business,
        //         businessType: type,
        //         lat: lat,
        //         lon: lon
        //     },
        //     success: function (data) {
        //         location.reload();
        //         console.log("user created successfully");
        //     }
        // })
    }

    /* global moment */
    // userContainer holds all of our users
    var userContainer = $(".userinputtwo");
    var vehicleContainer = $(".vehicle");
    var footContainer = $(".foot")
    // var postCategorySelect = $("#category");
    // Click events for the edit and delete buttons
    $(document).on("click", "button.delete", handleUserDelete);
    // $(document).on("click", "button.edit", handleUserEdit);
    // Variable to hold our users
    var users;
    // The code below handles the case where we want to get blog posts for a specific author
    // Looks for a query param in the url for author_id
    var url = window.location.search;
    getUsers();
    // This function grabs posts from the database and updates the view
    function getUsers() {
        $.get("/api/user", function (data) {
            console.log("user", data);
            users = data;
            if (!users || !users.length) {
                displayEmpty();
            }
            else {
                initializeRows();
            }
        });
    }

    // This function does an API call to delete posts
    function deletePost(id) {
        $.ajax({
            method: "DELETE",
            url: "/api/user/" + id
        }).then(function () {
            getUsers();
        });
    }

    // InitializeRows handles appending all of our constructed User HTML inside blogContainer
    function initializeRows() {
        userContainer.empty();
        var usersToAdd = [];
        for (var i = 0; i < users.length; i++) {
            // whatCompare = i;
            usersToAdd.push(createNewRow(users[i]));
        }
        userContainer.append(usersToAdd);
    }

    function initializeInfoRows(lat, lon, info) {
        console.log(lat);
        console.log(lon);
        vehicleContainer.empty();
        footContainer.empty();
        console.log(info);
        var infoToVehicle = [];
        var mapVehicleData = [];
        var infoToFoot = [];
        var mapFootData = []
        info.forEach(element => {
            if (element.traffic_count) {
                infoToVehicle.push(createVehicleInfo(element));
                mapVehicleData.push(element);
            }
        })
        info.forEach(element => {
            if (element.count) {
                infoToFoot.push(createFootInfo(element));
                mapFootData.push(element);
            }
        });
        // for (var i = 0; i < users.length; i++) {
        //     // whatCompare = i;
        //     infoToAdd.push(createNewRow(users[i]));
        // }
        // console.log(infoToAdd);
        console.log(mapVehicleData);
        console.log(mapFootData);
        // multipleMarkers(infoToVehicle);
        vehicleContainer.append(infoToVehicle);
        footContainer.append(infoToFoot);
        displayMarker(lat, lon, mapVehicleData, mapFootData);
    }
    // This function constructs a post's HTML
    function createNewRow(user) {
        var newUserCard = $("<div>").addClass("column");
        var outerdropdown = $("<div>").addClass("dropdown is-hoverable is-left");
        var dropdownTrigger = $("<div>").addClass("dropdown-trigger");
        var dropdownTriggerBtn = $("<button>").addClass("button");
        var dropdownMenu = $("<div>").addClass("dropdown-menu");
        var dropdownContent = $("<div>").addClass("dropdown-content");
        var dropdownItem = $("<div>").addClass("dropdown-item");
        var newType = $("<p>").addClass("title is-4");
        var newUser = $("<p>").addClass("subtitle is-6");
        var newTime = $("<p>");
        var deleteBtn = $("<button>").addClass("delete ui button");
        var compareBtn = $("<button>").addClass("compare ui button");
        var updateBtn = $("<button>").addClass("update ui button");
        var formattedDate = new Date(user.createdAt);
        var rowEl = $('<div>').addClass('row');
        formattedDate = moment(formattedDate).format("MMMM Do YYYY, h:mm:ss a");
        // var whereTo = $("#whereto");

        dropdownTriggerBtn.attr("aria-haspopup", "true");
        dropdownTriggerBtn.attr("aria-controls", "dropdown1");
        dropdownMenu.attr("id", "dropdown1");
        dropdownMenu.attr("role", "menu");
        compareBtn.attr("id", user.id);
        updateBtn.attr("id", user.id);

        dropdownTriggerBtn.text(user.id + ". " + user.user.charAt(0).toUpperCase() + user.user.slice(1) + " " + user.businessType.charAt(0).toUpperCase() + user.businessType.slice(1));
        newType.text(user.businessType.charAt(0).toUpperCase() + user.businessType.slice(1) + " ");
        newUser.text("Created by: " + user.user.charAt(0).toUpperCase() + user.user.slice(1));
        newTime.text(formattedDate);
        compareBtn.text("Analyse");
        updateBtn.text("Update State of Mind");

        newType.append(deleteBtn);
        newUserCard.append(newType);
        newUserCard.append(newUser);
        newUserCard.append(newTime);
        newUserCard.append(rowEl);
        rowEl.append(compareBtn);
        newUserCard.data("user", user);
        newUserCard.append(rowEl);
        rowEl.append(updateBtn);

        dropdownItem.append(newUserCard);
        dropdownTrigger.append(dropdownTriggerBtn);
        dropdownContent.append(dropdownItem);
        dropdownMenu.append(dropdownContent);
        outerdropdown.append(dropdownTrigger);
        outerdropdown.append(dropdownMenu);

        return outerdropdown;
    }

    // This function constructs a post's HTML
    function createVehicleInfo(info) {
        var newInfoCard = $("<div>").addClass("column");
        var outerdropdown = $("<div>").addClass("dropdown is-hoverable is-left");
        var dropdownTrigger = $("<div>").addClass("dropdown-trigger");
        var dropdownTriggerBtn = $("<button>").addClass("button");
        var dropdownMenu = $("<div>").addClass("dropdown-menu");
        var dropdownContent = $("<div>").addClass("dropdown-content");
        var dropdownItem = $("<div>").addClass("dropdown-item");
        var newType = $("<p>").addClass("title is-4");
        var newInfo = $("<p>").addClass("subtitle is-6");

        dropdownTriggerBtn.attr("aria-haspopup", "true");
        dropdownTriggerBtn.attr("aria-controls", "dropdown1");
        dropdownMenu.attr("id", "dropdown1");
        dropdownMenu.attr("role", "menu");

        dropdownTriggerBtn.text(info.id + ". " + info.road_name);
        newType.text(info.road_name);
        newInfo.text("Vehicle Traffic Count: " + info.traffic_count);

        newInfoCard.append(newType);
        newInfoCard.append(newInfo);
        newInfoCard.data("user", info);

        dropdownItem.append(newInfoCard);
        dropdownTrigger.append(dropdownTriggerBtn);
        dropdownContent.append(dropdownItem);
        dropdownMenu.append(dropdownContent);
        outerdropdown.append(dropdownTrigger);
        outerdropdown.append(dropdownMenu);

        return outerdropdown;
    }

    // This function constructs a post's HTML
    function createFootInfo(info) {
        var newInfoCard = $("<div>").addClass("column");
        var outerdropdown = $("<div>").addClass("dropdown is-hoverable is-left");
        var dropdownTrigger = $("<div>").addClass("dropdown-trigger");
        var dropdownTriggerBtn = $("<button>").addClass("button");
        var dropdownMenu = $("<div>").addClass("dropdown-menu");
        var dropdownContent = $("<div>").addClass("dropdown-content");
        var dropdownItem = $("<div>").addClass("dropdown-item");
        var newType = $("<p>").addClass("title is-4");
        var newInfo = $("<p>").addClass("subtitle is-6");

        dropdownTriggerBtn.attr("aria-haspopup", "true");
        dropdownTriggerBtn.attr("aria-controls", "dropdown1");
        dropdownMenu.attr("id", "dropdown1");
        dropdownMenu.attr("role", "menu");

        dropdownTriggerBtn.text(info.id + ". " + info.road_name);
        newType.text(info.road_name);
        newInfo.text("Foot Traffic Count: " + info.count);

        newInfoCard.append(newType);
        newInfoCard.append(newInfo);
        newInfoCard.data("user", info);

        dropdownItem.append(newInfoCard);
        dropdownTrigger.append(dropdownTriggerBtn);
        dropdownContent.append(dropdownItem);
        dropdownMenu.append(dropdownContent);
        outerdropdown.append(dropdownTrigger);
        outerdropdown.append(dropdownMenu);

        return outerdropdown;
    }

    // This function figures out which User we want to delete and then calls deletePost
    function handleUserDelete() {
        var currentUser = $(this).parent().parent().data("user");
        console.log(currentUser);
        deletePost(currentUser.id);
    }

    // This function displays a message when there are no users
    function displayEmpty() {
        var query = window.location.search;
        var partial = "";
        // if (!id) {
        //     partial = " for User #" + id;
        // }
        userContainer.empty();
        var messageH2 = $("<h3>");
        messageH2.css({ "text-align": "center", "margin-top": "50px" });
        messageH2.html("No users yet" + partial + query + ", enter user data in order to get started.");
        userContainer.append(messageH2);
    }
});
