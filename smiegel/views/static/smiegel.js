//

var Smiegel = {
    init: function() {
        this.updateCredentials();
        this.initJQuery();
    },

    updateCredentials: function() {
        $.getJSON( "credentials", function(data) {
            Smiegel.auth_token = data.auth_token;
            Smiegel.user_id = data.user_id;
            Smiegel.email = data.email;

            Smiegel.updateQR();
        });
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
    },

    updateQR: function() {
        var map = {
            auth_token: this.auth_token,
            user_id: this.user_id,
            shared_key: 'MDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDA=',
            host: '192.168.1.5',
            port: 5000
        };

        $('#qrcode').qrcode(JSON.stringify(map));
    },
};
