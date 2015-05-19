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
    var pluginName = "cnvXFormProgress",
        defaults = {
            color:'#333'
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

            if(!this)return
            var self = this;
            var $el=$(this.element)
            if($el.hasClass('cnv-x-form-progress-show')||$el.hasClass('cnv-x-form-progress')){
                $(this.element).hide()
            }

            $(document).on("cnv:CnvXForm:progress",function(){
                self.onProgress()
            })
            $(document).on("cnv:CnvXForm:error",function(){
                self.onError()
            })
        },
        create:function(){
            $(this.element).replaceWith('<div class="spinner"><div class="bounce1"></div><div class="bounce2"></div><div class="bounce3"></div></div>')
        },
        addCSS:function(){
            $(document.head).append('<style>.spinner { margin: auto auto; width: 70px; text-align: center; } .spinner > div { width: 18px; height: 18px; background-color: '+this.settings.color+'; border-radius: 100%; display: inline-block; -webkit-animation: bouncedelay 1.4s infinite ease-in-out; animation: bouncedelay 1.4s infinite ease-in-out; /* Prevent first frame from flickering when animation starts */ -webkit-animation-fill-mode: both; animation-fill-mode: both; } .spinner .bounce1 { -webkit-animation-delay: -0.32s; animation-delay: -0.32s; } .spinner .bounce2 { -webkit-animation-delay: -0.16s; animation-delay: -0.16s; } @-webkit-keyframes bouncedelay { 0%, 80%, 100% { -webkit-transform: scale(0.0) } 40% { -webkit-transform: scale(1.0) } } @keyframes bouncedelay { 0%, 80%, 100% { transform: scale(0.0); -webkit-transform: scale(0.0); } 40% { transform: scale(1.0); -webkit-transform: scale(1.0); } }</style>')
        },

        onProgress:function(){
            var $el=$(this.element)
            if($el.hasClass('cnv-x-form-progress')){
                this.addCSS()
                this.create()
            }
            if($el.hasClass('cnv-x-form-progress-show')||$el.hasClass('cnv-x-form-progress')){
                $el.show()
            }else{
                $el.hide()

            }
        },

        onError:function(){
            var $el=$(this.element)
            if($el.hasClass('cnv-x-form-progress-show')||$el.hasClass('cnv-x-form-progress')){

                $el.hide()
            }else{
                $el.show()
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
        $('[class^="cnv-x-form-progress"]').each(function(i,el){
            var attrs = $(el).get(0).attributes;
            var attrOpt={}
            if(attrs){
                for (var i=0;i<attrs.length;i++){
                    attrOpt[attrs[i].name]=attrs[i].value
                }
            }
            $(el).cnvXFormProgress(attrOpt)
        })
    })
})( jQuery, window, document );