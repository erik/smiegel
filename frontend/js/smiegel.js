//

var Smiegel = {
    config: {},

    init: function() {
        this.readStorage();
        // TODO: Don't need to do this every time
        this.updateCredentials();

        this.initJQuery();
    },

    readStorage: function() {
        if (!('shared_key' in window.localStorage)) {
            window.localStorage.shared_key = this.generateSecretKey();
        }

        this.config.shared_key = window.localStorage.shared_key;
    },

    updateCredentials: function() {
        $.getJSON( "credentials", function(data) {
            Smiegel.config.auth_token = data.auth_token;
            Smiegel.config.user_id = data.user_id;
            Smiegel.config.email = data.email;
            Smiegel.config.server = data.server;

            Smiegel.updateQR();
        });
    },

    generateSecretKey: function() {
        var array = new Uint8Array(32);
        window.crypto.getRandomValues(array);

        return btoa(String.fromCharCode.apply(null, array));;
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
        $('#qrcode').qrcode(JSON.stringify(this.config));
    },
};
