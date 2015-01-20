'use strict';

angular.module('cnvrtlyComponents')
  .directive('cnvGalleryItems', ['$window','$timeout','$interval', '$q',function ($window,$timeout,$interval, $q) {
        return {
            restrict: 'A',
            compile: function compile(tElement, tAttrs, transclude) {

                return function postLink(scope, element, attrs) {
                    var $nowExpandedPrevObj=null
                    var isInited=false
                    var previewImages=[]
                    var loadedPreviewImages=[]
                    var layoutResetWhenLoadedIndex=0
                    var isNewTick=true
                    var waitOnVisibilityTmout=null

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

                    var hideExpandedWrapper=function($expandedW, $newSelectedElem){
                        var deferred = $q.defer();
                        var isNewInSameRow=areInSameRow($newSelectedElem,$nowExpandedPrevObj);
                        if($nowExpandedPrevObj)$nowExpandedPrevObj.removeClass("cnv-expanded-preview")
                        if($expandedW.is(':visible')){
                            isNewInSameRow?$expandedW.fadeTo(200,0,deferred.resolve):$expandedW.slideToggle(250,deferred.resolve)
                        }else{
                            deferred.resolve()
                        }
                        $nowExpandedPrevObj=null
                        return deferred.promise
                    }
                    var displayExpanded=function(galleryElem){
                        var $gEl=$(galleryElem)

                        var $expandedW = $(getExpandedW($gEl))
                        var isNewInSameRow=areInSameRow($gEl,$nowExpandedPrevObj)
                            hideExpandedWrapper($expandedW, $gEl).then(function(){


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
                            })


                    }

                    var getExpandedW=function(galleryElem){
                        var $gEl = $(galleryElem);
                        var expWr=$gEl.siblings("[cnv-expanded-w]")
                        if(expWr.length<1)expWr=$('<div class="small-12 columns" cnv-expanded-w style="display: none;"></div>').appendTo($gEl)
                        return expWr
                    }

                    var onGalleryInit=function(){
                        //console.log("cnv-gallery-items on gallery init")
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
                                $timeout(function () {
                                    isNewTick=true
                                    resetGalleryClasses(true)
                                }, 10)
                            }

                        }
                    }

                    var clearVisibilityTimeout=function(){
                        if($(document.body).is(":visible")==true){
                            $interval.cancel(waitOnVisibilityTmout)
                            resetGalleryClasses()
                        }
                    }
                    var setVisibilityTimeout=function(){
                        if(waitOnVisibilityTmout==null) {
                            waitOnVisibilityTmout=$interval(clearVisibilityTimeout,100)
                        }
                    }

                    var resetGalleryClasses=function(){
                        if($(document.body).is(":visible")==false){
                            setVisibilityTimeout()
                            return
                        }
                        //console.log("RESET GALLERY called")
                        var getTopPos=function(currItem,currIndex,itemsTopArr){
                            if(itemsTopArr[currIndex]==null){
                                itemsTopArr[currIndex]=parseInt($(currItem).offset().top)
                            }
                            return itemsTopArr[currIndex]
                            //return parseInt($(currItem).offset().top)
                        }

                            var gallery = $(element);
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
                                    if(attrs.cnvGalleryMarkers!='false' && rowIndStart<rowIndEnd) {
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
                    //console.log("$window=",$window.resize)
                    $($window).resize(function(){
                        resetGalleryClasses()
                    })

                    resetGalleryClasses()
                    //wait for layout to complete
                    /*$timeout(function(){
                        resetGalleryClasses()
                    },200)*/

                    if($("#cnv-gallery-items-style").length<1) {
                        $('head').prepend('<style id="cnv-gallery-items-style">.cnv-expanded-preview {\
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
                [cnv-gallery-items]>div {\
                        margin-top: 24px;\
                        cursor:pointer;\
                    }\
                    [cnv-gallery-items]> div[cnv-expanded-w] {\
                        margin-top: inherit;\
                        cursor:inherit;\
                    }\
                    [cnv-expanded-w]{background-color: #ddd}\
                    .cnv-hidden-after-gallery-init{\
                        display:none;\
                    }\
                </style>')
                    }

                    //console.log("cnv-gallery-items on post link")
                }

            }
        };
    }]);
