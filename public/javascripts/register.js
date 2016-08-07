$(document).ready(function () {

    $('#register-user-form').submit(function (event) {
        event.preventDefault();
        var username = $('#input-username').val();
        var data = $('#register-user-form').serialize();
        
        console.log(data);
        //console.log(username);
        $.ajax({
            type: 'POST',
            dataType: 'json',
            url: '/register/new',
            data: data,
            success: function (a) {
                console.log(a);
                if (a.success) {
                    $('#register-error').hide();
                    //console.log($('#input-username'));
                    window.location.assign("/login/" + username);
                } else {
                    $('#register-error').removeClass('hide');
                    $('#register-error-message').html(a.error);
                }
            },
            complete: function () {

            }
        });
    });
    
});