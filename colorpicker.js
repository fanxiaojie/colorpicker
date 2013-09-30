(function($){
$.fn.getcolor=function(callback){
	var $this=$(this);$this.attr('readonly',true);var e=$('<div class="colorbox"></div>').appendTo(document.body);var pos=$this.offset();e.css({top:pos.top+25,left:pos.left-45}).hide();
	e.html('<div class="color"></div><div class="wheel"></div><div class="overlay"></div><div class="h-marker marker"></div><div class="sl-marker marker"></div>');
	var reg=/^#[0-9A-F]{6}$/i;if(reg.test($this.val())){$this.css('background',$this.val());}else{$this.val('#ffffff')}
	var fb={wheel:$('.wheel', e).get(0),radius:84,square:100,width:194,color:'',rgb:'',hsl:'',circleDrag:false};
	if (navigator.appVersion.match(/MSIE [0-6]\./)){$('*',e).each(function(){if(this.currentStyle.backgroundImage!='none'){var image = this.currentStyle.backgroundImage;image = this.currentStyle.backgroundImage.substring(5, image.length-2);$(this).css({'backgroundImage': 'none','filter': "progid:DXImageTransform.Microsoft.AlphaImageLoader(enabled=true, sizingMethod=crop, src='" + image + "')"});}});}
	$this.mousedown(function(){e.show();});e.mouseleave(function(){e.hide();});
	function setColor(color){var unpackcolor=unpack(color);if(fb.color!=color&&unpackcolor){fb.color=color;fb.rgb=unpackcolor;fb.hsl=RGBToHSL(fb.rgb);updateDisplay();}}
	function setHSL(hsl){fb.hsl=hsl;fb.rgb=HSLToRGB(hsl);fb.color=pack(fb.rgb);updateDisplay();return this;}
	function widgetCoords(event){var x, y;var el=event.target||event.srcElement;var reference=fb.wheel;if (typeof event.offsetX!='undefined'){var pos={x:event.offsetX, y:event.offsetY};var e=el;while(e){e.mouseX=pos.x;e.mouseY=pos.y;pos.x+=e.offsetLeft;pos.y+=e.offsetTop;e=e.offsetParent;}vare=reference;var offset={x:0,y:0};while(e){if(typeof e.mouseX!='undefined'){x=e.mouseX-offset.x;y=e.mouseY-offset.y;break;}offset.x+=e.offsetLeft;offset.y+=e.offsetTop;e=e.offsetParent;}e=el;while(e){e.mouseX=undefined;e.mouseY=undefined;e=e.offsetParent;}}else{var pos=absolutePosition(reference);x=(event.pageX||0*(event.clientX+$('html').get(0).scrollLeft))-pos.x;y=(event.pageY||0*(event.clientY+$('html').get(0).scrollTop))-pos.y;}return{x:x-fb.width/2,y:y-fb.width/2};}
	function mousedown(event){if(!document.dragging){$(document).bind('mousemove', mousemove).bind('mouseup',mouseup);document.dragging=true;}var pos=widgetCoords(event);fb.circleDrag = Math.max(Math.abs(pos.x),Math.abs(pos.y))*2>fb.square;mousemove(event);return false;}
	function mousemove(event){var pos=widgetCoords(event);if(fb.circleDrag){var hue=Math.atan2(pos.x,-pos.y)/6.28;
	if(hue<0)hue+=1;setHSL([hue,fb.hsl[1],fb.hsl[2]]);}else{var sat=Math.max(0,Math.min(1,-(pos.x/fb.square)+.5));
	var lum=Math.max(0,Math.min(1,-(pos.y/fb.square)+.5));setHSL([fb.hsl[0],sat,lum]);}return false;}
    function mouseup(){$(document).unbind('mousemove',fb.mousemove);$(document).unbind('mouseup',fb.mouseup);document.dragging=false;}
	function updateDisplay(){var angle=fb.hsl[0]*6.28;$('.h-marker',e).css({left:Math.round(Math.sin(angle)*fb.radius+fb.width/2)+'px',top:Math.round(-Math.cos(angle)*fb.radius+fb.width/ 2)+'px'});$('.sl-marker',e).css({left:Math.round(fb.square*(.5-fb.hsl[1])+fb.width/2)+'px',top:Math.round(fb.square*(.5-fb.hsl[2])+fb.width/2)+'px'});$('.color',e).css('backgroundColor',pack(HSLToRGB([fb.hsl[0],1,0.5])));$this.val(fb.color.toUpperCase()).css('background',fb.color);if(typeof callback=='function')callback();if(typeof callback=='object'||typeof callback=='string')$(callback).css('backgroundColor',fb.color);}	
    function absolutePosition(el){var r={x:el.offsetLeft,y:el.offsetTop};if(el.offsetParent){var tmp=absolutePosition(el.offsetParent);r.x+=tmp.x;r.y+=tmp.y;}return r;};
	function pack(rgb){var r=Math.round(rgb[0]*255);var g=Math.round(rgb[1]*255);var b=Math.round(rgb[2]*255);return '#'+(r<16?'0':'')+r.toString(16)+(g<16?'0':'')+g.toString(16)+(b<16?'0':'')+b.toString(16);}
    function unpack(color){if(color.length==7){return[parseInt('0x'+color.substring(1,3))/255,parseInt('0x'+color.substring(3,5))/255,parseInt('0x'+color.substring(5,7))/255];}else if(color.length==4){return [parseInt('0x'+color.substring(1,2))/15,parseInt('0x'+color.substring(2,3))/15,parseInt('0x'+color.substring(3,4))/15];}}
	function HSLToRGB(hsl){var m1,m2,r,g,b;var h=hsl[0],s=hsl[1],l=hsl[2];m2=(l<=0.5)?l*(s+1):l+s-l*s;m1=l*2-m2;return[hueToRGB(m1,m2,h+0.33333),hueToRGB(m1,m2,h),hueToRGB(m1,m2,h-0.33333)];}
    function hueToRGB(m1,m2,h){h=(h<0)?h+1:((h>1)?h-1:h);if(h*6<1)return m1+(m2-m1)*h*6;if(h*2<1)return m2;if(h*3<2)return m1+(m2-m1)*(0.66666-h)*6;return m1;}
    function RGBToHSL(rgb){var min,max,delta,h,s,l;var r=rgb[0],g=rgb[1],b=rgb[2];min=Math.min(r,Math.min(g,b));max=Math.max(r,Math.max(g,b));delta=max-min;l=(min+max)/2;s=0;
if(l>0&&l<1){s=delta/(l<0.5?(2*l):(2-2*l));}h=0;if(delta>0){if(max==r&&max!=g)h+=(g-b)/delta;if(max==g&&max!=b)h+=(2+(b-r)/delta);if(max==b&&max!=r)h+=(4+(r-g)/delta);h/=6;}return[h,s,l];}
  $('*',e).mousedown(mousedown);setColor($this.val());return this;}	
	})($);
