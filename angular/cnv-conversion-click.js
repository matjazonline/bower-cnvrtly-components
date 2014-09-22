'use strict';

angular.module('cnvrtlyComponents')
    .directive('cnvConversionClick',['$http','CnvrtlyComponents', function ($http,CnvrtlyComponents) {
        return {
            scope: false,
            restrict: 'A',
            link: function postLink(scope, element, attrs) {

                var getPostURL=function(){
                    var baseTag=document.getElementById("baseTag")
                    var baseTagPath=baseTag?baseTag.href:null
                    var baseDomain=""
                    if(baseTagPath) {
                        baseDomain=baseTagPath.substring(baseTagPath.lastIndexOf("//")+2,baseTagPath.lastIndexOf("/"))
                        var portCol = baseDomain.indexOf(':');
                        if(portCol>0)baseDomain=baseDomain.substring(0,portCol)
                    }
                    var prep=window.location.port=='9000'?window.location.protocol+'//'+window.location.hostname+":8080":window.location.origin
                    var pageId=CnvrtlyComponents.getPageId()
                    var postURL = prep+"/cclick/"+pageId;
                    if(baseDomain.length>0)postURL=postURL+'?ns='+baseDomain
                    return postURL
                }

                element.click(function(ev){
                    var pageId=CnvrtlyComponents.getPageId()
                    var prep=window.location.port=='9000'?window.location.protocol+'//'+window.location.hostname+":8080":''
                    var redir=null
                    if(element.is("A") && element.attr("href")&& element.attr("href").length>0){
                        redir=element.attr("href")
                    }
                    $http.post(getPostURL()).success(function(){
                        if(redir)window.location.href=redir
                    }).error(function(){
                        if(redir)window.location.href=redir
                    })

                    if(redir!=null){
                        ev.preventDefault()
                        return false
                    }
                })
            }
        };
    }]);
