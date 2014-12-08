'use strict';

angular.module('cnvrtlyComponents')
  .directive('cnvImageSelect',[
        '$rootScope','$timeout',
        function ($rootScope,$timeout) {
            return {
                restrict: 'A',
                //require:'^cnvSimpleGallery',
                controller:['$scope','$rootScope',function($scope, $rootScope){
                    var cont=this

                    this.setLastSelected=function(topPosition){
                        if($rootScope._cnvImageSelect_lastSelectedTop==null)$rootScope._cnvImageSelect_lastSelectedTop=parseInt(topPosition)
                    }
                    this.scrollToLastSelected=function(){
                        if($rootScope._cnvImageSelect_lastSelectedTop!=null){
                            var lst=$rootScope._cnvImageSelect_lastSelectedTop
                            $timeout(function(){
                                $('html, body').stop().animate({
                                    scrollTop: lst
                                },1000,'linear');
                            },1000)
                            $rootScope._cnvImageSelect_lastSelectedTop=null
                        }
                    }


                }],
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
                            controller.setLastSelected(elem.offset().top)
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
                            var elem = $(elements[ indSel]);
                            dispatchSelect(elem,indSel)
                        })
                    }
                    scope.$on('cnv-image-display:event:hide:'+attrs.cnvImageSelect,function(ev){
                        if(attrs.cnvAutoScroll)controller.scrollToLastSelected()
                    })
                }
            };
        }
    ]);