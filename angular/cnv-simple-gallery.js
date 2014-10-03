'use strict';

angular.module('cnvrtlyComponents')
  .directive('cnvSimpleGallery',[
        '$rootScope',
        function ($rootScope) {
            return {
                restrict: 'A',
                controller:function($scope){
                    this.scope=$scope;
                },
                link: function (scope, element, attrs,controller) {
                    scope.displayImage=null
                    scope.$on("cnv-simple-gallery-image-selector:event:select",function(ev, cnvSimpleGalleryImageSelectorId,imageSrc){

                        console.log("CHHH",attrs.cnvSimpleGallery,cnvSimpleGalleryImageSelectorId)
                        if(attrs.cnvSimpleGallery==cnvSimpleGalleryImageSelectorId){
                            console.log("OOOOOOOOOOO")
                            scope.displayImage=imageSrc

                            //scope.$broadcast("cnv-simple-gallery:event:display")
                        }
                    })
                    controller.scope.$watch('displayImage',function(newV,oldV){
                        console.log("NNNNNNNN444",newV)
                    })
                    scope.$watch('displayImage',function(newV,oldV){
                        console.log("NNNNNNNN445555555554",newV)
                    })

                }
            };
        }
    ]);