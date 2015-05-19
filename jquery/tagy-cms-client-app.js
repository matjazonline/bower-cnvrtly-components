'use strict';
(function(document,window) {
    window.cnvUseNgComponents=false
    window.TagyCmsClient={}
    var Loader = function () { }
    Loader.prototype = {
        require: function (scripts, callback,async) {
            this.loadCount      = 0;
            this.totalRequired  = scripts.length;
            this.callback       = callback;

            for (var i = 0; i < scripts.length; i++) {
                this.writeScript(scripts[i],async);
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
    window.TagyCmsClient.isEditMode=function(){
        var ngAppElem = document.querySelectorAll('[ng-app]');
        if(ngAppElem.length>1)alert("Multiple ng-app definitions in html!")
        var htmlElem=document.querySelector("html")
        if(htmlElem!=null && htmlElem!=null && htmlElem.classList != null && htmlElem.classList.contains!=null) {
            return htmlElem.classList.contains("tagy-cms-edit-mode")
        }else{
            return false
        }
    }

    var loadScripts=function(loadAsync,skipJQ,skipNG,loadCnvXScript){
        if(loadAsync==null)loadAsync=true

        var xScrUrl=window.location.port.length>2?'//localhost:8080/cnvXScript.js':'//cnvrtly.appspot.com/cnvXScript.js'
        if(window.cnvXScriptDebug)xScrUrl=xScrUrl+'?d=true'
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
                    },true)}else{
                    console.log("window._cnv_init_script_path not defined")
                }
            },true)
        }else{
            //console.log("loading synchronous")

            //TODO remove Loader or loadScript
            var loadScript=function(url,async) {
                var xhrObj = createCORSRequest('GET', url, async);
                if(xhrObj) {
                    xhrObj.send('');
                    var se = document.createElement('script');
                    se.type = "text/javascript";
                    se.text = xhrObj.responseText;
                    document.getElementsByTagName('head')[0].appendChild(se);
                    return se
                }
                return null
            }
            if(!skipJQ) {
                loadScript("//ajax.googleapis.com/ajax/libs/jquery/1.11.1/jquery.min.js",false);
            }
            if(!skipNG) {
                loadScript( "//ajax.googleapis.com/ajax/libs/angularjs/1.2.25/angular.min.js",false);
            }
            if(loadCnvXScript){
                loadScript(xScrUrl,false);
            }


            var se3 = null

            if(window.TagyCmsClient.isEditMode()){//&& window.top!==window) {
                var parser = document.createElement('a');
                parser.href = window._cnv_init_script_path
                window._cnv_init_script_path='//'+window.top.location.host+parser.pathname+'?ns='+parser.hostname
            }
                se3=loadScript(window._cnv_init_script_path,false)
                initApp()
            /*if(!window.TagyCmsClient.isEditMode()){
                se3=loadScript(window._cnv_init_script_path,false)
                initApp()
            }else{
                var parser = document.createElement('a');
                parser.href = window._cnv_init_script_path
                var ns=parser.hostname

                console.log("LLLLLLLLLLLL222",ns,)
                se3=document.createElement('script');
                se3.type = "text/javascript";
                se3.src=window._cnv_init_script_path
                se3.async=false
                se3.onload=initApp
                document.getElementsByTagName('head')[0].appendChild(se3);
            }*/
        }
    }

    // Create the XHR object.
    var createCORSRequest=function(method, url,async) {
        var xhr = new XMLHttpRequest();
        if ("withCredentials" in xhr) {
            // XHR for Chrome/Firefox/Opera/Safari.
            xhr.open(method, url, async);
        } else if (typeof XDomainRequest != "undefined") {
            // XDomainRequest for IE.
            xhr = new XDomainRequest();
            xhr.open(method, url);
        } else {
            // CORS not supported.
            xhr = null;
        }
        return xhr;
    }


    var initApp=function(){
        var cnvComp = 'cnvrtlyComponents';
        var ccArr=[]
        if(window.cnvUseNgComponents)ccArr.push(cnvComp)
        if(!window.TagyCmsClient.isEditMode()){
            if(window.angular){
                if($("html").attr("ng-app")==null) {
                    angular.element(document).ready(function() {
                        angular.bootstrap(document, ccArr);
                    })
                }else{
                    angular.module('tagyCmsClientApp',ccArr)
                }
            }
        }else{
            if(window.angular) {
                if ($("html").attr("ng-app") == null) {
                    angular.element(document).ready(function () {
                        ccArr.unshift('tagyCmsClientApp')
                        angular.bootstrap(document, ccArr );
                    })
                } else {
                    console.log("INFO - App already inited - has ng-app attribute in HTML so component directives are not added")
                }
            }
        }
        if(window.$){
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
    if(!window.TagyCmsClient.isEditMode() && !isDevMode()){
        loadScripts(window.cnvInitAsync,false,!window.cnvUseNgComponents,window.cnvXScriptLoad)
    }else if(isDevMode()){
        initApp()
    }else if(window.TagyCmsClient.isEditMode()){
        loadScripts(false,true,true,true)
    }
}(document,window));