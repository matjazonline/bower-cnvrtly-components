'use strict';

angular.module('cnvrtlyComponents')
  .directive('cnvGoogleMap',[
        '$rootScope',
        function ($rootScope) {
            return {
                restrict: 'A',
                //require:'^cnvSimpleGallery',
                link: function (scope, element, attrs,controller) {
                    if(attrs.lat==null || attrs.lng==null){
                        alert("No lat, lng settings for Google map.")
                        return
                }

                    var apiKey=attrs.apiKey
                    if(window._cnvGoogleMapCount==null)window._cnvGoogleMapCount=0
                    var mapId=window._cnvGoogleMapCount++

                    var lat=parseFloat(attrs.lat)
                    var lng=parseFloat(attrs.lng)
                    var elemId=attrs.id
                    if(elemId==null){
                        elemId="cnvGoogleMap_"+mapId
                        $(element).attr("id", elemId)
                        $('head').append("<style>#"+elemId+" img{max-width:none;}</style>")
                    }
                    //window._cnvGoogleMapCount.push({lat:lat,lng:lng})

                    var createMapCallback=function(optionsParam) {

                        return function(){
                            var myLatlng = new google.maps.LatLng(optionsParam.lat,optionsParam.lng);
                            var mapOptions = {
                                zoom: 14,
                                center: myLatlng,
                                scrollwheel:false//,
                                /*zoomControl: true,
                                zoomControlOptions: {
                                    style: google.maps.ZoomControlStyle.SMALL
                                }*/

                            };
                            if(optionsParam!=null)mapOptions=angular.extend(mapOptions,optionsParam )


                            var map = new google.maps.Map(element[0],
                                mapOptions);
                            var marker = new google.maps.Marker({
                                position: myLatlng,
                                map: map
                                //title: 'Hello World!'
                            });
                        }
                    }

                    window['initCnvGoogleMap_'+mapId]=createMapCallback(angular.extend({lat:lat,lng:lng},attrs))
                    //window['initCnvGoogleMap_'+mapId].mapData=window._cnvGoogleMapCount[mapId]

                    function loadScript() {
                        var headScript=$('#cnvGoogleMaps')
                        if(headScript.length<1){
                            //var sc=$('<script type="text/javascript" src="https://maps.googleapis.com/maps/api/js?key='+apiKey+'" id="cnvGoogleMaps" async="false"></script>')

                            var script = document.createElement('script');
                            script.type = 'text/javascript';
                           // script.src = 'https://maps.googleapis.com/maps/api/js?v=3.exp&' +'callback=initialize';
                            script.src = 'https://maps.googleapis.com/maps/api/js?key='+apiKey+'&' +'callback=initCnvGoogleMap_'+mapId+'&signed_in=true';
                            document.body.appendChild(script);
                        }


                    }
                    loadScript()
                }
            };
        }
    ]);