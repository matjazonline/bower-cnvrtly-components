'use strict';

angular.module('cnvrtlyComponents')
  .directive('cnvViewStateForm', function () {
        return {
            restrict: 'A',
            compile: function compile(tElement, tAttrs, transclude) {

                //$(document).foundation();


                return function postLink(scope, element, attrs) {
                    //editable component interface
                    if(typeof ViewState==="function"){
                        scope.viewState=new ViewState(["","postError","postSuccess"],"")
                    }

                    scope.$on("event:directive:emailListIntegrationForm:subscribe:success",function(event){
                        scope.viewState.setActive("postSuccess")
                        /*$timeout(function(){
                         closeModal()
                         },20000)*/
                    })
                    scope.$on("event:directive:emailListIntegrationForm:subscribe:progress",function(event){
                        scope.viewState.setActive("postInProgress")
                    })
                    scope.$on("event:directive:emailListIntegrationForm:subscribe:error",function(event){
                        scope.viewState.setActive("postError")
                    })

                    var closeModal=function(){
                        element.find(".close-reveal-modal").click()
                    }
                    /* scope.formConversion=function(){
                     event.preventDefault()
                     $http.post("http://nju1.localhost:8080/subscirbe",{data:{email:scope.email},pageId:window.cmsPageId}).success(function(res){
                     console.log("RESULTTTT")
                     $(element).foundation('reveal', 'close')
                     }).error(function(error){
                     console.log("ERRR")
                     scope.viewState.setActive("postError")
                     //$(element).foundation('reveal', 'close')
                     })
                     //scope.viewState.setActive("postError")
                     }*/
                    //$(document).foundation();
                }
            }
        };
    })


console.log("INFO - ViewState class defined in cnv-view-state-form.js")
function ViewState(states,active){
    this.states=states
    this._active=active
}
ViewState.prototype.setActive=function(statename){
    this._active=statename
}
ViewState.prototype.isActive=function(){
    for (var i = 0; i < arguments.length; i++) {
        if(arguments[i]==this._active) return true
    }

}
