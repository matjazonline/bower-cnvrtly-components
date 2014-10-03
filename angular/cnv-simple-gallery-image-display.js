'use strict';

angular.module('cnvrtlyComponents')
  .directive('cnvSimpleGalleryImageDisplay',[
        '$rootScope',
        function ($rootScope) {
            return {
                restrict: 'A',
                require:'^?cnvSimpleGallery',
                link: function (scope, element, attrs, controller) {
                    var currentSrc=$(element).css("backgroundImage")

                    controller.scope.$watch('displayImage',function(newV,oldV){
                        if(newV==oldV || newV==null)return
                    var imageSrc=newV
                            $(element).css({"min-height":null})
                            $(element).css({"min-height":$(element).height()})
                            if(currentSrc!=imageSrc){
                                currentSrc=imageSrc
                                $(element).css({backgroundImage:"url("+imageSrc+")"})
                                $rootScope.$broadcast("cnv-hideable-listener:event",attrs.cnvSimpleGalleryImageDisplay,"hide")
                            }else{
                                $rootScope.$broadcast("cnv-hideable-listener:event",attrs.cnvSimpleGalleryImageDisplay,"show")
                                currentSrc=null

                        }
                    })
                    /*scope.$on("cnv-simple-gallery-image-selector:event:select",function(ev, cnvSimpleGalleryImageSelectorId,imageSrc){
                        if(attrs.cnvSimpleGalleryImageDisplay==cnvSimpleGalleryImageSelectorId){
                            $(element).css({"min-height":null})
                            $(element).css({"min-height":$(element).height()})
                            if(currentSrc!=imageSrc){
                                currentSrc=imageSrc
                                $(element).css({backgroundImage:"url("+imageSrc+")"})
                                $rootScope.$broadcast("cnv-hideable-listener:event",attrs.cnvSimpleGalleryImageDisplay,"hide")
                            }else{
                                $rootScope.$broadcast("cnv-hideable-listener:event",attrs.cnvSimpleGalleryImageDisplay,"show")
                                currentSrc=null
                            }
                        }
                    })*/
                    $(element).click(function(ev){
                        $rootScope.$broadcast("cnv-hideable-listener:event",attrs.cnvSimpleGalleryImageDisplay,"show")
                        currentSrc=null
                    })
                }
            };
        }
    ]);