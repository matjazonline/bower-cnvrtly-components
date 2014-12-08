'use strict';
angular.module('cnvrtlyComponents')
    .directive('cnvSoundCloudPlayerControl',['$http','$rootScope','$interval', function ($http,$rootScope,$interval) {
        return {
            /*template: '<div>' +
                '<div class="jp-holder"></div> ' +
                '<p class="text-center " style="margin-top: 39px"><a href="" class="button round fat-border" ng-click="togglePlay()"  title="{{soundTitle}}"><i class="fa fa-play-circle-o fa-2x"></i><span style="line-height: 23px"> play & work</span></a> </p>' +
                '</div>',*/
            restrict: 'A',
            scope:{},
            transclude:true,
            replace:false,
            template: '<div ng-transclude></div>',
            link: function (scope, element, attrs, ctrl, transclude) {

                transclude(scope, function(clone, scope) {
                    element.empty().append(clone);
                });

                var playerId=attrs.cnvPlayerId!=null?attrs.cnvPlayerId:''
                var sounds=[]
                var stopChangeInterval
                var lastPlayingSoundIndex=null
                scope.playingSoundIndex=null
                scope.soundObj=null

                scope.$watch("soundObj",function(val){
                    scope.isPlaying=val!=null
                })
                if(attrs.cnvSound!=null) {
                    sounds=attrs.cnvSound.split(',')
                }
                var getNextSound=function(toggle){
                    var nextSoundIndex=null
                    if(sounds.length<1)console.log("ERROR cnv-sound attribute not set on ",element)

                    if(nextSoundIndex==null && (sounds.length<2 || attrs.cnvRandom==null)){
                        nextSoundIndex=scope.playingSoundIndex==null?0:scope.playingSoundIndex
                    }

                    if(nextSoundIndex==null && attrs.cnvRandom!=null) {
                        var getIndx=function(){
                            return Math.floor(Math.random() * sounds.length);
                        }
                        var index = getIndx()
                        while(index==lastPlayingSoundIndex) {
                            index=getIndx()
                        }
                        nextSoundIndex=index
                    }
                    return sounds[ nextSoundIndex ];
                }
                var play=function() {
                    $rootScope.$broadcast('cnvSoundCloudPlayer:event:play'+':'+playerId, getNextSound())
                }

                if(attrs.cnvAutoPlay=='true')play()

                var setAutoChangeInterval=function(){
                    removeAutoChangeInterval()
                    if(sounds.length>1 && attrs.cnvTime!=null) {
                        var time = parseInt(attrs.cnvTime) * 60 * 1000;
                        stopChangeInterval=$interval(function(){
                            play();
                        }, time)
                        return true
                    }
                    return false
                }

                var removeAutoChangeInterval=function(){
                    $interval.cancel(stopChangeInterval)
                }


                if(attrs.cnvSoundCloudPlayerControl.length>0){
                    element.click(function(ev){
                        ev.preventDefault()
                        if(attrs.cnvSoundCloudPlayerControl=='play'){
                            play()
                        }else if(attrs.cnvSoundCloudPlayerControl=='stop'){
                            $rootScope.$broadcast('cnvSoundCloudPlayer:event:stop'+':'+playerId)
                        }else if(attrs.cnvSoundCloudPlayerControl=='toggle'){
                            $rootScope.$broadcast('cnvSoundCloudPlayer:event:toggle'+':'+playerId,getNextSound())
                        }
                    })
                }


                $rootScope.$on('cnvSoundCloudPlayer:event:playing'+':'+playerId, function(ev,scpObj){
                    scope.soundObj=scpObj
                    if(attrs.cnvLog)console.log("soundObj",scpObj)
                    if(scpObj.soundId==null){
                        scope.playingSoundIndex=null
                        removeAutoChangeInterval()
                        scope.soundObj=null
                        return
                    }
                    for (var i = 0; i < sounds.length; i++) {
                        var sId = sounds[i];
                        if(sId==scpObj.soundId) {
                            scope.playingSoundIndex=i
                            lastPlayingSoundIndex=i
                            setAutoChangeInterval()
                            return
                        }
                    }
                })
            }
        }
    }]);
