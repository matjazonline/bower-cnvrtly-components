'use strict';

angular.module('cnvrtlyComponents')
  .directive('cnvImageDisplay',[
        '$rootScope','$timeout',
        function ($rootScope,$timeout) {
            var dir={
                restrict: 'A',
                scope:{},
                link: function (scope, element, attrs, controller, transclude) {
                    if(attrs.cnvAnimationTime==null||attrs.cnvAnimationTime.length<3)attrs.cnvAnimationTime="1000"
                    attrs.cnvAnimationTime=parseInt(attrs.cnvAnimationTime)
                    var lastSrc=''
                    var handleLoaded=function(ev){
                            // scope.$emit('cnv-image-display:event:loaded',element)
                            $rootScope.$broadcast('cnv-image-display:event:loaded:'+attrs.cnvImageDisplay,element)

                            var dispatchOnSize=function(){
                                var elH = element.height();
                                if(elH>0){
                                    $rootScope.$broadcast('cnv-image-display:event:display:'+attrs.cnvImageDisplay,attrs.cnvImageDisplay,element,elH)
                                }else{
                                    $timeout(function(){
                                        dispatchOnSize()
                                    },100)
                                }
                            }
                            dispatchOnSize()
                        }
                        if(attrs.cnvToggle=="false"){
                            $(element).css("display","none")
                        }
                        if(element.is("img")){
                            element.load(handleLoaded)
                            if(attrs.cnvScrollTo!=null){
                                $timeout(function(){
                                    $('html, body').animate({
                                        scrollTop: element.offset().top
                                    },500);
                                },0)

                            }
                        }

                        $rootScope.$on('cnv-image-selector:event:select',function(ev,id,src){
                            if(element.is("img")){
                                if( src!=null && src.length>0 && (id==null ||(id!=null && id==attrs.cnvImageDisplay)) ){
                                    element.attr('src',src)
                                    if(lastSrc==src)handleLoaded()
                                    lastSrc=src
                                }else if(src==null || src.length<1) {
                                    //
                                    $rootScope.$broadcast('cnv-image-display:event:hide:'+attrs.cnvImageDisplay)
                                }
                            }
                            if(attrs.cnvToggle!=null &&  id!=null && id==attrs.cnvImageDisplay && src!=null){
                                var hide=src.length<1
                                if(attrs.cnvToggle=="false")hide=!hide
                                if(!hide){
                                    if($(element).data('cnv-original-margin-top')==null)$(element).data('cnv-original-margin-top',element.css('marginTop'))
                                    if($(element).data('cnv-original-margin-bottom')==null)$(element).data('cnv-original-margin-bottom',element.css('marginBottom'))
                                    if($(element).data('cnv-original-margin-right')==null)$(element).data('cnv-original-margin-right',element.css('marginRight'))
                                    if($(element).data('cnv-original-margin-left')==null)$(element).data('cnv-original-margin-left',element.css('marginLeft'))
                                    $(element).animate({height: "hide", opacity: "hide", marginTop:'0px', marginBottom:'0px',marginLeft:'0px',marginRight:'0px'},attrs.cnvAnimationTime);
                                } else{

                                    var prop = {height: "show", opacity: "show"};

                                    var mt = $(element).data('cnv-original-margin-top');
                                    mt!=null?prop.marginTop=mt:null;
                                    var mb = $(element).data('cnv-original-margin-bottom');
                                    mb!=null?prop.marginBottom=mb:null;
                                    var mr=$(element).data('cnv-original-margin-right')
                                    mr!=null?prop.marginRight=mr:null;
                                    var ml=$(element).data('cnv-original-margin-left')
                                    ml!=null?prop.marginLeft=ml:null;
                                    element.animate(prop,attrs.cnvAnimationTime,null,function(ev){
                                    });
                                }
                            }

                        })

                }
            };
            return dir
        }
    ]);