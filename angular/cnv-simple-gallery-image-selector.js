'use strict';

angular.module('cnvrtlyComponents')
  .directive('cnvSimpleGalleryImageSelector',[
        '$rootScope',
        function ($rootScope) {
            return {
                restrict: 'A',
                //require:'^cnvSimpleGallery',
                link: function (scope, element, attrs,controller) {
                    $("a",element).each(function(i,obj){
                        $(obj).click(function(ev){
                            ev.preventDefault()
                            ev.stopPropagation()

                            scope.$apply(function(){
                                scope.$emit("cnv-simple-gallery-image-selector:event:select",attrs.cnvSimpleGalleryImageSelector,$(obj).attr("href"))

                            })
                                //controller.display({src:})
                            })
                    })
                }
            };
        }
    ]);