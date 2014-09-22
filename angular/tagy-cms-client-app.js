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
        writeScript: function (src) {
            var self = this;
            var s = document.createElement('script');
            s.type = "text/javascript";
            s.async = true;
            s.src = src;
            s.addEventListener('load', function (e) { self.loaded(e); }, false);
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

    var loadScripts=function(loadAsync){
        if(loadAsync==null)loadAsync=true
        if(loadAsync){
            var l=new Loader();
            l.require(['//ajax.googleapis.com/ajax/libs/jquery/1.11.0/jquery.min.js'
                ,'//ajax.googleapis.com/ajax/libs/angularjs/1.2.12/angular.min.js'
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
            var xhrObj = new XMLHttpRequest();
            xhrObj.open('GET', "//ajax.googleapis.com/ajax/libs/jquery/1.11.0/jquery.min.js", false);
            xhrObj.send('');
            var se = document.createElement('script');
            se.type = "text/javascript";
            se.text = xhrObj.responseText;
            document.getElementsByTagName('head')[0].appendChild(se);

            var xhrObj1 = new XMLHttpRequest();
            xhrObj1.open('GET', "//ajax.googleapis.com/ajax/libs/angularjs/1.2.12/angular.min.js", false);
            xhrObj1.send('');
            var se1 = document.createElement('script');
            se1.type = "text/javascript";
            se1.text = xhrObj1.responseText;
            document.getElementsByTagName('head')[0].appendChild(se1);

            initApp(angular)

            var xhrObj3 = new XMLHttpRequest();
            xhrObj3.open('GET', window._cnv_init_script_path, false);
            xhrObj3.send('');
            var se3 = document.createElement('script');
            se3.type = "text/javascript";
            se3.text = xhrObj3.responseText;
            document.getElementsByTagName('head')[0].appendChild(se3);

            $(document).ready(function(){
                console.log("cnv-hide-before-init EXECUTED DOC",$('.cnv-hide-before-init').length)
                $('.cnv-hide-before-init').removeClass("cnv-hide-before-init")
                $(document).foundation()
            })
        }
    }
    var initApp=function(angular){
        //console.log("initAPPPPP",angular)
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