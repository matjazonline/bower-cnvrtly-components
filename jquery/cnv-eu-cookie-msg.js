// the semi-colon before function invocation is a safety net against concatenated
// scripts and/or other plugins which may not be closed properly.
;(function ( $, window, document, undefined ) {

    "use strict";

    // undefined is used here as the undefined global variable in ECMAScript 3 is
    // mutable (ie. it can be changed by someone else). undefined isn't really being
    // passed in so we can ensure the value of it is truly undefined. In ES5, undefined
    // can no longer be modified.

    // window and document are passed through as local variable rather than global
    // as this (slightly) quickens the resolution process and can be more efficiently
    // minified (especially when both are regularly referenced in your plugin).

    // Create the defaults once
    var pluginName = "cnvEuCookie",
        defaults = {
            //propertyName: "value"
        };

    // The actual plugin constructor
    function Plugin ( element, options ) {
        this.element = element;
        // jQuery has an extend method which merges the contents of two or
        // more objects, storing the result in the first object. The first object
        // is generally empty as we don't want to alter the default options for
        // future instances of the plugin
        this.settings = $.extend( {}, defaults, options );
        this._defaults = defaults;
        this._name = pluginName;
        this.init();
    }

    // Avoid Plugin.prototype conflicts
    $.extend(Plugin.prototype, {
        init: function () {
            // Place initialization logic here
            // You already have access to the DOM element and
            // the options via the instance, e.g. this.element
            // and this.settings
            // you can add more functions like the one below and
            // call them like so: this.yourOtherFunction(this.element, this.settings).

            if(!$("#cnvEuCookieMsgStyle").length) {
                $(document.head).prepend("<style id='cnvEuCookieMsgStyle' remove-in-production> .cnv-eu-cookie { background-color: #E6E1E1; text-align: right; color: #535284; text-align: right; padding: 3px 0px 0px 3px; overflow: hidden; margin:0px; } a.cnv-eu-cookie-hide-btn{ border: #fff 2px solid; background: #B5BB59; color: #ffffff !important; padding: 0px 3px 1px 4px; font-size: 2em; text-decoration: none; border-radius: 5px; margin: 3px; display: inline-block; line-height: 0.8em; font-family: sans-serif; } a.about-cookies{ color: #535284; }</style>")
            }

            if(!this)return
            var self = this;

            this.hide(true)
            $(this.element).click(function(ev){
                if(!$(ev.target).attr("href")){
                    ev.preventDefault();
                    self.hide();
                }
            })
            $.ajax({
                ///type: "HEAD",
                async: true,
                url:this.getPostURL(),
                success:function(){
                    $(self.element).show()
                },
                error:function(){
                    $(self.element).show()
                },
                statusCode: {
                    410: function() {
                        if(self)self.hide(true)
                    },
                    404: function() {
                    }
                }
            })
        },
        getPostURL:function(hideMessage){
            var baseTag=document.getElementById("baseTag")
            var baseTagPath=baseTag?baseTag.href:null
            var baseDomain=""
            if(baseTagPath) {
                baseDomain=baseTagPath.substring(baseTagPath.lastIndexOf("//")+2,baseTagPath.lastIndexOf("/"))
                var portCol = baseDomain.indexOf(':');
                if(portCol>0)baseDomain=baseDomain.substring(0,portCol)
            }
            var prep = window.location.port == '9000' ? window.location.protocol + '//' + window.location.hostname + ":8080" : window.location.origin;
            var postURL = prep+"/api/v1/showEuCookieMsg";
            if(baseDomain.length>0){
                postURL=postURL+'?ns='+baseDomain
                if(hideMessage==true)postURL=postURL+'&hide'
            }else if(hideMessage==true){
                postURL=postURL+'?hide'
            }
            return postURL
        },

        hide:function(skipCookieSetRequest){
        $(this.element).hide()
        //if skipCookieSetRequest is not set or false set cookie and hide
        if(!skipCookieSetRequest) {
            $.ajax(this.getPostURL(true))
        }
    }




    });

    // A really lightweight plugin wrapper around the constructor,
    // preventing against multiple instantiations
    $.fn[ pluginName ] = function ( options ) {
        return this.each(function() {
            if ( !$.data( this, "plugin_" + pluginName ) ) {
                $.data( this, "plugin_" + pluginName, new Plugin( this, options ) );
            }
        });
    };

    $(function(){
        $('.cnv-eu-cookie').cnvEuCookie()
    })
})( jQuery, window, document );