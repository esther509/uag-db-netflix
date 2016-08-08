$(document).ready(function () {

    $('#login-user-form').submit(function (event) {
        event.preventDefault();
        var username = $('#login-username').val();
        var password = $('#login-password').val();

        //console.log(username);
        $.ajax({
            type: 'POST',
            dataType: 'json',
            url: '/login',
            data: { username: username, password: password },
            success: function (a) {
                console.log(a);
                if (a.success) {
                    $('#login-error').hide();
                    //console.log($('#input-username'));
                    window.location.assign("/")
                } else {
                    $('#login-error').removeClass('hide');
                    $('#login-error-message').html(a.error);
                }
            },
            complete: function () {

            }
        });
    });

});