YUI.add("get",function(A){(function(){var C=A.UA,B=A.Lang,D=A.guid("yui_");A.Get=function(){var L={},J=0,E=0,S=false;var U=function(Y,V,Z){var W=Z||A.config.win,a=W.document,b=a.createElement(Y);for(var X in V){if(V[X]&&V.hasOwnProperty(X)){b.setAttribute(X,V[X]);}}return b;};var R=function(V,W,Y){var X=Y||"utf-8";return U("link",{"id":D+(E++),"type":"text/css","charset":X,"rel":"stylesheet","href":V},W);};var Q=function(V,W,Y){var X=Y||"utf-8";return U("script",{"id":D+(E++),"type":"text/javascript","charset":X,"src":V},W);};var M=function(c){var Z=L[c];if(Z){var b=Z.nodes,V=b.length,a=Z.win.document,Y=a.getElementsByTagName("head")[0];if(Z.insertBefore){var X=K(Z.insertBefore,c);if(X){Y=X.parentNode;}}for(var W=0;W<V;W=W+1){Y.removeChild(b[W]);}}Z.nodes=[];};var N=function(V,W){return{tId:V.tId,win:V.win,data:V.data,nodes:V.nodes,msg:W,purge:function(){M(this.tId);}};};var T=function(Y,X){var V=L[Y];if(V.timer){V.timer.cancel();}if(V.onFailure){var W=V.context||V;V.onFailure.call(W,N(V,X));}};var K=function(V,Y){var W=L[Y],X=(B.isString(V))?W.win.document.getElementById(V):V;if(!X){T(Y,"target node not found: "+V);}return X;};var H=function(Y){var V=L[Y];if(V.timer){V.timer.cancel();}V.finished=true;if(V.aborted){var X="transaction "+Y+" was aborted";T(Y,X);return;}if(V.onSuccess){var W=V.context||V;V.onSuccess.call(W,N(V));}};var O=function(X){var V=L[X];if(V.onTimeout){var W=V.context||V;V.onTimeout.call(W,N(V));}};var G=function(X,a){var W=L[X];if(W.timer){W.timer.cancel();}if(W.aborted){var Z="transaction "+X+" was aborted";T(X,Z);return;}if(a){W.url.shift();if(W.varName){W.varName.shift();}}else{W.url=(B.isString(W.url))?[W.url]:W.url;if(W.varName){W.varName=(B.isString(W.varName))?[W.varName]:W.varName;}}var e=W.win,c=e.document,b=c.getElementsByTagName("head")[0],Y;if(W.url.length===0){H(X);return;}var V=W.url[0];if(!V){W.url.shift();return G(X);}if(W.timeout){W.timer=B.later(W.timeout,W,O,X);}if(W.type==="script"){Y=Q(V,e,W.charset);}else{Y=R(V,e,W.charset);}I(W.type,Y,X,V,e,W.url.length);W.nodes.push(Y);if(W.insertBefore){var f=K(W.insertBefore,X);if(f){f.parentNode.insertBefore(Y,f);}}else{b.appendChild(Y);}if((C.webkit||C.gecko)&&W.type==="css"){G(X,V);}};var F=function(){if(S){return;}S=true;for(var V in L){if(L.hasOwnProperty(V)){var W=L[V];if(W.autopurge&&W.finished){M(W.tId);delete L[V];}}}S=false;};var P=function(W,V,X){var Z="q"+(J++);X=X||{};if(J%A.Get.PURGE_THRESH===0){F();}L[Z]=A.merge(X,{tId:Z,type:W,url:V,finished:false,nodes:[]});var Y=L[Z];Y.win=Y.win||A.config.win;Y.context=Y.context||Y;Y.autopurge=("autopurge" in Y)?Y.autopurge:(W==="script")?true:false;B.later(0,Y,G,Z);return{tId:Z};};var I=function(X,c,b,W,a,Z,V){var Y=V||G;if(C.ie){c.onreadystatechange=function(){var d=this.readyState;if("loaded"===d||"complete"===d){c.onreadystatechange=null;Y(b,W);}};}else{if(C.webkit){if(X==="script"){c.addEventListener("load",function(){Y(b,W);});}}else{c.onload=function(){Y(b,W);};c.onerror=function(d){T(b,d+": "+W);};}}};return{PURGE_THRESH:20,_finalize:function(V){B.later(0,null,H,V);},abort:function(W){var X=(B.isString(W))?W:W.tId;var V=L[X];if(V){V.aborted=true;}},script:function(V,W){return P("script",V,W);},css:function(V,W){return P("css",V,W);}};}();})();},"@VERSION@");