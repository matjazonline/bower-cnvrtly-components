'use strict';

angular.module('cnvrtlyComponents')
  .directive('cnvIframeXPopup',['$rootScope', function ($rootScope) {

        //console.log("iframe Xpopup init")
        window.parent.postMessage({id:'cnvIframeXPopup',event:'init'}, '*');
        return {
            //template: '<div></div>',
            restrict: 'A',
            compile: function compile(tElement, tAttrs, transclude) {


                return function postLink(scope, element, attrs) {

                    var $ppElementArea=$("[cnv-x-popup-area]")[0]
                    $ppElementArea=$ppElementArea?$($ppElementArea):$(element)
                    var closeIframeXPopup=function(){
                        window.parent.postMessage({id:'cnvIframeXPopup',event:'close'}, '*');
                    }
                    var successIframeXPopup=function(redirectUrl,email){
                        window.parent.postMessage({id:'cnvIframeXPopup',event:'success',url:redirectUrl,email:email}, '*');
                    }

                    function close() {
                        if (window !== top) {
                            closeIframeXPopup()
                        } else {
                            window.history.back()
                        }
                    }

                    $('[cnv-close]',element).click(function(ev){
                        ev.preventDefault()
                        close();
                    })
                    $(document).click(function(ev){
                        ev.preventDefault()
                        if($ppElementArea.has(ev.target).length<1){
                            close();
                        }
                    })


                    var onIframeXPopupParent=function(data){
                        if(data.id!=null && data.id=="cnvIframeXPopup") {
                            switch (data.event) {
                                case "updateView":
                                    if(data.scroll!=null)element.animate({top:data.scroll})
                                    if(data.height!=null)$(document).height(data.height)
                                    $rootScope.$broadcast("event:directive:cnvFbSubscribeForm:init")
                                    break;
                                case "fnlSteps":
                                    if(data.fnlSteps&&data.fnlSteps.length>0){
                                        $rootScope.$broadcast("event:directive:emailListIntegrationForm:fnlSteps",data.fnlSteps)
                                    }
                                    break;
                            }
                        }
                    }
                    var eventMethod = window.addEventListener ? "addEventListener" : "attachEvent";
                    var eventer = window[eventMethod];
                    var messageEvent = eventMethod == "attachEvent" ? "onmessage" : "message";
// Listen to message from child window
                    eventer(messageEvent,function(e) {
                        var key = e.message ? "message" : "data";
                        var data = e[key];
                        //run function//
                        onIframeXPopupParent(data)
                    },false);
                    $rootScope.$on("event:directive:emailListIntegrationForm:subscribe:success",function(ev,redirectUrl,email){
                        successIframeXPopup(redirectUrl,email)
                    })
                }

            }
        };
    }]);
