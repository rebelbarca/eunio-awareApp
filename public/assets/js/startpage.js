$(document).ready(function () {

    $(".nextpage").on("click", function() {
        console.log("hello!");
        window.location.href = "/app";
    });

    $(".registerPage").on("click", function() {
        console.log("Register Page!");
        window.location.href = "/register";
    });

    $(".loginPage").on("click", function() {
        console.log("Login Page!");
        window.location.href = "/";
    });

});
