//

var Smiegel = {
    init: function() {
        Smiegel.initJQuery();
    },

    initJQuery: function() {
        // Make sticky things sticky.
        $(".sticky").stick_in_parent();

        // Make our message window the right size
        $(window).on("resize", function(){
            var b = $(".chatwindow");
            var p = b.position();
            var height = $(window).height();
            height -= p.top;
            height -= $('.inputbox').height() + 20;
            $('.messagewindow').css({'height': height + 'px'});
        });

        // QR
        Smiegel.updateQR();
    },

    updateQR: function() {
        $('#qrcode').qrcode('{"auth_token": "MDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDA=", "shared_key": "MDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDA=", "host": "192.168.1.5", "port": 5000}');
    },
};
