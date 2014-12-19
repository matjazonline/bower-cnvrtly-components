'use strict';

angular.module('cnvrtlyComponents')
  .directive('cnvPopup',['$rootScope', function ($rootScope) {

        window.parent.postMessage({id:'cnvPopup',event:'init'}, '*');

        return {
            //template: '<div></div>',
            restrict: 'A',
            compile: function compile(tElement, tAttrs, transclude) {


                return function postLink(scope, element, attrs) {

                    var closeIframePopup=function(redirectUrl){
                        window.parent.postMessage({id:'cnvPopup',event:'close',url:redirectUrl}, '*');
                    }
                    var successIframePopup=function(redirectUrl){
                        window.parent.postMessage({id:'cnvPopup',event:'success',url:redirectUrl}, '*');
                    }
                    $('[cnv-close]',element).click(function(ev){
                        ev.preventDefault()
                        closeIframePopup()
                    })


                    var onIframePopupParent=function(data){
                        if(data.id!=null && data.id=="cnvPopup") {
                            switch (data.event) {
                                case "scroll":
                                    element.animate({top:data.value})
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
                    $rootScope.$on("event:directive:emailListIntegrationForm:subscribe:success",function(ev,redirectUrl){
                        successIframePopup(redirectUrl)
                    })
                }

            }
        };
    }]);
