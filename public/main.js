/**
 * Created by Markus Zimmermann on 31.08.2016.
 */

var socket = io();
var admin = false;
var deviceId;
var collission;

socket.on('index', function (index) {
    deviceId = index;
    $('#index').text(deviceId);
    if (deviceId=="1") {
        $('#admin').show();
        admin = true;
    }
    //$('.player').remove();
});

//The elope, run-away animation
$.fn.playerize = function(role) {
    //Setup
    this.data('role',role).data('armed', true).addClass('player').addClass(role);
    //Run right
    this.animate({"left":"100%"},'slow', 'linear', function(){
        role = $(this).data('role');
        socket.emit('leave',role);
        this.remove();
    });
    //Stop when touched
    this.on('touchstart mousedown', function(){
        $(this).stop();
        $("#"+role)[0].play();
        if (admin) {
            //$(this).remove();
        }
        collission = window.setInterval(function(){
            $('.bengler').each(function(){
                var bengler = $(this);
                if (bengler.data('armed')) {
                    var benglerLeft = parseFloat($(this).css('left'));
                    var benglerWidth = parseFloat($(this).css('width'));
                    $('.player:not(.bengler)').each(function (playerIndex, playerObject) {
                        var player = $(this);
                        var playerLeft = parseFloat($(this).css('left'));
                        var playerWidth = parseFloat($(this).css('width'));
                        //Collission detection
                        if (
                            //Rechts
                        playerLeft > benglerLeft && playerLeft < benglerLeft + benglerWidth ||
                        //Links
                        playerLeft + playerWidth > benglerLeft && playerLeft + playerWidth < benglerLeft + benglerWidth
                        ) {
                            //HIT
                            if (player.data('armed')) {
                                bengler.talk();
                                player.listen();
                                player.css('left',parseFloat(bengler.css('left')) + parseFloat(bengler.css('width')) );
                            }
                        }
                    });
                }
            });
        }, 100);
    });
    //Run when relased
    this.on('touchend mouseup', function(){
        $(this).delay(3000).animate({"left":"100%"},'slow', 'linear', function(){
            var role = $(this).data('role')
            socket.emit('leave',role);
            $(this).remove();
        });
        window.clearInterval(collission);
    });
};
$.fn.talk = function(){
    $(this).stop();
    $(this).data("armed", false);
    $(this).css('background-image', 'url(/images/runner.png)');
    $("#benglerTalk")[0].play();
    //animate
    $(this).delay(5000);
    $(this).animate({"left":"100%"},'slow', 'linear', function(){
        var role = $(this).data('role')
        socket.emit('leave',role);
        $(this).remove();
    });
}
$.fn.listen = function() {
    $(this).stop();
    $(this).data("armed", false);
    $(this).css('background-image', 'url(/images/runner.png)');
    $(this).delay(10000);
    $(this).animate({"left":"100%"},'slow', 'linear', function(){
        var role = $(this).data('role')
        socket.emit('leave',role);
        $(this).remove();
    });
}

$(function() {
    $('#index').text(deviceId);
    if (deviceId=="1") {
        $('#admin').show();
        admin = true;
    }

    socket.on('spawn', function (role) {
        $('<div>').append('<div>').appendTo('body').playerize(role);
    });


});

function spawn(role) {
    socket.emit('spawn',role);
}