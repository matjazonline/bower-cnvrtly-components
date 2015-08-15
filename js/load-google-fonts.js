window.CnvFonts=(function(doc ) {
    var js,
        elTagName='link'
        fjs = (doc.getElementsByTagName(elTagName)[0]||doc.head),
        add = function(url, cssFontTitle,cssElementSelector,cssProps) {
            if (doc.getElementById(cssFontTitle)) {return;}
            js = doc.createElement(elTagName);
            //if(elTagName=='link'){
                js.href = url;
                js.type="text/css";
                js.rel="stylesheet";
                js['remove-in-production']="true";
                /*}else{
                js.src=url;
                js.async="true";
                js.type="text/javascript";
            }*/
            cssFontTitle && (js.id = cssFontTitle);

            var styleEl=doc.createElement("style");
            styleEl.type = 'text/css';
            if(cssElementSelector=="text"){
                cssElementSelector='body,p,.paragraph-font,ul,ol,dl'
            }else if(cssElementSelector=="title"){
                cssElementSelector='h1, h2, h3, h4, h5, h6,.title-font'
            }
            if(!cssProps)cssProps=''
            var css=cssElementSelector+'{font-family: "'+cssFontTitle+'",sans;'+cssProps+'}'
            if (styleEl.styleSheet){
                styleEl.styleSheet.cssText = css;
            } else {
                styleEl.appendChild(document.createTextNode(css));
            }
            if(fjs==doc.head){
                doc.head.appendChild(js)
                doc.head.appendChild(styleEl)
            }else{
                fjs.parentNode.insertBefore(js, fjs);
                fjs.parentNode.insertBefore(styleEl, fjs);
            }
        };
    /*setTimeout(function(){
        add('//fonts.googleapis.com/css?family=Playball&subset=latin',"font1_id");
        add('//fonts.googleapis.com/css?family=Raleway&subset=latin',"font2_id");
    },0)*/
    var self=this
    this.load= function(fontsUrl,fontCssName,cssElementSelector){
        setTimeout(function(){
            self.add(fontsUrl,fontCssName,cssElementSelector);
        },0)
        return self
    }
    return self

}(document ));