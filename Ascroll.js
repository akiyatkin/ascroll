window.Ascroll = function(conf){

	conf = $.extend(Ascroll.conf, conf);
	var div=$(conf.div);

	//Чтобы исключить ссылку из обработки скролла нужно добавить атрибут data-Ascroll=false
	var a=div.find('a:not(.Ascroll):not([data-Ascroll=false])');
	//Так как многие плагины используют "#" такую ссылку в технологических целях... такие ссылки игнорируются
	if (conf.global) {
		a.each(function(){
			var href=$(this).attr('href');
			if (!href) return;
			var mark=href.split('#',2);
			if (mark.length==2&&!mark[1]) return; //Только #
			$(this).addClass('Ascroll');
		});
	} else { //Только #anchor
		a.each(function(){
			var href=$(this).attr('href');
			if (!href) return;
			var mark=href.split('#',2);
			if (!mark[1]) return;
			$(this).addClass('Ascroll');
		});
	}
	a.each(function(){
		if (!$(this).hasClass('Ascroll')) return;

		$(this).attr('data-Ascroll',true);//.click(function (event) {
		this.addEventListener('click', function(event) {

			var a = this;
			var href = $(a).attr('href');

			if (window.Crumb&&!Crumb.isInternal(href)) return;

			var is = a.getAttribute('infra');
			if (is ==  'false') return;
			var is = a.getAttribute('data-crumb');

			if (is == 'false') return;


			var anchor=$(a).data('anchor'); //Якорь из атрибута
			
			if (!anchor) {
				anchor = href.split('#', 2); //Якорь из ссылки
				anchor = anchor[1];
				if (anchor) {
					href = href[0];
					var nanchor=Number(anchor);
					if(nanchor==anchor){
						anchor=nanchor;
					} else {
						anchor='#'+anchor;
					}
				} else {
					href = false;
				}
			} else {
				href = false;
			}
			Ascroll.go(anchor, conf); //Даже когда адрес уже открыт скролить мы всё равно должны
			if (!href && !event.defaultPrevented) { //Добавляется ли адрес в историю? Кто отменил стандартное действие тот и добавил в историю				
				event.preventDefault(); 
				window.history.pushState(null, null, href);
			}
		});
	});
}
window.Ascroll.once;
window.Ascroll.ignore;
window.Ascroll.conf={
	height: '.navbar-fixed-top',
	anchor: 0, //Якорь по умолчанию
	duration:"slow",
	easing:"swing",
	marginBottom: '.space',
	div:'body',
	global:false //false - применяется только к #anchor ссылкам на текущую страницу, true - применяется ко всем ссылкам, скролл будет наверх браузера или согласно параметров указанных в атрибутах.
}
/**
 * 
 *
 *
 **/
window.Ascroll.go = function (anchor, conf, cb, flash) {
	conf = $.extend({ }, Ascroll.conf, conf);
	if (typeof(window.Ascroll.ignore) != 'undefined') {
		delete window.Ascroll.ignore;
	}
	if (typeof(window.Ascroll.once) != 'undefined') {
		conf['anchor'] = window.Ascroll.once;
		delete window.Ascroll.once;
		if (conf['anchor'] === false) return;
	}
	if (!anchor) anchor=conf.anchor; //Якорь по умолчанию

	var options = {
		"duration":conf.duration,
		"easing":conf.easing,
		"complete":cb
	}
	
	if (typeof(anchor)=='string') {
		var el = $(anchor);
		if (el.length) {
			if (!el.is(':visible')) el=el.parents(':visible:first');
			var top = el.offset().top;
			options["step"] = function (now, fx) {
				if (!el.is(':visible')) el=el.parents(':visible:first');
				var top = el.offset();
				if (top) top = top.top;
				else top = 0;
				if (top > height) top = top - height;
				else top = 0;
				fx.end = top;
			}
		} else {
			var top = 0;
		}
	} else if (typeof(anchor)=='number') {
		var top=anchor;
	} else {
		var top = 0;
	}
	var height=0;

	if (typeof(conf.height) == 'string' && $(conf.height).length) {
		height = $(conf.height).height();
	} else if (typeof(conf.height) == 'number') {
		height = conf.height;
	}
	
	var marginBottom = 20;
	if (typeof(conf.marginBottom) == 'string' && $(conf.marginBottom).length) {
		marginBottom = parseInt($(conf.marginBottom).css('margin-bottom'));
	} if (typeof(conf.marginBottom) == 'number') {
		marginBottom = conf.marginBottom;
	}

	height = height + marginBottom;
	
	if (top > height) top = top - height;
	else top = 0;
	
	//if (document.documentElement && typeof(document.documentElement.scrollTop) != 'undefined' )  {
		var container = $('html, body');
	//} else {
	//	var container = $('body');
	//}
	
	var delta = top - container.scrollTop();
	if (conf.fastScrollUp && delta < -200) {
		container.scrollTop(top+200);
	}
	container.animate({
		scrollTop:top
	}, options);
	//container.scroll( function () {
		//container.stop();
	//});
}


window.ascroll = window.Ascroll;