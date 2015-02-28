'use strict';
(function(document,window) {
    var Loader = function () { }
    Loader.prototype = {
        require: function (scripts, callback) {
            this.loadCount      = 0;
            this.totalRequired  = scripts.length;
            this.callback       = callback;

            for (var i = 0; i < scripts.length; i++) {
                this.writeScript(scripts[i]);
            }
        },
        loaded: function (evt) {
            this.loadCount++;

            if (this.loadCount == this.totalRequired && typeof this.callback == 'function') this.callback.call();
        },
        writeScript: function (src, async) {
            var self = this;
            var s = document.createElement('script');
            s.type = "text/javascript";
            s.async = async==null ?true:async;
            s.src = src;
            if(s.async)s.addEventListener('load', function (e) { self.loaded(e); }, false);
            var head = document.getElementsByTagName('head')[0];
            head.appendChild(s);
        }
    }
    var isTaglyCmsEditMode=function(){
        var ngAppElem = document.querySelectorAll('[ng-app]');
        if(ngAppElem.length>1)alert("Multiple ng-app definitions in html!")
        var htmlElem=document.querySelector("html")
        if(htmlElem!=null && htmlElem!=null && htmlElem.classList != null && htmlElem.classList.contains!=null) {
            //if(ngAppElem!=null && ngAppElem[0]!=null && ngAppElem[0].classList != null && ngAppElem[0].classList.contains!=null) {
            return htmlElem.classList.contains("tagy-cms-edit-mode")
        }else{
            return false
        }
        /*var $ngAppElem = $("[ng-app]");
         if($ngAppElem.length>1)alert("Multiple ng-app definitions in html!")
         return $ngAppElem.hasClass("tagy-cms-edit-mode")*/
    }

    var detectIE= function() {
        var ua = window.navigator.userAgent;
        var msie = ua.indexOf('MSIE ');
        var trident = ua.indexOf('Trident/');

        if (msie > 0) {
            // IE 10 or older => return version number
            return parseInt(ua.substring(msie + 5, ua.indexOf('.', msie)), 10);
        }

        if (trident > 0) {
            // IE 11 (or newer) => return version number
            var rv = ua.indexOf('rv:');
            return parseInt(ua.substring(rv + 3, ua.indexOf('.', rv)), 10);
        }

        // other browser
        return false;
    }

    var loadScripts=function(loadAsync,skipJQ,skipNG,loadCnvXScript){
        if(loadAsync==null)loadAsync=true

        var xScrUrl=window.location.port.length>2?'//localhost:8080/cnvXScript.js':'//cnvrtly.appspot.com/cnvXScript.js'
        if(loadAsync){
            console.log("loading Asynchronous")
            var l=new Loader();
            var scripts=[]
            if(!skipJQ)scripts.push('//ajax.googleapis.com/ajax/libs/jquery/1.11.1/jquery.min.js')
            if(!skipJQ)scripts.push('//ajax.googleapis.com/ajax/libs/angularjs/1.2.25/angular.min.js')
            if(loadCnvXScript)scripts.push( xScrUrl)
            l.require(scripts,function(){
                //console.log("JQ&NG LOADED INITING APP path="+window._cnv_init_script_path)
                //initApp(angular)
                initApp()
                //console.log("APP INITED LOADING COMPONENTS path="+window._cnv_init_script_path)
                if(window._cnv_init_script_path){
                    var l1=new Loader();
                    l1.require([window._cnv_init_script_path],function(){
                        //console.log("APP COMPLETE LOADING COMPONENTS")
                        //l1.require(['/files/_templates_landing-pages_landing-event-cta-email_script'],function(){
                        if($(document).foundation)$(document).foundation()
                        $('.cnv-hide-before-init').removeClass("cnv-hide-before-init")
                    })}else{
                    console.log("window._cnv_init_script_path not defined")
                }
            })
        }else{
            //console.log("loading synchronous")

            var ieVer=detectIE()

            var loadScript=function(ieVer,url) {
                if (ieVer != false && ieVer < 10 && window.cnvIEMessage)alert(window.cnvIEMessage)
                var xhrObj = new XMLHttpRequest();
                if (ieVer != false && ieVer < 10)xhrObj = new XDomainRequest()
                xhrObj.open('GET', url, false);
                xhrObj.send('');
                var se = document.createElement('script');
                se.type = "text/javascript";
                se.text = xhrObj.responseText;
                document.getElementsByTagName('head')[0].appendChild(se);
                return se
            }
            if(!skipJQ) {
                loadScript(ieVer,"//ajax.googleapis.com/ajax/libs/jquery/1.11.1/jquery.min.js");
            }
            if(!skipNG) {
                loadScript(ieVer, "//ajax.googleapis.com/ajax/libs/angularjs/1.2.25/angular.min.js");
            }
            if(loadCnvXScript){
                loadScript(ieVer,xScrUrl);
            }


            var se3 = null

            if(!isTaglyCmsEditMode()){
                se3=loadScript(ieVer,window._cnv_init_script_path)
                //TODO xhrObj3.onload=initApp ??? - should it wait untill loaded
                initApp()
            }else{
                se3=document.createElement('script');
                se3.type = "text/javascript";
                se3.src=window._cnv_init_script_path
                se3.onload=initApp
                document.getElementsByTagName('head')[0].appendChild(se3);
            }
        }
    }


    var initApp=function(){
        if(!isTaglyCmsEditMode()){
            if($("html").attr("ng-app")==null) {
                angular.element(document).ready(function() {
                    angular.bootstrap(document, ['cnvrtlyComponents']);
                })
            }else{
                angular.module('tagyCmsClientApp',['cnvrtlyComponents'])
            }
        }else{
            if($("html").attr("ng-app")==null) {
                angular.element(document).ready(function() {
                    angular.bootstrap(document, ['tagyCmsClientApp','cnvrtlyComponents']);
                })
            }else{
                console.log("INFO - App already inited - has ng-app attribute in HTML so component directives are not added")
            }
        }
        if($){
            $(document).ready(function(){
                $('.cnv-hide-before-init').removeClass("cnv-hide-before-init")
                if( $(document).foundation!=null){$(document).foundation()}
            })
        }
    }


    var isDevMode=function(){
        return window._isDevEnvironment==true
    }
    //console.log("TEMPLATE INIT START app.js isDev=",isDevMode())
    if(!isTaglyCmsEditMode() && !isDevMode()){
        loadScripts(window.cnvInitAsync,false,false,window.cnvXScriptLoad)
        //console.log("TEMPLATE APP INITEDDD isEdit=",isTaglyCmsEditMode())
    }else if(isDevMode()){
        console.log("DEV MODE TEMPLATE")
        initApp()
    }else if(isTaglyCmsEditMode()){
        loadScripts(false,true,true,false)
    }
}(document,window));