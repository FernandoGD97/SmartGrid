'use strict';

/* VARS */


/* DOCUMENT READY */

$(document).ready(function() {
  //Before component
  if ($('.before').length > 0 && $('.before').hasClass('is-active')) {
    $('.main').addClass('is-out');
  } else {
    $('.main').removeClass('is-out');
  }

  $( document ).on('click', '.before__btn', function() {
    removeBefore();
  });

  // Hide cookies
  $( document ).on('click', '.cookies__btn-close', function() { 
    $('.cookies').slideUp();
    setCookies();
  });

  $(window).scroll(function() {
    if ($(window).scrollTop() >= 50 && $('.before').length > 0 && $('.before').hasClass('is-active')) {
      removeBefore();
    }
  });
  
  if (!sessionStorage.getItem('show_cover')) {
	  if ($('div.before').length) {
		  $('div.before').addClass('is-active');
		  $('main').addClass('is-out');
	  }
  }	  
  
  // search
  $(document).on('click', '.nav__search__content .icon--search', function() {
	var url = 'index.php?route=extension/d_blog_module/search';

	var value = $(this).siblings().first().val();

 	if (value) {
	  url += '&text_search=' + encodeURIComponent(value);
	}

	location = url;
  });
  
  $(document).on('click', '.search .icon--search', function() {
	var url = 'index.php?route=extension/d_blog_module/search';

	var value = $(this).siblings().first().val();

 	if (value) {
	  url += '&text_search=' + encodeURIComponent(value);
	}

	location = url;
  });
  
  $(document).on('keypress', '.nav__search__content input[name=\'text_search\']', function(e) {
	if(e.which == 13) {
		var url = 'index.php?route=extension/d_blog_module/search';

		var value = $(this).val();

		if (value) {
		  url += '&text_search=' + encodeURIComponent(value);
		}

		location = url;
	}	
  });
  
  $(document).on('keypress', '.search input[name=\'text_search\']', function(e) {
	if(e.which == 13) {
		var url = 'index.php?route=extension/d_blog_module/search';

		var value = $(this).val();

		if (value) {
		  url += '&text_search=' + encodeURIComponent(value);
		}

		location = url;
	}	
  });
  
  $('.article__section__content.editor img').each(function() {
	  if (!$(this).hasClass('no-figure')) {
	  
		  var html = '';
		  var img = '';
		  var figcaption = '';
		  var element = $(this);
		  
		  img = '<img src="' + element[0].src + '" title="'+ element[0].title +'" alt="' + element[0].alt +'" />'; 
		  figcaption = '<figcaption>' + element[0].title + '</figcaption>';
		  
		  html = '<figure>';
		  html +=	img;
		  html += 	figcaption;
		  html += '</figure>';
		  
		  var padre = $(this).parent();
		  padre.replaceWith(html);
	  } 
  });
  
  wrapImgGroup();
});

/* FUNCTIONS */

function removeBefore() {	
  sessionStorage['show_cover'] = '1';
  
  $('.before').addClass('is-out');
  $('.main').addClass('is-active');
  $('.main').removeClass('is-out');
  
  setTimeout(function() {
    $('html,body').animate({ scrollTop: 0 }, 0);
  }, 700);
  
  setTimeout(function() {
    $('.before').removeClass('is-active');
  }, 1500);
}

function copyToClipboard() {
	var copy = document.getElementById("canonical");
	
	copy.select();
	
	document.execCommand('copy');
	
	//alert("Copied the text: " + copy.value);
}

function wrapImgGroup() {
  $('.editor figure + figure').each(function() {
    $(this).prev().addClass('grid-img');
  });
}

// Set cookie
function setCookies() {
  var name = "acceptZonaEcoCookies=si;";
  var date = new Date();

  // 30 dias
  date.setTime(date.getTime()+(30*24*60*60*1000));
  var expires = "expires="+date.toGMTString()+";";
  document.cookie = name+expires+"path=/";
}

function evento(categoria,ubicacion,titulo,posicion) {
  //console.log(categoria+" - "+ubicacion+" - "+titulo+" - "+posicion);
  gtag('event', 'evento', { 'event_category': categoria, 'event_action': ubicacion, 'event_label': titulo, 'value': posicion});
}
