this._s=this._s||{};(function(_){var window=this;
try{
_.Gvb=function(a){this.Gm=a};
}catch(e){_._DumpException(e)}
try{
var Hvb=function(a){_.On.call(this,a.La);var b=this;this.window=a.service.window.get();this.wa=this.Gm();this.oa=window.orientation;this.ka=function(){var c=b.Gm(),d=b.WTb()&&Math.abs(window.orientation)===90&&b.oa===-1*window.orientation;b.oa=window.orientation;if(c!==b.wa||d){b.wa=c;d=_.ab(b.Ke);for(var e=d.next();!e.done;e=d.next()){e=e.value;var f=new _.Gvb(c);try{e(f)}catch(g){_.ca(g)}}}};this.Ke=new Set;this.window.addEventListener("resize",this.ka);this.WTb()&&this.window.addEventListener("orientationchange",
this.ka)};_.E(Hvb,_.On);Hvb.nb=_.On.nb;Hvb.Ia=function(){return{service:{window:_.Pn}}};Hvb.prototype.addListener=function(a){this.Ke.add(a)};Hvb.prototype.removeListener=function(a){this.Ke.delete(a)};
Hvb.prototype.Gm=function(){if(Ivb()){var a=_.Cl(this.window);a=new _.il(a.width,Math.round(a.width*this.window.innerHeight/this.window.innerWidth))}else a=this.qc()||(_.la()?Ivb():this.window.visualViewport)?_.Cl(this.window):new _.il(this.window.innerWidth,this.window.innerHeight);return a.height<a.width};Hvb.prototype.destroy=function(){this.window.removeEventListener("resize",this.ka);this.window.removeEventListener("orientationchange",this.ka)};var Ivb=function(){return _.la()&&_.Se.EI()&&!navigator.userAgent.includes("GSA")};
Hvb.prototype.qc=function(){return _.Jvb};Hvb.prototype.WTb=function(){return"orientation"in window};_.Jvb=!1;_.Qn(_.zVa,Hvb);
_.Jvb=!0;
}catch(e){_._DumpException(e)}
try{
_.y("aLUfP");

_.z();
}catch(e){_._DumpException(e)}
})(this._s);
// Google Inc.
