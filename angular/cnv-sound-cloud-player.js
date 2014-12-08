'use strict';
angular.module('cnvrtlyComponents')
    .directive('cnvSoundCloudPlayer',['$http','$rootScope', function ($http,$rootScope) {
        return {
            /*template: '<div>' +
                '<div class="jp-holder"></div> ' +
                '<p class="text-center " style="margin-top: 39px"><a href="" class="button round fat-border" ng-click="togglePlay()"  title="{{soundTitle}}"><i class="fa fa-play-circle-o fa-2x"></i><span style="line-height: 23px"> play & work</span></a> </p>' +
                '</div>',*/
            restrict: 'E',
            scope:{},
            link: function (scope, element, attrs) {

                var clientId = attrs.cnvId//"544b20e8aacbdf132f9402611f42f7ba";
                //scope.soundId = "undara-morning-chorus";
                var playerId=attrs.cnvPlayerId!=null?attrs.cnvPlayerId:''
                var lastSoundId = null;
                scope.playingSoundId = null;
                //scope.autoPlay = true;
                scope.player = $("<div class='jplayer-holder'></div>").appendTo(element).jPlayer({

                    solution: 'html',
                    preload: 'none',
                    volume: 0.2,
                    muted: false, loop: true, supplied: "mp3"

                });

                if(scope.player==null)console.log("ERROR - NO PLAYER DIV FOUND")

                var startPlaying = function (soundId) {
                    if (soundId == null) {
                        soundId = scope.soundId;
                    }
                    if (soundId == null) {
                        $rootScope.$broadcast('cnvSoundCloudPlayer:event:playing'+':'+playerId, {title: null, username: null, url: null});
                        alert("Ooops no sound set.");
                        return;
                    }
                    $http.get("http://api.soundcloud.com/tracks/" + soundId + ".json", {params: {client_id: clientId}}).success(function (res) {
                        //$rootScope.$broadcast("cnvSoundCloudPlayer:start", soundId, res);
                        scope.playingSoundId = soundId;
                        scope.soundTitle = res.title + " by " + res.user.username;
                        scope.player.jPlayer("setMedia", {mp3: res.stream_url + "?client_id=544b20e8aacbdf132f9402611f42f7ba"});
                        scope.player.jPlayer("play");
                        $rootScope.$broadcast('cnvSoundCloudPlayer:event:playing'+':'+playerId, {soundId:soundId, title: res.title, username: res.user.username, url: res.stream_url, response:res});
                    });
                }

                var stopPlaying = function () {
                    scope.player.jPlayer("stop");
                    $rootScope.$broadcast("soundPlayer:stop");
                    lastSoundId = scope.playingSoundId;
                    scope.playingSoundId = null;
                    $rootScope.$broadcast('cnvSoundCloudPlayer:event:playing'+':'+playerId,{title:null,username:null,url:null});
                };




                scope.togglePlay = function (soundId) {
                    if (scope.playingSoundId == null) {
                        var sId=soundId!=null?soundId:lastSoundId
                        startPlaying(sId);
                    } else {
                        stopPlaying();
                    }


                };
                scope.$watch("soundId", function (val) {
                    if (val != null && scope.playingSoundId != val) {

                        if (scope.playingSoundId != null){
                            stopPlaying();
                        }

                        startPlaying(val);
                    }

                });

                scope.$on('cnvSoundCloudPlayer:event:toggle'+':'+playerId,function(ev,soundId){
                    scope.togglePlay(soundId)
                })
                scope.$on('cnvSoundCloudPlayer:event:play'+':'+playerId,function(ev,soundId){
                    startPlaying(soundId);
                })
                scope.$on('cnvSoundCloudPlayer:event:stop'+':'+playerId,function(){
                    stopPlaying();
                })
            }
        }
    }]);
