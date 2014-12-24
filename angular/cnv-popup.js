//console.log("XScript cnvrtly.js loaded")
/*var cnvNgModule=angular.module("cnvrtlyComponents")

cnvNgModule.directive('cnvAddToCart',["$rootScope", function ($rootScope) {
    return {
        restrict: 'A',
        link: function postLink(scope, element, attrs) {
            element.click(function(ev){
                ev.preventDefault()
                var price=attrs.cnvPrice?parseFloat(attrs.cnvPrice):null;
                var productId=attrs.cnvId?attrs.cnvId:null;
                var title=attrs.cnvTitle?attrs.cnvTitle:null;
                var tax=attrs.cnvTax?attrs.cnvTax:null;
                var quantity=1
                if(price>-1){
                    $rootScope.$broadcast("cnvAddToCart:event:add",{price:price,id:productId,title:title,tax:tax,quantity:quantity})
                }
            })
        }
    };
}]);*/

;
CnvPopup=(function($){
    $(function(){
        $('[cnv-popup]').each(function(i,elem){
            var $elem = $(elem);
            var src=$elem.attr("cnv-popup").length>0?$elem.attr("cnv-popup"):$elem.attr("href")
            var cnvHideDelay=$elem.attr("cnv-hide-delay")
            var cnvPreload=$elem.attr("cnv-preload")!="false"

            $elem.click(function(ev){
                ev.preventDefault()
                CnvPopup.show(src,CnvPopup.PRIORITY_USER_DEMAND, false,cnvHideDelay)
            })

            var cnvMuteDays=parseInt($elem.attr("cnv-mute-days"),10)
            if(isNaN(cnvMuteDays))cnvMuteDays=0

            var cnvDelay=parseInt($elem.attr("cnv-delay"),10)
            var cnvExit = $elem.attr("cnv-exit");
            var cnvScroll = $elem.attr("cnv-scroll");
            CnvPopup.create({src:src,cnvPreload:cnvPreload,cnvDelay:cnvDelay,cnvMuteDays:cnvMuteDays,cnvExit:cnvExit,cnvScroll:cnvScroll,cnvHideDelay:cnvHideDelay})
        })
    })


    var createLoaderElem=function(){

        var loaderEl=$('<div class="cnv-loader-dots"> <div class="bounce1"></div> <div class="bounce2"></div> <div class="bounce3"></div> </div>')

        var dirId = 'cnvLoaderDots';
        if($("#"+ dirId).length<1){
            var css=".cnv-loader-dots { margin: 100px auto 0; width: 70px; text-align: center; } .cnv-loader-dots > div { width: 18px; height: 18px; background-color: #ffffff; border-radius: 100%; display: inline-block; -webkit-animation: bouncedelay 1.4s infinite ease-in-out; animation: bouncedelay 1.4s infinite ease-in-out; -webkit-animation-fill-mode: both; animation-fill-mode: both; } .cnv-loader-dots .bounce1 { -webkit-animation-delay: -0.32s; animation-delay: -0.32s; } .cnv-loader-dots .bounce2 { -webkit-animation-delay: -0.16s; animation-delay: -0.16s; } @-webkit-keyframes bouncedelay { 0%, 80%, 100% { -webkit-transform: scale(0.0) } 40% { -webkit-transform: scale(1.0) } } @keyframes bouncedelay { 0%, 80%, 100% { transform: scale(0.0); -webkit-transform: scale(0.0); } 40% { transform: scale(1.0); -webkit-transform: scale(1.0); } }",
                head = document.head || document.getElementsByTagName('head')[0],
                style = document.createElement('style');
            style.type = 'text/css';
            style.id = dirId;
            if (style.styleSheet){
                style.styleSheet.cssText = css
            } else {
                style.appendChild(document.createTextNode(css));
            }
            head.appendChild(style);
        }

        return loaderEl
    };

    var setCookie=function writeCookie (key, value, days) {
            var date = new Date();

            // Default at 7 days.
            days = days || 7;

            // Get unix milliseconds at current time plus number of days
            date.setTime(+ date + (days * 86400000)); //24 * 60 * 60 * 1000

            window.document.cookie = key + "=" + value + "; expires=" + date.toGMTString() + "; path=/";

            return value;
        };

    function getCookie(key) {
        var name = key + "=";
        var ca = document.cookie.split(';');
        for(var i=0; i<ca.length; i++) {
            var c = ca[i];
            while (c.charAt(0)==' ') c = c.substring(1);
            if (c.indexOf(name) == 0) return c.substring(name.length,c.length);
        }
        return "";
    }

    var PriorityQItem=function(src,priority,loadedCb,hideDelay) {
        this.src=src
        this.priority=priority
        this.loadedCallback=loadedCb
        this.hideDelay=hideDelay
        this.iframe=null
    };

    var CnvPopup= new function(){
        this.debug=window.debug
        this.PRIORITY_USER_DEMAND=3
        this.PRIORITY_EXIT_PRELOAD=2
        this.PRIORITY_USER_ACTION=1
        this.PRIORITY_PRELOAD=0
        this.statusLoadingArr=[]
        this.statusCompleteArr=[]

        this._nowShowingQItem=null
        this._loadPriorityCue=[]

        this.create=function(src,cnvPreload,cnvDelay,cnvMuteDays,cnvExit,cnvScroll,cnvHideDelay){
            var options={src:src,cnvPreload:cnvPreload,cnvDelay:cnvDelay,cnvMuteDays:cnvMuteDays,cnvExit:cnvExit,cnvScroll:cnvScroll,cnvHideDelay:cnvHideDelay}
            if(typeof src == "object"){
                $.extend(options,src)
            }

            if(options.cnvPreload==null)options.cnvPreload=true
            if(isNaN(parseInt(options.cnvMuteDays,10)))options.cnvMuteDays=0

            options.cnvDelay=parseInt(options.cnvDelay)
            if(!isNaN(options.cnvDelay)){
                setTimeout(function(){
                    CnvPopup.show(options.src,CnvPopup.PRIORITY_USER_ACTION, true, options.cnvHideDelay,options.cnvMuteDays)
                },options.cnvDelay*1000)
            }

            if(options.cnvExit!=null){
                options.cnvPreload=false
                CnvPopup.loadNext(options.src,CnvPopup.PRIORITY_EXIT_PRELOAD,function(){},options.cnvHideDelay,options.cnvMuteDays)
                var shouldDisplayPopup=function(){
                    CnvPopup.show(options.src,CnvPopup.PRIORITY_USER_ACTION,false,options.cnvHideDelay,options.cnvMuteDays)
                }
                mousePredictor.init(function(){
                    shouldDisplayPopup()
                },false)
            }
            if(options.cnvScroll!=null){
                var val=parseInt(options.cnvScroll,10)
                var suffix = options.cnvScroll.toString().substr(val.toString().length)
                var measureAbs=suffix=='px'
                var scrMute=options.cnvMuteDays>0?options.cnvMuteDays:1
                $(window).scroll(function(ev){
                    //console.log("sSSs",( ( $(window).scrollTop()+$(window).height() ) / $(document).height())*100)
                    if( (!measureAbs && ( ( $(window).scrollTop()+$(window).height() ) / $(document).height())*100>val)
                        || (measureAbs && $(window).scrollTop()>=val)
                        ){
                        CnvPopup.show(options.src,CnvPopup.PRIORITY_USER_ACTION,false,options.cnvHideDelay,scrMute)
                    }
                })
            }
            if(options.cnvPreload)CnvPopup.loadNext(options.src,CnvPopup.PRIORITY_PRELOAD,function(){},options.cnvHideDelay,options.cnvMuteDays)
        }



        this.loadNext=function(src,priority,onLoadedCallback,hideDelay,muteDays){
            if(this.isMuted(src) && priority<CnvPopup.PRIORITY_USER_DEMAND)return
            var qItem = new PriorityQItem(src, priority, onLoadedCallback, hideDelay);
            this.addToLoadQ(qItem)
            this.loadNextFromQueue()
            return qItem
        }

        this.addToLoadQ=function(priorQitem){
            for (var i =this._loadPriorityCue.length-1;i>=0; i--) {
                var pqi = this._loadPriorityCue[i];
                if(pqi.priority<=priorQitem.priority){

                    this._loadPriorityCue.splice(i+1,0,priorQitem)
                    return
                }
            }
            this._loadPriorityCue.unshift(priorQitem)
        }

        this.loadNextFromQueue=function(){
            if(this._loadPriorityCue.length<1)return
            var nextLoadItem=this._loadPriorityCue[this._loadPriorityCue.length-1]
            if(this.debug)console.log("load next from Q isLoading=", this.isLoading(nextLoadItem),nextLoadItem.src)
            if(nextLoadItem && this.isLoading(nextLoadItem))return

            if(nextLoadItem && this.isComplete(nextLoadItem)){
                if(this.debug)console.log("load next from Q - is loaded",nextLoadItem.src)
                nextLoadItem=this._loadPriorityCue.pop()
                nextLoadItem.iframe=this.getIframeBySrc(nextLoadItem.src)
                this.setLoadingComplete(nextLoadItem)
                setTimeout($.proxy(function(){
                    $.proxy(nextLoadItem.loadedCallback,this, nextLoadItem.iframe)()
                },this),0)

                this.loadNextFromQueue()
                return
            }

            var canStartLoading = this.canStartLoading(nextLoadItem);
            if(this.debug)console.log("load next from Q - canStart=",canStartLoading,nextLoadItem.src)
            if(nextLoadItem!=null && canStartLoading!=false) {

                nextLoadItem=this._loadPriorityCue.pop()
                if(this.debug)console.log("load new Q item",nextLoadItem.src)
                var onLoaded=function($iframe){
                    if(this.debug)console.log("load Q item COMPLETE",nextLoadItem.src)
                    this.setLoadingComplete(nextLoadItem)
                    $.proxy(nextLoadItem.loadedCallback,this, nextLoadItem.iframe)()
                    this.loadNextFromQueue()
                }
                nextLoadItem.iframe=this.load(nextLoadItem.src, $.proxy(onLoaded,this),nextLoadItem.hideDelay)
                if(this.debug)console.log("load next from Q - started loading",nextLoadItem.src)
                this.statusLoadingArr.push(nextLoadItem)
            }
        }

        this.setLoadingComplete=function(qItem){
            for (var i = 0; i < this.statusLoadingArr.length; i++) {
                var qI = this.statusLoadingArr[i];
                if(qI===qItem){
                    this.statusLoadingArr.splice(i,1)
                }
            }
            this.setIframeComplete(qItem.iframe)
            this.statusCompleteArr.push(qItem)
        }

        this.isLoading=function(qItem){


            for (var i = 0; i < this.statusLoadingArr.length; i++) {
                var o = this.statusLoadingArr[i];
                if(o.src==qItem.src)return true
            }
            return false
        }

        this.isComplete=function(qItem){

            for (var j = 0; j < this.statusCompleteArr.length; j++) {
                var qI = this.statusCompleteArr[j];
                if(qItem.src==qI.src)return true
            }

            return false
        }

        this.canStartLoading=function(qItem){
            var maxLoadingIframes=1
            if(this.statusLoadingArr.length>=maxLoadingIframes) {
                for (var i = 0; i < this.statusLoadingArr.length; i++) {
                    var currLoadingObj = this.statusLoadingArr[i];
                    //TODO check if lower priority has same src - just hook into loadComplete event
                    if(currLoadingObj.priority<qItem.priority && currLoadingObj.src!=qItem.src){
                        this.stopLoading(currLoadingObj)
                        break
                    }
                }
            }
            return this.statusLoadingArr.length<maxLoadingIframes
        }

        this.stopLoading=function(qItem){
            if(this.debug)console.log("STOP loading",qItem.src)
            this.statusLoadingArr.splice(this.statusLoadingArr.indexOf(qItem),1)
            if(!this.isComplete(qItem)){
                this.addToLoadQ(qItem)
                qItem.iframe.attr("src","about:blank").remove()

            }
        }

        this.isIframeComplete=function($ifr) {
            return $ifr.data("cnv-load-complete")==true
        }
           this.setIframeComplete=function($ifr) {
            return $ifr.data("cnv-load-complete",true)
        }


        this.getIframeBySrc=function(src){

            var jqArr = $('#' + this.getIframeIdFromSrc(src), document.body);
            return jqArr.length>0?$(jqArr[0]):null
        }


        this.getIframeIdFromSrc=function(src){
            var toAttrVal=function(src){
                return src.replace(/[\.,-\/#!$%\^&\*;:{}=\-_`~()]/g,"-")
            }
            return 'cnvPopupIfr'+toAttrVal(src)
        }

        this.load=function(src,onLoadedCallback,hideDelay){
            if($('#cnvPopupStyle',document.body).length==0)$(document.body).append("<style id='cnvPopupStyle'>iframe[cnv-popup-ifr]{position:absolute;top:0;left:0;width:100%;height:100%;z-index:2147483647;border: none; overflow: hidden;}</style>")
            var ifrId=this.getIframeIdFromSrc(src)
            var $cnvPopupIfr = $('#'+ifrId.toString(), document.body);

            if($cnvPopupIfr.length>0 ){
                if(this.debug)console.log("load - iframe exists",src)
                if(this.isIframeComplete($cnvPopupIfr)) {
                    onLoadedCallback($cnvPopupIfr)
                }else{
                    //console.log("load not complete")
                    this._connectIframe($cnvPopupIfr,onLoadedCallback,hideDelay)
                }

            }else{
                if(this.debug)console.log("load - creating new iframe",src)
                $cnvPopupIfr=$('<iframe cnv-popup-ifr id="'+ifrId+'" allowtransparency="true"></iframe>')
                $cnvPopupIfr.css({display:'none'})
                $(document.body).append($cnvPopupIfr)
                this._connectIframe($cnvPopupIfr,onLoadedCallback,hideDelay)
                $cnvPopupIfr.attr("src",src)
            }
            return $cnvPopupIfr
        }

        this._connectIframe=function($iframe,onLoadedCallback,hideDelay) {

            var onIframePopupEvent = function (data, hideDelay, onLoadedCallback) {
                if (data.id != null && data.id == "cnvPopup") {

                    switch (data.event) {
                        case "close":
                            if (data.url) {
                                window.location.href = data.url
                                return
                            }
                            CnvPopup.hide()
                            break;
                        case "success":
                            if (data.url) {
                                window.location.href = data.url
                                return
                            }
                            CnvPopup.hide(hideDelay)
                            break;
                        case "init":
                            onLoadedCallback($iframe)
                            break;
                    }
                }
            }
                var eventMethod = window.addEventListener ? "addEventListener" : "attachEvent";
                var eventer = window[eventMethod];
                var messageEvent = eventMethod == "attachEvent" ? "onmessage" : "message";
// Listen to message from child window
                var onIfr = function (e) {
                    if(e.source!==$iframe.get(0).contentWindow)return
                    var key = e.message ? "message" : "data";
                    var data = e[key];
                    //run function//
                    onIframePopupEvent(data, hideDelay, onLoadedCallback)
                }
            if(this.debug)console.log("iframe connect",$iframe.attr("src"))
                eventer(messageEvent, onIfr, false);

        }

        this.show=function(src,priority,hidePreloader,hideDelay,muteForDays){
            if((this.isMuted(src) && priority<CnvPopup.PRIORITY_USER_DEMAND) || (this._nowShowingQItem!=null && this._nowShowingQItem.src==src) || (this._nowShowingQItem!=null && this._nowShowingQItem.priority>=CnvPopup.PRIORITY_USER_DEMAND ))return
            var bgTimeout=null
            if(this.debug)console.log("Show inited")
            if(!hidePreloader && this._nowShowingQItem==null)bgTimeout=setTimeout(function(){
                var ifrTempBackground=$("#cnvPopupBackground","body")
                if(ifrTempBackground.length==0){
                    ifrTempBackground=$("<div id='cnvPopupBackground' style='display:none; width: 100%;height: 100%; background-color: rgba(0,0,0,0.75);position: absolute;z-index: 99;top: 0;left: 0;bottom: 0;right: 0;'/>")
                    var ifrTempLoading=$("<div id='cnvPopupIfrLoading' style='color: #ffffff;'>  loading</div>").prepend(createLoaderElem())
                    ifrTempLoading.css({position:'fixed',top:"50%",left:'45%'})
                    ifrTempBackground.append(ifrTempLoading)
                    $(document.body).append(ifrTempBackground)
                }
                ifrTempBackground.height($(document).height())
                ifrTempBackground.fadeIn()
            },10)

            var handleLoaded=function($cnvPopupIfr){
                var loadedSrc = $cnvPopupIfr.attr("src");
                if(this.debug)console.log("show- handle loaded ", loadedSrc)
                if(this._nowShowingQItem==null || this._nowShowingQItem.src==loadedSrc){
                    $cnvPopupIfr.css({display:'block'}).hide().fadeIn()
                    if(bgTimeout)clearTimeout(bgTimeout)
                    $('#cnvPopupBackground',document.body).height($(document).height()).fadeOut()
                    if($cnvPopupIfr.get(0).contentWindow){
                        $cnvPopupIfr.get(0).contentWindow.postMessage({id:'cnvPopup',event:'updateView',scroll:$(window).scrollTop()}, '*');
                        $cnvPopupIfr.height($(document).height())
                        if(parseInt(muteForDays,10)>0)setCookie(this.getIframeIdFromSrc(src),priority,muteForDays)
                    }
                }
            }
                var nextQi=this.loadNext(src,priority,handleLoaded,hideDelay)

            //allow the first iframe that was set with delay to display but show last iframe from user demand (click)
            if(this._nowShowingQItem==null || (nextQi.priority>=this._nowShowingQItem.priority && nextQi.priority>=CnvPopup.PRIORITY_USER_DEMAND) || nextQi.priority>this._nowShowingQItem.priority)this._nowShowingQItem=nextQi
        }

        this.hide=function(hideDelay){
            this._nowShowingQItem=null
            hideDelay=parseInt(hideDelay,10)
            if(!(hideDelay>0))hideDelay=0
            setTimeout(function(){
                    $('#cnvPopupStyle', document.body).hide()
                    $('iframe[cnv-popup-ifr]', document.body).hide()
                    $('#cnvPopupBackground', document.body).hide()
            },hideDelay*1000)
        }
        this.isMuted=function(src){
            if(this.debug)return false
            var cookieVal = getCookie(this.getIframeIdFromSrc(src));
            return cookieVal!=null&&cookieVal.length>0
        }
    };

    var mousePredictor={
        init:function(cursorGoingOutCallback,usePrediction){

//from http://jsfiddle.net/5hs64t7w/50/
if(usePrediction){
            var cloudSize = 1;
            var aggressive = 6;

            var prevX = -1;
            var prevY = -1;
            var curX = -1;
            var curY = -1;
            var distance = 0;
            var direction = 0;

            function sum(array){
                var s = 0.0;
                for(var i=0; i<array.length; i++){
                    s += array[i];
                }
                return s;
            }

            var sins = [];
            var coss = [];
            var lengths = [];
            var times = [];
            var index = 0;
            var limit = 20;
            var variance = 200;
            var prevTime = new Date().getTime();

            function updateDistanceAndDirection(x, y){
                var angle = Math.atan2(prevY - curY, prevX - curX);
                sins[index] = Math.sin(angle);
                coss[index] = Math.cos(angle);
                lengths[index] = Math.sqrt((curX-prevX)*(curX-prevX) + (curY-prevY)*(curY-prevY));
                var time = new Date().getTime();
                times[index] = time - prevTime;

                variance = 1.0 - Math.sqrt(sum(coss)*sum(coss)+sum(sins)*sum(sins))/sins.length;

                direction = Math.atan2(1/sins.length*sum(sins),1/coss.length*sum(coss));
                var speed = sum(lengths)/(sum(times)/200);
                distance = Math.min(Math.max(40, speed), 100);
                prevTime = time;
                index = (index+1)%limit;
            }


            function predictCursorGoingOut(ev){
                //c.clearRect(0, 0, canvas.width, canvas.height);

                //for(var i=count; i>=0; i--){
                    //var dir = direction + i*variance;
                    var dir = direction + variance;

                    //drawMouse(curX - distance*Math.cos(dir), curY - distance*Math.sin(dir), dir - Math.PI/2, i/count);

                //var futureY1 = curY - distance * Math.sin(dir);

                    //if(futureY1<-30)console.log("y0", futureY1)
                    //dir = direction - i*variance;
                    //drawMouse(curX - distance*Math.cos(dir), curY - distance*Math.sin(dir), dir - Math.PI/2, i/count);
                    var futureY2 = curY - distance * Math.sin(dir);
                var agr = -100 + (10 * aggressive);
                //console.log("agr",agr)
                if(futureY2< agr ){

                        //console.log("y1", futureY2, ev.clientY)
                        cursorGoingOutCallback()
                }
                //}
            }


            window.onmousemove = function (event) {
                curX = event.clientX;
                curY = event.clientY;

                updateDistanceAndDirection(curX, curY);
                predictCursorGoingOut(event);

                prevX = curX;
                prevY = curY;
            };
    }
            var addEvent=function(obj, evt, fn) {
                if (obj.addEventListener) {
                    obj.addEventListener(evt, fn, false);
                }
                else if (obj.attachEvent) {
                    obj.attachEvent("on" + evt, fn);
                }
            }

                addEvent(document, "mouseout", function(e) {
                e = e ? e : window.event;
                var from = e.relatedTarget || e.toElement;
                if (!from || from.nodeName == "HTML") {
                    // the cursor has left the building
                    cursorGoingOutCallback()
                }
            });
        }
    }

    return CnvPopup

}($))
