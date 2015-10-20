window.CnvFonts=(function(doc ) {
    var js,
        elTagName='link'
        fjs = (doc.getElementsByTagName(elTagName)[0]||doc.head),
        add = function(cssElementSelector,url, cssFontTitle,cssProps, maxFontSize) {
            var fontWeightArr,fontSize,fontSubset;
            if( cssElementSelector=="title"){
                cssFontTitle=!cssFontTitle?$('meta[name="titleGoogleFont"]',document.head).attr("content"):cssFontTitle;
                maxFontSize=!maxFontSize?$('meta[name="titleFontSize"]',document.head).attr("content"):maxFontSize;
            }else if(!cssFontTitle && cssElementSelector=="paragraph"){
                cssFontTitle=!cssFontTitle?$('meta[name="paragraphGoogleFont"]',document.head).attr("content"):cssFontTitle;
                maxFontSize=!maxFontSize?$('meta[name="paragraphFontSize"]',document.head).attr("content"):maxFontSize;
            }
            if(cssFontTitle.toString().indexOf(':')) {
                var fWArr = cssFontTitle.toString().split(':');
                cssFontTitle = fWArr[0];
                if(isNaN(fWArr[1])){
                    fontSubset = fWArr[1];
                    fontWeightArr = fWArr.slice(2);
                }else{
                    fontWeightArr = fWArr.slice(1);
                }
            }
            if(maxFontSize){
                var mFSArr = maxFontSize.toString().split(':');
                fontSize = mFSArr[0];
                if(!fontWeightArr)fontWeightArr = mFSArr.slice(1);
            }
            if (!cssFontTitle && doc.getElementById(cssFontTitle)) {return;}

            var toFontWeightCss = function (ind, fontWArr) {
                if (fontWArr && fontWArr.length) {
                    if (ind > fontWArr.length) {
                        ind = fontWArr.length;
                    }
                    return 'font-weight:' + fontWArr[ind - 1] + ';'
                }
                return '';
            };
            js = doc.createElement(elTagName);
            //if(elTagName=='link'){
            //fonts.googleapis.com/css?family=Quicksand:400&subset=latin
            js.href = "//fonts.googleapis.com/css?family=" + cssFontTitle.replace(' ', '+');
            if(fontWeightArr && fontWeightArr.length){
                js.href+=':'+fontWeightArr.join(',');
            }
            if(fontSubset) {
                js.href += '&subset=' + fontSubset;
            }
                js.type="text/css";
                js.rel="stylesheet";
                js['remove-in-production']="true";
                /*}else{
                js.src=url;
                js.async="true";
                js.type="text/javascript";
            }*/
            js.id = cssFontTitle;
            var fontSizeCss=''
            var styleEl=doc.createElement("style");
            styleEl.type = 'text/css';
            if(cssElementSelector=="paragraph"){
                cssElementSelector = 'body,p,.paragraph-font,ul,ol,dl';
                if(fontSize) {
                    fontSizeCss=cssElementSelector+"{font-size:"+fontSize+"em;"+toFontWeightCss(1,fontWeightArr)+"}"
                }
            }else if(cssElementSelector=="title"){
                cssElementSelector = 'h1, h2, h3, h4, h5, h6,.title-font';
                if(fontSize) {
                    fontSize = parseFloat(fontSize);
                    var h2Size = fontSize * 0.8;
                    var h3Size = (fontSize / 1.61).toFixed(2);
                    var h4Size = parseFloat(h3Size) * 0.8;
                    var h5Size = parseFloat(h4Size) * 0.8;
                    fontSizeCss += '@media only screen {';
                    fontSizeCss += "h1, .h1-size{font-size:" + fontSize * 0.8 + "em;" + toFontWeightCss(1, fontWeightArr) + "}h2,.h2-size{font-size:" + parseFloat(h2Size) * 0.8 + "em;" + toFontWeightCss(2, fontWeightArr) + "}h3,.h3-size{font-size:" + parseFloat(h3Size) * 0.8 + "em;" + toFontWeightCss(3, fontWeightArr) + "}h4{font-size:" + parseFloat(h4Size) * 0.8 + "em;" + toFontWeightCss(4, fontWeightArr) + "}h5{font-size:" + parseFloat(h5Size) * 0.8 + "em;" + toFontWeightCss(5, fontWeightArr) + "}";
                    fontSizeCss += '}';
                    fontSizeCss += '@media only screen and (min-width: 768px) {';
                    fontSizeCss += "h1, .h1-size{font-size:" + fontSize + "em;" + toFontWeightCss(1, fontWeightArr) + "}h2,.h2-size{font-size:" + h2Size + "em;" + toFontWeightCss(2, fontWeightArr) + "}h3,.h3-size{font-size:" + h3Size + "em;" + toFontWeightCss(3, fontWeightArr) + "}h4, .h4-size{font-size:" + h4Size + "em;" + toFontWeightCss(4, fontWeightArr) + "}h5, .h5-size{font-size:" + h5Size + "em;" + toFontWeightCss(5, fontWeightArr) + "}";
                    fontSizeCss += '}';
                }
            }


            if(!cssProps)cssProps = '';
            var css = cssElementSelector + '{font-family: "' + cssFontTitle + '",sans;' + cssProps + '}' + fontSizeCss;
            if (styleEl.styleSheet){
                styleEl.styleSheet.cssText = css;
            } else {
                styleEl.appendChild(document.createTextNode(css));
            }
            if(fjs==doc.head){
                doc.head.appendChild(js);
                doc.head.appendChild(styleEl);
            }else{
                fjs.parentNode.insertBefore(js, fjs);
                fjs.parentNode.insertBefore(styleEl, fjs);
            }
        };
    var self=this
    this.load= function(cssElementSelector,fontsUrl,fontCssName,cssProps, maxFontSize){
        setTimeout(function () {
            self.add( cssElementSelector,fontsUrl, fontCssName, cssProps, maxFontSize);
        }, 0);
        return self;
    }
    this.initMeta=function(){
        this.load('title').load("paragraph");
    }
    return self;

}(document ));