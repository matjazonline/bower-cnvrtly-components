'use strict';
(function(documentObj,windowObj) {
    windowObj.cnvUseNgComponents=false
    windowObj.TagyCmsClient={}
    var Loader = function () { }
    Loader.prototype = {
        require: function (scripts, callback, async) {
            this.loadCount = 0;
            this.totalRequired = scripts.length;
            this.callback = callback;

            for (var i = 0; i < scripts.length; i++) {
                this.writeScript(scripts[i], async);
            }
        },
        loaded: function (evt) {
            this.loadCount++;

            if (this.loadCount == this.totalRequired && typeof this.callback == 'function') this.callback.call();
        },
        writeScript: function (src, async) {
            var self = this;
            var s = documentObj.createElement('script');
            s.type = "text/javascript";
            s.async = async == null ? true : async;
            s.src = src;
            if (s.async){
                s.addEventListener('load', function (e) {
                    self.loaded(e);
                }, false);
            }
            documentObj.getElementsByTagName("head")[0].appendChild(s);
        }
    };
    windowObj.TagyCmsClient.isEditMode=function(){
        var ngAppElem = documentObj.querySelectorAll('[ng-app]');
        if(ngAppElem.length>1)alert("Multiple ng-app definitions in html!")
        var htmlElem=documentObj.querySelector("html")
        if(htmlElem!=null && htmlElem!=null && htmlElem.classList != null && htmlElem.classList.contains!=null) {
            return htmlElem.classList.contains("tagy-cms-edit-mode")
        }else{
            return false
        }
    }

    var loadScripts=function(loadAsync,skipJQ,skipNG,loadCnvXScript){
        if(loadAsync==null)loadAsync=true

        var xScrUrl=isLocalServer()?'//'+localHostName+'/cnvXScript.js':'//cnvrtly.appspot.com/cnvXScript.js'
        if(windowObj.cnvXScriptDebug)xScrUrl=xScrUrl+'?d=true'
        if(loadAsync){
            console.log("loading Asynchronous")
            var l=new Loader();
            var scripts=[]
            if(!skipJQ)scripts.push('//ajax.googleapis.com/ajax/libs/jquery/1.11.1/jquery.min.js')
            if(!skipJQ)scripts.push('//ajax.googleapis.com/ajax/libs/angularjs/1.2.25/angular.min.js')
            if(loadCnvXScript)scripts.push( xScrUrl)
            l.require(scripts,function(){
                //console.log("JQ&NG LOADED INITING APP path="+windowObj._cnv_init_script_path)
                //initApp(angular)
                initApp()
                //console.log("APP INITED LOADING COMPONENTS path="+windowObj._cnv_init_script_path)
                if(windowObj._cnv_init_script_path){
                    var l1=new Loader();
                    l1.require([windowObj._cnv_init_script_path],function(){
                        //console.log("APP COMPLETE LOADING COMPONENTS")
                        //l1.require(['/files/_templates_landing-pages_landing-event-cta-email_script'],function(){
                        if($(documentObj).foundation){
                            $(documentObj).foundation();
                        }

                        $('.cnv-hide-before-init').removeClass("cnv-hide-before-init");
                    },true)}else{
                    console.log("windowObj._cnv_init_script_path not defined")
                }
            },true)
        }else{
            //console.log("loading synchronous")

            //TODO remove Loader or loadScript
            var loadScript = function (url, async) {
                var xhrObj = createCORSRequest('GET', url, async);
                if (xhrObj) {
                    xhrObj.send('');
                    var scriptEl = documentObj.createElement('script');
                    scriptEl.type = "text/javascript";
                    scriptEl.text = xhrObj.responseText;
                    //console.log("load=",url, documentObj)
                    var headEl=documentObj.head || documentObj.getElementsByTagName('head')[0];

                    headEl.appendChild(scriptEl);
                    return scriptEl;
                }
                return null;
            };
            if(!skipJQ) {
                loadScript("//ajax.googleapis.com/ajax/libs/jquery/1.11.1/jquery.min.js",false);
            }
            if(!skipNG) {
                loadScript( "//ajax.googleapis.com/ajax/libs/angularjs/1.2.25/angular.min.js",false);
            }
            if(loadCnvXScript){
                loadScript(xScrUrl,false);
            }


            var se3 = null;

            if(windowObj.TagyCmsClient.isEditMode()){//&& windowObj.top!==windowObj) {
                var parser = documentObj.createElement('a');
                parser.href = windowObj._cnv_init_script_path
                var host = isLocalServer() && !isDevMode()? localHostName : windowObj.top.location.host;
                windowObj._cnv_init_script_path='//'+host+parser.pathname+'?ns='+parser.hostname
            }
            se3=loadScript(windowObj._cnv_init_script_path,false)
            initApp()
            /*if(!windowObj.TagyCmsClient.isEditMode()){
             se3=loadScript(windowObj._cnv_init_script_path,false)
             initApp()
             }else{
             var parser = documentObj.createElement('a');
             parser.href = windowObj._cnv_init_script_path
             var ns=parser.hostname

             console.log("LLLLLLLLLLLL222",ns,)
             se3=documentObj.createElement('script');
             se3.type = "text/javascript";
             se3.src=windowObj._cnv_init_script_path
             se3.async=false
             se3.onload=initApp
             documentObj.getElementsByTagName('head')[0].appendChild(se3);
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
        if(windowObj.cnvUseNgComponents)ccArr.push(cnvComp)
        if(!windowObj.TagyCmsClient.isEditMode()){
            if(windowObj.angular){
                if($("html").attr("ng-app")==null) {
                    angular.element(documentObj).ready(function() {
                        angular.bootstrap(documentObj, ccArr);
                    })
                }else{
                    angular.module('tagyCmsClientApp',ccArr)
                }
            }
        }else{
            if(windowObj.angular) {
                if ($("html").attr("ng-app") == null) {
                    angular.element(documentObj).ready(function () {
                        ccArr.unshift('tagyCmsClientApp')
                        angular.bootstrap(documentObj, ccArr );
                    })
                } else {
                    console.log("INFO - App already inited - has ng-app attribute in HTML so component directives are not added")
                }
            }
        }
        if(windowObj.$){
            $(documentObj).ready(function(){
                $('.cnv-hide-before-init').removeClass("cnv-hide-before-init")
                if( $(documentObj).foundation!=null){$(documentObj).foundation()}
            })
        }
    }

    var localHostName = 'localhost:8080';
    var isLocalServer=function(){
        return windowObj.location.port.length > 2;
    }
    var isDevMode=function(){
        return windowObj._isDevEnvironment==true
    }
    /*var isDevUIMode=function(){
     return !isDevMode() && windowObj.top.location.host.indexOf('127.0.0.1')>-1;
     }*/
    //console.log("TEMPLATE INIT START app.js isDev=",isDevMode())
    if(!windowObj.TagyCmsClient.isEditMode() && !isDevMode()){
        loadScripts(windowObj.cnvInitAsync,false,!windowObj.cnvUseNgComponents,windowObj.cnvXScriptLoad)
    }else if(isDevMode()){
        initApp()
    }else if(windowObj.TagyCmsClient.isEditMode()){
        loadScripts(false,true,true,true)
    }
}(document,window));