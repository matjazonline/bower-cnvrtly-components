'use strict';

angular.module('cnvrtlyComponents')
  .directive('cnvImageDisplayControls',[
        '$rootScope','$timeout',
        function ($rootScope,$timeout) {
            return {
                transclude:true,
                replace:false,
                template:' <img cnv-Image-Display="{{cnvImageDisplayControls}}"/><span style="position: absolute; top:50%;left:50%;" ng-show="imgLoading"><i class="fa fa-spinner fa-spin fa-2x"></i> loading</span> <span ng-click="loadPrev()" style="width: 50%;height: 100%; position: absolute;left: 0;top:0;cursor: pointer;"><span style="position: absolute;top:50%;left:0; text-shadow: rgba(255,255,255,0.7) 2px 2px 0px; color:rgba(100,100,100,0.7);" ><i class="fa fa-chevron-circle-left fa-3x"></i></span></span> <span ng-click="loadNext()" style="width: 50%;height: 100%; position: absolute;right: 0;top:0;cursor: pointer;"><span style="position: absolute;top:50%;right:0; text-shadow: rgba(255,255,255,0.7) 2px 2px 0px; color:rgba(100,100,100,0.7);"><i class="fa fa-chevron-circle-right fa-3x"></i></span></span><span cnv-image-select="{{cnvImageDisplayControls}}"  style="position: absolute;top:10px;right:0px"><i class="fa fa-times-circle fa-3x" style="cursor: pointer; text-shadow: rgba(255,255,255,0.7) 2px 2px 0px; color:rgba(255,0,0,0.7)"></i></span>',
                restrict: 'A',
                scope:{cnvImageDisplayControls:'@'},
                compile: function (element, attrs) {



                    return function (scope, element, attrs, controller, transclude) {
                        if(attrs.cnvAnimationTime==null||attrs.cnvAnimationTime.length<3)attrs.cnvAnimationTime="1000"
                        attrs.cnvAnimationTime=parseInt(attrs.cnvAnimationTime)
                        if(attrs.cnvScrollTop==null||attrs.cnvScrollTop.length<1)attrs.cnvScrollTop="0"
                        attrs.cnvScrollTop=parseInt(attrs.cnvScrollTop)
                        scope.imgLoading=false
                        var loadingTmt=null
                          $(element).css({width: '100%',textAlign: 'center', overflow: 'hidden',height:'0px',position:"relative"});

                        //var currentSrc=$(element).attr("src")
                        if(attrs.cnvToggle=="false"){
                            $(element).css("display","none")
                        }
                        scope.$on('cnv-image-display:event:loaded:'+attrs.cnvImageDisplayControls,function(ev,imgEl){
                            if(loadingTmt!=null){
                                $timeout.cancel(loadingTmt)
                                loadingTmt=null
                            }
                            scope.imgLoading=false
                            element.stop().animate({height: "show", opacity: "show"},attrs.cnvAnimationTime);
                        })
                        scope.$on('cnv-image-display:event:display:'+attrs.cnvImageDisplayControls,function(ev,id,imgEl,h){
                            if(loadingTmt!=null){
                                $timeout.cancel(loadingTmt)
                                loadingTmt=null
                            }
                            scope.imgLoading=false
                            element.stop().animate({height: h+"px", opacity: "100"},attrs.cnvAnimationTime);
                            if(attrs.cnvScrollTo!=null){
                                $timeout(function(){
                                    var sTop = element.offset().top - attrs.cnvScrollTop;
                                    console.log("scrollTOP=",sTop, element.offset().top , attrs.cnvScrollTop)
                                    $('html, body').animate({
                                        scrollTop: sTop
                                    },500);
                                },0)

                            }
                        })

                        scope.$on('cnv-image-display:event:hide:'+attrs.cnvImageDisplayControls,function(ev){
                            if(loadingTmt!=null){
                                $timeout.cancel(loadingTmt)
                                loadingTmt=null
                            }
                            scope.imgLoading=false
                            element.stop().animate({height: "hide", opacity: "hide"},attrs.cnvAnimationTime);
                        })

                        scope.loadPrev=function(){
                            $rootScope.$broadcast('cnv-image-selector:event:selectNext:'+attrs.cnvImageDisplayControls,-1)
                        }
                        scope.loadNext=function(){
                            $rootScope.$broadcast('cnv-image-selector:event:selectNext:'+attrs.cnvImageDisplayControls,1)
                        }
                        $rootScope.$on('cnv-image-selector:event:select',function(ev,id,src){
                            if(loadingTmt!=null){
                                $timeout.cancel(loadingTmt)
                                loadingTmt=null
                            }
                            loadingTmt=$timeout(function(){
                                if(src!=null&& src.length>0)scope.imgLoading=true
                            },1000)

                            if(attrs.cnvToggle!=null &&  id!=null && id==attrs.cnvImageDisplayControls && src!=null){
                                var hide=src.length<1
                                if(attrs.cnvToggle=="false")hide=!hide
                                if(!hide){
                                    $(element).stop().animate({height: "hide", opacity: "hide"},attrs.cnvAnimationTime);
                                } else{
                                    element.stop().animate({height: "show", opacity: "show"},attrs.cnvAnimationTime);
                                }
                            }
                        })
                    }
                }
            }
        }
    ]);