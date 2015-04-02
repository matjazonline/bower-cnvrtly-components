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
    var pluginName = "cnvItemsGallery",
        defaults = {
            cnvGalleryMarkers: "true"
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



        var self=this
        var $element=$(element)
        var cgmAttr=$element.attr('cnv-Gallery-Markers')
        if(cgmAttr)self.settings.cnvGalleryMarkers=cgmAttr
        var $nowExpandedPrevObj=null
        var isInited=false
        var previewImages=[]
        var loadedPreviewImages=[]
        var layoutResetWhenLoadedIndex=0
        var isNewTick=true

        function areInSameRow($newSelectedElem, $otherGalleryElem) {
            if(!$otherGalleryElem || !$newSelectedElem)return false
            var rowElements = [$newSelectedElem]
            rowElements = rowElements.concat($newSelectedElem.nextUntil(".cnv-first-in-row"))
            for (var i = 0; i < rowElements.length; i++) {
                var obj = $(rowElements[i]);
                if ($otherGalleryElem.is(obj)) {
                    return true
                    break;
                }
            }
            rowElements = $newSelectedElem.prevUntil(".cnv-last-in-row")
            for (var j = 0; j < rowElements.length; j++) {
                var obj = $(rowElements[j]);
                if ($otherGalleryElem.is(obj)) {
                    return true
                    break;
                }
            }
            return false;
        }

        var hideExpandedWrapper=function($expandedW, $newSelectedElem,callbackFn){
            var isNewInSameRow=areInSameRow($newSelectedElem, $nowExpandedPrevObj);
            if($nowExpandedPrevObj)$nowExpandedPrevObj.removeClass("cnv-expanded-preview")

            var onExpandedHidden=function(){
                $nowExpandedPrevObj=null
                callbackFn()
            }

            if($expandedW.is(':visible')){
                isNewInSameRow?$expandedW.fadeTo(200,0,onExpandedHidden):$expandedW.slideToggle(250,onExpandedHidden)
            }else{
                onExpandedHidden()
            }
        }
        var displayExpanded=function(galleryElem){
            var $gEl=$(galleryElem)
            var $expandedW = $(getExpandedW($gEl))
            var isNewInSameRow=areInSameRow($gEl,$nowExpandedPrevObj)
            var expandWrapper=function(){

                $nowExpandedPrevObj=$gEl
                $nowExpandedPrevObj.addClass("cnv-expanded-preview")

                var $wrapEl=$expandedW.empty()
                var contEl=$($gEl.children()[1]).clone().show().appendTo($wrapEl)

                isNewInSameRow?$wrapEl.fadeTo(200,100):$wrapEl.slideToggle(200)

                var siblArr=$gEl.parent().children()
                var findLastInRow=false
                for (var i = 0; i < siblArr.length; i++) {
                    var $siblEl = $(siblArr[i]);
                    if($siblEl.is($gEl )){
                        findLastInRow=true
                    }
                    if(findLastInRow && $($siblEl).hasClass('cnv-last-in-row')){
                        $($siblEl).after($wrapEl)
                        var scrollToElBottom=$(window).outerHeight()>$wrapEl.outerHeight()
                        scrollToElBottom=scrollToElBottom? $(window).scrollTop() + $(window).outerHeight() < ($wrapEl.offset().top + $wrapEl.outerHeight()):scrollToElBottom
                        var isInView=($wrapEl.offset().top >$(window).scrollTop() && $wrapEl.offset().top<$(window).scrollTop() + $(window).outerHeight())
                        if(scrollToElBottom) {
                            $('html, body').animate({
                                scrollTop: ($wrapEl.offset().top + $wrapEl.outerHeight()) - $(window).outerHeight() + 25
                            }, 500);
                        }else if(!isInView){
                            $('html, body').animate({
                                scrollTop: $wrapEl.offset().top -50
                            }, 200);
                        }
                        break
                    }
                }
            }
            hideExpandedWrapper($expandedW, $gEl,expandWrapper)


        }

        var getExpandedW=function(galleryElem){
            var $gEl = $(galleryElem);
            var expWr=$gEl.siblings("[cnv-expanded-w]")
            if(expWr.length<1)expWr=$('<div class="small-12 columns" cnv-expanded-w style="display: none;"></div>').appendTo($gEl)
            return expWr
        }

        var onGalleryInit=function(){
            //console.log("cnv-items-gallery on gallery init")
            isInited=true
            $('.cnv-display-block-after-gallery-init').css({display:"block"})
            $('.cnv-display-inline-after-gallery-init').css({display:"inline"})
            $('.cnv-hide-after-gallery-init').addClass("cnv-hidden-after-gallery-init")
        }

        var onPreviewImageLoaded=function($img){
            loadedPreviewImages.push($img)
            //reset layout on every 2 images loaded
            if(loadedPreviewImages.length==previewImages.length || layoutResetWhenLoadedIndex<loadedPreviewImages.length-1){
                layoutResetWhenLoadedIndex=loadedPreviewImages.length
                if(isNewTick) {
                    isNewTick=false
                    setTimeout(function () {
                        isNewTick=true
                        resetGalleryClasses()
                    }, 0)
                }

            }
        }

        var resetGalleryClasses=function(){
            //console.log("RESET GALLERY called")
            var getTopPos=function(currItem,currIndex,itemsTopArr){
                if(itemsTopArr[currIndex]==null){
                    itemsTopArr[currIndex]=parseInt($(currItem).offset().top)
                }
                return itemsTopArr[currIndex]
                //return parseInt($(currItem).offset().top)
            }

            var gallery = $element;
            var ch=gallery.children()
            var chTopArr=[]
            var rowChHArr=[]
            var rowIndStart=0
            var rowIndEnd=0
            for (var j = 0; j < ch.length; j++) {
                var $obj = $(ch[j]);
                if($obj.is("[cnv-expanded-w]"))continue
                $obj.removeClass("end").removeClass("cnv-last-in-row").removeClass("cnv-not-last-in-row").removeClass("cnv-not-first-in-row").css("height", "auto")
                var currOffsT = getTopPos($obj,j,chTopArr)
                var nextInd = (j + 1);
                var nextOffsT = nextInd<ch.length?getTopPos(ch[ nextInd],nextInd,chTopArr):null
                var prevInd = (j - 1);
                var prevOffsT = prevInd>-1?getTopPos(ch[ prevInd],prevInd,chTopArr):null
                //check if first
                if(prevOffsT==null || currOffsT!=prevOffsT) {
                    $obj.addClass("cnv-first-in-row")
                    rowChHArr=[$obj.outerHeight()]
                    rowIndStart=j
                }else{
                    $obj.addClass("cnv-not-first-in-row")
                    rowChHArr.push($obj.outerHeight())
                }

                //check if last
                //console.log("LLLL",j,currOffsT,nextOffsT,$obj.get())
                if(nextOffsT==null || currOffsT!=nextOffsT) {

                    $obj.addClass("end").addClass("cnv-last-in-row")
                    rowIndEnd=j
                    if(self.settings.cnvGalleryMarkers!='false' && rowIndStart<rowIndEnd) {
                        var rowMaxH=Math.max.apply(Math, rowChHArr);
                        for (var k = rowIndStart; k < rowIndEnd+1; k++) {
                            var $rowObj = $(ch[k]);
                            $rowObj.outerHeight(rowMaxH                                                                                                                                                                                                                                                                                                                                                                                                                                         )
                        }
                        chTopArr=[]
                        rowChHArr=[]
                    }
                }else{
                    $obj.addClass("cnv-not-last-in-row")
                }

                var children = $obj.children();
                var $previewElem=children.length==2&&$(children[1]).css("display")=="none"?$(children[0]):$obj

                var expBtn=$('[cnv-expand]',$previewElem)
                if(expBtn.length<1)expBtn=$previewElem
                $(expBtn).off('click').on('click',{holderEl:$obj},function(ev){
                    ev.preventDefault()
                    var galleryElem = ev.data.holderEl;
                    if(!galleryElem.is($nowExpandedPrevObj))displayExpanded(galleryElem)
                })
                if(!isInited){
                    previewImages=previewImages.concat($("img",$previewElem))
                }
            }
            if(!isInited){
                isInited=true
                for (var i = 0; i < previewImages.length; i++) {
                    var $img = previewImages[i];
                    if($img.prop('complete')){
                        onPreviewImageLoaded($img)
                    }else{
                        $img.load(function(){
                            onPreviewImageLoaded($img)
                        })
                    }
                }
                onGalleryInit()
            }
        }


        $(window).resize(function(){
            resetGalleryClasses()
        })
        resetGalleryClasses()
        //wait for layout to complete
        /*$timeout(function(){
         resetGalleryClasses()
         },200)*/
        $(window).load(function(){
            resetGalleryClasses()
        })
        if($("#cnv-items-gallery-style").length<1) {
            $('head').prepend('<style id="cnv-items-gallery-style">.cnv-expanded-preview {\
                    position: relative;\
                    background: #fff;\
                    margin-bottom: 15px;\
                    z-index: 1;\
                    \
                }\
                    .cnv-expanded-preview:after {\
                    top: 100%;\
                    left: 50%;\
                    border: solid transparent;\
                    content: " ";\
                    height: 0;\
                    width: 0;\
                    position: absolute;\
                    pointer-events: none;\
                    border-color: rgba(179, 197, 213, 0);\
                    border-top-color: #fff;\
                    border-width: 25px;\
                    margin-left: -25px;\
                }\
                [cnv-items-gallery]>div {\
                        margin-top: 24px;\
                        cursor:pointer;\
                    }\
                    [cnv-items-gallery]> div[cnv-expanded-w] {\
                        margin-top: inherit;\
                        cursor:inherit;\
                    }\
                    [cnv-expanded-w]{background-color: #ddd;margin-bottom: 24px;}\
                    .cnv-hidden-after-gallery-init{\
                        display:none;\
                    }\
                </style>')
        }



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
            //console.log("xD");

        },
        yourOtherFunction: function () {
            // some logic
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
        $('.cnv-items-gallery').cnvItemsGallery({})

    })
})( jQuery, window, document );