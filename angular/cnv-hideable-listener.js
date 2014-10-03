'use strict';

angular.module('cnvrtlyComponents')
  .directive('cnvHideableListener',[
        '$rootScope',
        function ($rootScope) {
            return {
                restrict: 'A',
                link: function (scope, element, attrs) {

                    if(attrs.initHide=="true"){
                        $(element).css("display","none")
                    }
                    scope.$on("cnv-hideable-listener:event",function(ev, hideableId, value){
                          if(attrs.cnvHideableListener==hideableId) {
                              var hide=value == "hide"
                              if(attrs.initHide=="true")hide=!hide
                              if(hide){
                                  $(element).fadeOut()//animate({ opacity: 0 })
                              } else{
                                  $(element).fadeIn()//.animate({ opacity: 100 })
                              }
                          }
                    })
                }
            };
        }
    ]);