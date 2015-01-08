'use strict';

angular.module('cnvrtlyComponents')
    .directive('cnvIframePopup',['$rootScope', function ($rootScope) {

        //console.log("iframe popup init")
        window.parent.postMessage({id:'cnvIframePopup',event:'init'}, '*');
        return {
            //template: '<div></div>',
            restrict: 'A',
            compile: function compile(tElement, tAttrs, transclude) {


                return function postLink(scope, element, attrs) {

                    var closeIframePopup=function(){
                        window.parent.postMessage({id:'cnvIframePopup',event:'close'}, '*');
                    }
                    var successIframePopup=function(redirectUrl,email){
                        window.parent.postMessage({id:'cnvIframePopup',event:'success',url:redirectUrl,email:email}, '*');
                    }
                    $('[cnv-close]',element).click(function(ev){
                        ev.preventDefault()
                        if(window !== top){
                            closeIframePopup()
                        }else{
                            window.history.back()
                        }
                    })


                    var onIframePopupParent=function(data){
                        if(data.id!=null && data.id=="cnvIframePopup") {
                            switch (data.event) {
                                case "updateView":
                                    if(data.scroll)element.animate({top:data.scroll})
                                    if(data.height)$(document).height(data.height)
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
                        onIframePopupParent(data)
                    },false);
                    $rootScope.$on("event:directive:emailListIntegrationForm:subscribe:success",function(ev,redirectUrl,email){
                        successIframePopup(redirectUrl,email)
                    })
                }

            }
        };
    }]);
