YUI.add("controller",function(a){var h=a.HistoryHash,e=a.Lang,b=a.QueryString,j=a.Array,f=a.HistoryBase.html5&&(!a.UA.android||a.UA.android>=3),g=a.config.win,k=g.location,i=[],d="ready";function c(){c.superclass.constructor.apply(this,arguments);}a.Controller=a.extend(c,a.Base,{html5:f,root:"",routes:[],_regexPathParam:/([:*])([\w-]+)/g,_regexUrlQuery:/\?([^#]*).*$/,_regexUrlStrip:/^https?:\/\/[^\/]*/i,initializer:function(m){var l=this;m||(m={});m.routes&&(l.routes=m.routes);e.isValue(m.root)&&(l.root=m.root);l._routes=[];j.each(l.routes,function(n){l.route(n.path,n.callback);});if(f){l._history=new a.HistoryHTML5({force:true});a.after("history:change",l._afterHistoryChange,l);}else{a.on("hashchange",l._afterHistoryChange,g,l);}l.publish(d,{defaultFn:l._defReadyFn,fireOnce:true,preventable:false});l.once("initializedChange",function(){a.once("load",function(){setTimeout(function(){l.fire(d,{dispatched:!!l._dispatched});},20);});});},destructor:function(){if(f){a.detach("history:change",this._afterHistoryChange,this);}else{a.detach("hashchange",this._afterHistoryChange,g);}},dispatch:function(){this.once(d,function(){this._ready=true;if(f&&this.upgrade()){return;}else{this._dispatch(this._getPath(),this._getURL());}});return this;},getPath:function(){return this._getPath();},hasRoute:function(l){return !!this.match(this.removeRoot(l)).length;},match:function(l){return j.filter(this._routes,function(m){return l.search(m.regex)>-1;});},removeRoot:function(m){var l=this.root;m=m.replace(this._regexUrlStrip,"");if(l&&m.indexOf(l)===0){m=m.substring(l.length);}return m.charAt(0)==="/"?m:"/"+m;},replace:function(l){return this._queue(l,true);},route:function(m,n){var l=[];this._routes.push({callback:n,keys:l,path:m,regex:this._getRegex(m,l)});return this;},save:function(l){return this._queue(l);},upgrade:f?function(){var l=this._getHashPath();if(l&&l.charAt(0)==="/"){this.once(d,function(){this.replace(l);});return true;}return false;}:function(){return false;},_decode:function(l){return decodeURIComponent(l.replace(/\+/g," "));},_dequeue:function(){var l=this,m;if(!YUI.Env.windowLoaded){a.once("load",function(){l._dequeue();});return this;}m=i.shift();return m?m():this;},_dispatch:function(q,n,r){var m=this,l=m.match(q),p,o;m._dispatching=m._dispatched=true;if(!l||!l.length){m._dispatching=false;return m;}p=m._getRequest(q,n,r);o=m._getResponse(p);p.next=function(t){var v,u,s;if(t){a.error(t);}else{if((s=l.shift())){u=s.regex.exec(q);v=typeof s.callback==="string"?m[s.callback]:s.callback;if(u.length===s.keys.length+1){p.params=j.hash(s.keys,u.slice(1));}else{p.params=u.concat();}v.call(m,p,o,p.next);}}};p.next();m._dispatching=false;return m._dequeue();},_getHashPath:function(){return h.getHash().replace(this._regexUrlQuery,"");},_getPath:f?function(){return this.removeRoot(k.pathname);}:function(){return this._getHashPath()||this.removeRoot(k.pathname);},_getQuery:f?function(){return k.search.substring(1);}:function(){var m=h.getHash(),l=m.match(this._regexUrlQuery);return m&&l?l[1]:k.search.substring(1);},_getRegex:function(m,l){if(m instanceof RegExp){return m;}if(m==="*"){return/.*/;}m=m.replace(this._regexPathParam,function(o,n,p){l.push(p);return n==="*"?"(.*?)":"([^/]*)";});return new RegExp("^"+m+"$");},_getRequest:function(m,l,n){return{path:m,query:this._parseQuery(this._getQuery()),url:l,src:n};},_getResponse:function(m){var l=function(){return m.next.apply(this,arguments);};l.req=m;return l;},_getURL:function(){return k.toString();},_joinURL:function(m){var l=this.root;m=this.removeRoot(m);if(m.charAt(0)==="/"){m=m.substring(1);}return l&&l.charAt(l.length-1)==="/"?l+m:l+"/"+m;},_parseQuery:b&&b.parse?b.parse:function(o){var p=this._decode,r=o.split("&"),n=0,m=r.length,l={},q;for(;n<m;++n){q=r[n].split("=");if(q[0]){l[p(q[0])]=p(q[1]||"");}}return l;},_queue:function(){var m=arguments,l=this;i.push(function(){if(f){if(a.UA.ios&&a.UA.ios<5){l._save.apply(l,m);}else{setTimeout(function(){l._save.apply(l,m);},1);}}else{l._dispatching=true;l._save.apply(l,m);}return l;});return !this._dispatching?this._dequeue():this;},_save:f?function(l,m){this._ready=true;this._history[m?"replace":"add"](null,{url:typeof l==="string"?this._joinURL(l):l});return this;}:function(l,m){this._ready=true;if(typeof l==="string"&&l.charAt(0)!=="/"){l="/"+l;}h[m?"replaceHash":"setHash"](l);return this;},_afterHistoryChange:function(m){var l=this,n=m.src;if(l._ready||n!=="popstate"){l._dispatch(l._getPath(),l._getURL(),n);}},_defReadyFn:function(l){this._ready=true;}},{NAME:"controller"});},"@VERSION@",{optional:["querystring-parse"],requires:["array-extras","base-build","history"]});