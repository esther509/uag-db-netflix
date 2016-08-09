$(document).ready(function () {

    $('#search-by-id-button').click(function () {
        var c = $('#search-by-id-form').serialize();
        var d = 'http://www.omdbapi.com/?' + c;
        var e = $('#search-by-id-request');
        e.find('a').attr('href', d).html(d);
        e.show('slow');
        e.removeClass('hide');
        //var f = $('#search-by-id-progress');
        //f.show('slow');
        //f.removeClass('hide');
        //var g = $('#search-by-id-response');
        $.ajax({
            type: 'GET',
            dataType: 'text',
            url: 'http://www.omdbapi.com/?' + c,
            statusCode: {
                403: function () {
                    //g.find('pre').html('HTTP 403 Forbidden!')
                }
            },
            success: function (a) {
                //g.find('pre').html(a.replace(/</g, '&lt;').replace(/>/g, '&gt;'))
                var res = JSON.parse(a.replace(/</g, '&lt;').replace(/>/g, '&gt;'));
                console.log(res);
                if (res.Response == "True") {
                    $("#movie-name").attr("value", res.Title);
                    $("#movie-year").attr("value", res.Year);
                    $("#movie-country").attr("value", res.Country);
                    $("#movie-poster").attr("value", res.Poster);
                    $("#movie-plot").attr("value", res.Plot).html(res.Plot);
                }
            },
            complete: function () {
                //f.hide();
                //g.show('slow');
                //g.removeClass('hide');
            }
        });
    });
    $('#search-by-title-button').click(function () {
        var c = $('#search-by-title-form').serialize();
        var d = 'http://www.omdbapi.com/?' + c;
        var e = $('#search-by-title-request');
        e.find('a').attr('href', d).html(d);
        e.show('slow');
        e.removeClass('hide');
        //var f = $('#search-by-title-progress');
        //f.show('slow');
        //f.removeClass('hide');
        //var g = $('#search-by-title-response');
        $.ajax({
            type: 'GET',
            dataType: 'text',
            url: 'http://www.omdbapi.com/?' + c,
            statusCode: {
                403: function () {
                    g.find('pre').html('HTTP 403 Forbidden!')
                }
            },
            success: function (a) {
                //g.find('pre').html(a.replace(/</g, '&lt;').replace(/>/g, '&gt;'))
                var res = JSON.parse(a.replace(/</g, '&lt;').replace(/>/g, '&gt;'));
                console.log(res);
                if (res.Response == "True") {
                    $("#movie-name").attr("value", res.Title);
                    $("#movie-year").attr("value", res.Year);
                    $("#movie-country").attr("value", res.Country);
                    $("#movie-poster").attr("value", res.Poster);
                    $("#movie-plot").attr("value", res.Plot).html(res.Plot);
                }
            },
            complete: function () {
                //f.hide();
                //g.show('slow');
                //g.removeClass('hide');
            }
        })
    });
    $('#add-movie-form').submit(function (event) {
        event.preventDefault();
        var data = $(this).serialize();

        var error = $('#add-movie-error');
        var errorMsg = $('#add-movie-error-message');
        var success = $('#add-movie-success');

        $.ajax({
            type: 'POST',
            dataType: 'json',
            url: '/admin/addmovie/add',
            data: data,
            success: function (a) {
                if (a.success) {
                    success.removeClass('hide');
                    error.addClass('hide');
                } else {
                    error.removeClass('hide');
                    success.addClass('hide');
                    errorMsg.html(a.error);
                }
            },
            complete: function () {
                
            }
        });
    });
});