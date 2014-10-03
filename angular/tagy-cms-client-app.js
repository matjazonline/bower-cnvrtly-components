'use strict';
(function(document) {
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
        if(ngAppElem!=null && ngAppElem[0]!=null && ngAppElem[0].classList != null && ngAppElem[0].classList.contains!=null) {
            return ngAppElem[0].classList.contains("tagy-cms-edit-mode")
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

    var loadScripts=function(loadAsync){
        if(loadAsync==null)loadAsync=true
        if(loadAsync){
            var l=new Loader();
            l.require(['//ajax.googleapis.com/ajax/libs/jquery/1.11.1/jquery.min.js'
                ,'//ajax.googleapis.com/ajax/libs/angularjs/1.2.25/angular.min.js'
            ],function(){
                //console.log("JQ&NG LOADED INITING APP path="+window._cnv_init_script_path)
                initApp(angular)
                //console.log("APP INITED LOADING COMPONENTS path="+window._cnv_init_script_path)
                if(window._cnv_init_script_path){
                    var l1=new Loader();
                    l1.require([window._cnv_init_script_path],function(){
                        console.log("APP COMPLETE LOADING COMPONENTS")
                        //l1.require(['/files/_templates_landing-pages_landing-event-cta-email_script'],function(){
                        $(document).foundation()
                        $('.cnv-hide-before-init').removeClass("cnv-hide-before-init")
                    })}else{
                    console.log("window._cnv_init_script_path not defined")
                }
            })
        }else{
            console.log("SYNCCCCLOAD")

            var ieVer=detectIE()
            if(ieVer!=false && ieVer<10 && window._cnv_ie_message)alert(window._cnv_ie_message)
            var xhrObj = new XMLHttpRequest();
            if(ieVer!=false && ieVer<10)xhrObj=new XDomainRequest()
            xhrObj.open('GET', "//ajax.googleapis.com/ajax/libs/jquery/1.11.1/jquery.min.js", false);
            xhrObj.send('');
            var se = document.createElement('script');
            se.type = "text/javascript";
            se.text = xhrObj.responseText;
            document.getElementsByTagName('head')[0].appendChild(se);

            var xhrObj1 = new XMLHttpRequest();
            if(ieVer!=false && ieVer<10)xhrObj1=new XDomainRequest()
            xhrObj1.open('GET', "//ajax.googleapis.com/ajax/libs/angularjs/1.2.25/angular.min.js", false);
            xhrObj1.send('');
            var se1 = document.createElement('script');
            se1.type = "text/javascript";
            se1.text = xhrObj1.responseText;
            document.getElementsByTagName('head')[0].appendChild(se1);

            //initApp(angular)

            var xhrObj3 = new XMLHttpRequest();
            if(ieVer!=false && ieVer<10)xhrObj3=new XDomainRequest()
            xhrObj3.open('GET', window._cnv_init_script_path, false);
            xhrObj3.send('');
            var se3 = document.createElement('script');
            se3.type = "text/javascript";
            se3.text = xhrObj3.responseText;
            document.getElementsByTagName('head')[0].appendChild(se3);

            initApp(angular)

            $(document).ready(function(){
                $('.cnv-hide-before-init').removeClass("cnv-hide-before-init")
                $(document).foundation()
            })
        }
    }
    var initApp=function(angular){
        angular.module('tagyCmsClientApp',['cnvrtlyComponents'])
    }

    var isDevMode=function(){
        return window._isDevEnvironment==true
        /*var htmlElem = document.querySelectorAll('html');
         return htmlElem[0].classList.contains("development")*/
    }
    console.log("TEMPLATE INIT START app.js isDev=",isDevMode())
    if(!isTaglyCmsEditMode() && !isDevMode()){
        //console.log("TEMPLATE APP LOAD START",window._cnv_init_async)
        loadScripts(window._cnv_init_async)
        console.log("TEMPLATE APP INITEDDD")
    }else if(isDevMode()){
        console.log("DEV MODE TEMPLATE")
        initApp(angular)
    }
}(document));