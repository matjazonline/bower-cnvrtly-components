// the semi-colon before function invocation is a safety net against concatenated
// scripts and/or other plugins which may not be closed properly.
;(function ( $, window, document, undefined ) {

    //console.log("cnv-fixed-top-menu.js cnvCOMP 000000000")
    "use strict";

    // undefined is used here as the undefined global variable in ECMAScript 3 is
    // mutable (ie. it can be changed by someone else). undefined isn't really being
    // passed in so we can ensure the value of it is truly undefined. In ES5, undefined
    // can no longer be modified.

    // window and document are passed through as local variable rather than global
    // as this (slightly) quickens the resolution process and can be more efficiently
    // minified (especially when both are regularly referenced in your plugin).

    // Create the defaults once
    var pluginName = "cnvFixedTopMenu",
        defaults = {
            //propertyName: "value"
        };

    // The actual plugin constructor
    function Plugin ( element, options ) {
        this.element = element;
        //console.log("cnv-fixed-top-menu.js cnvCOMP setup")
        // jQuery has an extend method which merges the contents of two or
        // more objects, storing the result in the first object. The first object
        // is generally empty as we don't want to alter the default options for
        // future instances of the plugin
        this.settings = $.extend( {}, defaults, options );
        this._defaults = defaults;
        this._name = pluginName;
        this.$originalEl=null
        this.$clonedEl=null
        this.init();
    }

    var getTop=function($el){
        var orgElementPos = $el.offset();
        return orgElementPos.top;
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

            if(window.TagyCmsClient&&window.TagyCmsClient.isEditMode())return

            //console.log("cnv-fixed-top-menu.js cnvCOMP init")
            var self=this
            // Create a clone of the menu, right next to original.
            this.$originalEl=$($('.cnv-fixed-top-menu').addClass('cnv-fixed-top-menu-original'))
            this.$clonedEl=$('.cnv-fixed-top-menu.cloned',this.$originalEl.parent())
                if(this.$clonedEl.length<1)this.$clonedEl=this.$originalEl.clone().insertAfter(this.$originalEl).addClass('cloned').css('position','fixed').css('top','0').css('margin-top','0').css('z-index','500').removeClass('cnv-fixed-top-menu-original').hide();
            //var scrollIntervalID = setInterval(this.stickIt, 10);
            var orgElementTop = getTop(this.$originalEl);
            if(orgElementTop<1) {
               self.stickIt(true)
                /*$(window).load(function(ev){
                    //self.stickIt()
                })*/
            }else{
                //console.log("ERROR not implemented if menu y>0")
                /*$(window).scroll(function(ev){
                    self.stickIt()
                })

                $(window).resize(function(ev){
                    self.stickIt()
                })*/
            }




        },
        stickIt:function (force) {

            //console.log("cnv-fixed-top-menu.js cnvCOMP stickIt")
        var orgElementTop = getTop(this.$originalEl);
//console.log("oTOP",orgElementTop)
        if (force||$(window).scrollTop() > (orgElementTop)) {
            // scrolled past the original position; now only show the cloned, sticky element.

            // Cloned element should always have same left position and width as original element.
            var coordsOrgElement = this.$originalEl.offset();
            var leftOrgElement = coordsOrgElement.left;
            var widthOrgElement = this.$originalEl.css('width');
            this.$clonedEl.css('left',leftOrgElement+'px').css('top',0).css('width',widthOrgElement).show();
            this.$originalEl.css('visibility','hidden');
        } else {
            // not scrolled past the menu; only show the original menu.
            this.$clonedEl.hide();
            this.$originalEl.css('visibility','visible');
        }
        /*if ($(window).scrollTop() >= (orgElementTop)) {
            // scrolled past the original position; now only show the cloned, sticky element.

            // Cloned element should always have same left position and width as original element.
            var coordsOrgElement = this.$originalEl.offset();
            var leftOrgElement = coordsOrgElement.left;
            var widthOrgElement = this.$originalEl.css('width');
            this.$clonedEl.css('left',leftOrgElement+'px').css('top',0).css('width',widthOrgElement).show();
            this.$originalEl.css('visibility','hidden');
        } else {
            // not scrolled past the menu; only show the original menu.
            this.$clonedEl.hide();
            this.$originalEl.css('visibility','visible');
        }*/
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

    //console.log("cnv-fixed-top-menu.js cnvCOMP 1111111")
    $(function(){

        //console.log("cnv-fixed-top-menu.js cnvCOMP onJQQQQ")
        $('.cnv-fixed-top-menu').cnvFixedTopMenu()
    })
    //console.log("cnv-fixed-top-menu.js cnvCOMP 2222222222")
       /* $(document).on('tagyCms:productionReady',function(ev){
            //console.log("RRRRRRRRRRRRRRRRRRRRRRR")
        })*/
})( jQuery, window, document );