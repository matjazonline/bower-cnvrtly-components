'use strict';

angular.module('cnvrtlyComponents')
  .directive('cnvImageSelect',[
        '$rootScope',
        function ($rootScope) {
            return {
                restrict: 'A',
                //require:'^cnvSimpleGallery',
                link: function (scope, element, attrs,controller) {
                    var elements,currInd

                    function dispatchSelect(elem,ind) {
                        var src = ""
                        if (elem.is("a")) {
                            src = $(elem).attr("href");
                        }
                        currInd=ind
                        $rootScope.$broadcast("cnv-image-selector:event:select", attrs.cnvImageSelect, src)
                    }

                    var initElement=function(elem,ind){
                        $(elem).click(function(ev){
                            ev.preventDefault()
                            ev.stopPropagation()

                            $rootScope.$apply(function(){
                                dispatchSelect(elem,ind);
                            })
                            //controller.display({src:})
                        })
                    }

                    if(!element.is("ul")){
                        initElement(element)
                    }else{
                        elements = $("a", element);
                        elements.each(function(i,obj){
                            initElement($(obj),i)
                        })
                        $rootScope.$on('cnv-image-selector:event:selectNext:'+attrs.cnvImageSelect,function(ev,moveNr){
                            var indSel = (currInd + moveNr);
                            if(attrs.cnvInfinite=="false"){
                                if(indSel>elements.length-1)indSel=elements.length-1
                                if(indSel<0)indSel=0

                            }else{
                                if(indSel>elements.length-1)indSel=0
                                if(indSel<0)indSel=elements.length-1
                            }
                            dispatchSelect($(elements[ indSel]),indSel)
                        })
                    }
                }
            };
        }
    ]);