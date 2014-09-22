'use strict';

angular.module('cnvrtlyComponents')
    .directive('cnvEuCookieLawMsg',['$http','CnvrtlyComponents', function ($http,CnvrtlyComponents) {
        return {
            scope: false,
            restrict: 'A',
            link: function postLink(scope, element, attrs) {


                var getPostURL=function(hideMessage){
                    var baseTag=document.getElementById("baseTag")
                    var baseTagPath=baseTag?baseTag.href:null
                    var baseDomain=""
                    if(baseTagPath) {
                        baseDomain=baseTagPath.substring(baseTagPath.lastIndexOf("//")+2,baseTagPath.lastIndexOf("/"))
                        var portCol = baseDomain.indexOf(':');
                        if(portCol>0)baseDomain=baseDomain.substring(0,portCol)
                    }
                    var prep=window.location.port=='9000'?window.location.protocol+'//'+window.location.hostname+":8080":window.location.origin
                    var postURL = prep+"/api/v1/showEuCookieMsg";
                    if(baseDomain.length>0){
                        postURL=postURL+'?ns='+baseDomain
                        if(hideMessage==true)postURL=postURL+'&hide'
                    }else if(hideMessage==true){
                        postURL=postURL+'?hide'
                    }
                    return postURL
                }

                scope.hide=function(skipCookieSetRequest){
                    $(element).hide()
                    //if skipCookieSetRequest is not set or false set cookie and hide
                    if(!skipCookieSetRequest) {
                        $http.get(getPostURL(true))
                    }
                }

                scope.hide(true)

                $http.get(getPostURL()).success(function(data, status, headers){
                    if(status==410) {
                        scope.hide(true)
                    }else{
                        //leave message
                        $(element).show()
                    }
                }).error(function(data, status, headers){
                    if(status==410) {
                        scope.hide(true)
                    }else{
                        //leave message
                        $(element).show()
                    }
                })
            }
        };
    }]);
