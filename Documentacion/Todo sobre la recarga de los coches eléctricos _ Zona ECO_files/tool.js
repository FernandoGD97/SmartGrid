'use strict';

/* VARS */
var $toolStep = $('.tool__step.is-in');
var toolStepH = $toolStep.outerHeight();
var toolStepI = $toolStep.index();

var totalToolSteps = $('.tool__step').length;

var progressToolBar = 0;
var progressToolIncrement = 100 / (totalToolSteps - 1);

var battery_capacity = 0;	
var inner_charger = 0;
var combined_consum = 0;	
var city_consum = 0;	
var mixed_autonomy = 0;	
var city_autonomy = 0;	
var superslow_charge = 0;	
var slow_charge = 0;	
var semifast_charge_mono = 0;
var semifast_charge_tri = 0;	
var fast_charge_50 = 0;	
var fast_charge_100 = 0;	
var fast_charge_percentage = 0;	
var alt_charger = '';

/* DOCUMENT READY */

$(document).ready(function() {
	
	var years_def = $('#years-default').val();
	var years_min = $('#years-min').val();
	var years_max = $('#years-max').val();
	var price_kw_min = $('#price-kw-min').val();
	var price_kw_max = $('#price-kw-max').val();
	var kms_def = $('#kms-default').val();
	var kms_min = $('#kms-min').val();
	var kms_max = $('#kms-max').val();
	var price_comb_min = $('#price-comb-min').val();
	var price_comb_max = $('#price-comb-max').val();
	var cons_min = $('#cons-min').val();
	var cons_max = $('#cons-max').val();
	
	// Range sliders
	$('#rangeYears').ionRangeSlider({
		min: years_min,
		max: years_max,
		from: years_def,
		postfix: ' años'
	});

	$('#rangeKms').ionRangeSlider({
		min: kms_min,
		max: kms_max,
		from: kms_def,
		postfix: ' KMs'
	});
	
	var initial_def = $('#initial-default').val();
	var initial_min = $('#initial-from').val();
	var initial_max = $('#initial-to').val();
	var desired_def = $('#desired-default').val();
	var desired_min = $('#desired-from').val();
	var desired_max = $('#desired-to').val();
  
	$('#rangeInitial').ionRangeSlider({
		min: initial_min,
		max: initial_max,
		from: initial_def,
		postfix: '%',
		onFinish: function (data) {
			var modell = $('#selectChargerModel').val();
			
			if (modell != '') {
				calculateCharge();
			}	
        }
	});

	$('#rangeDesired').ionRangeSlider({
		min: desired_min,
		max: desired_max,
		from: desired_def,
		postfix: '%',
		onFinish: function (data) {
			var modell = $('#selectChargerModel').val();
			
			if (modell != '') {
				calculateCharge();
			}	
        }
	});

	// Bullets for Progress
	$('.tool__step').each(function(){
		$('.tool__box__progress').append('<div class="tool__box__progress__bullet"></div>');
	});

	$('.tool__box__progress__bullet:first-of-type').addClass('is-active');

	/* Calc Heights */
	$('.tool__box__cell--steps').css('height', toolStepH + 'px');

	// Resize
	$( window ).bind('resize', function() {
		toolStepH = getToolStepH();

		$('.tool__box__cell--steps').css('height', toolStepH + 'px');
	});

	// Buttons
	$( document ).on('click', '.tool [data-action="next"]', function() {
		nextStep(1);
	});
	$( document ).on('click', '.tool [data-action="reset"]', resetTool);
	$( document ).on('click', '.tool [data-action="calculateSave"]', calculateSave);


	$( document ).on('click', '.tool__form__options__btn', function(){
		var $options = $(this).parent('.tool__form__options');
		$options.find('.tool__form__options__btn').removeClass('is-active');
		$(this).addClass('is-active');
		
		var motor = $(this).attr('data-motor');
		$('#motor-type').val(motor);
		
		
		$.ajax({
			url: 'index.php?route=extension/module/save_calculator/getMotorType',
			type: 'post',
			data: {motor_type : motor},
			dataType: 'json',
			success: function(json) {
				if (json.status == 'OK') {
					var motor_info = json.motor;
					
					cons_min = motor_info.min_consum;
					cons_max = motor_info.max_consum;
					$('#formCons').val(motor_info.average_consum);
					$('#formComb').val(motor_info.average_comb_price);
				} else {
					cons_min = $('#cons-min').val();
					cons_max = $('#cons-max').val();
					var cons_def = $('#cons-def').val();
					$('#formCons').val(cons_def);
					var price_comb_def = $('#price-comb-def').val();
					$('#formComb').val(price_comb_def);
				}
			}
		});	
	});

	// Change Model Select
	$('.tool__form__select').change(function() {
		var model = $(this).val();
		
		if ($(this).attr('id') == 'selectChargerModel') {
			$(this).parent().attr('data-model', model);
			selectChargeModel(model);
		} 
		
		if ($(this).attr('id') == 'selectModel') {
			selectToolModel(model);
		}
	});
  
	$( document ).on('click', '#price-kw-less', function() {
		var price = $('#formAmount').val();
		var new_price =  (price * 100 - 0.01 * 100) / 100;
	  
		if (new_price >= price_kw_min) {
			$('#formAmount').val(new_price.toFixed(2));
		}  
	});
  
	$( document ).on('click', '#price-kw-more', function() {
		var price = $('#formAmount').val();
		var new_price =  (price * 100 + 0.01 * 100) / 100;
	  
		if (new_price <= price_kw_max) {
			$('#formAmount').val(new_price.toFixed(2));
		}  
	});
  
	$( document ).on('click', '#price-comb-less', function() {
		var price = $('#formComb').val();
		var new_price =  (price * 10 - 0.1 * 10) / 10;
	  
		if (new_price >= price_comb_min) {
			$('#formComb').val(new_price.toFixed(1));
		}
	});
  
	$( document ).on('click', '#price-comb-more', function() {
		var price = $('#formComb').val();
		var new_price =  (price * 10 + 0.1 * 10) / 10;
	  
		if (new_price <= price_comb_max) {
			$('#formComb').val(new_price.toFixed(1));
		}
	});
  
	$( document ).on('click', '#cons-less', function() {
		var price = $('#formCons').val();
		var new_price =  (price * 10 - 0.1 * 10) / 10;
	  
		if (new_price >= cons_min) {
			$('#formCons').val(new_price.toFixed(1));
		}  
	});
  
	$( document ).on('click', '#cons-more', function() {
		var price = $('#formCons').val();
		var new_price =  (price * 10 + 0.1 * 10) / 10;
	  
		if (new_price <= cons_max) {
			$('#formCons').val(new_price.toFixed(1));
		}	  
	});
});

/* FUNCTIONS */

function getToolStepH() {
	var height = $toolStep.outerHeight();
	return height;
}

function progressTool() {
	progressToolBar = toolStepI * progressToolIncrement;

	$('.tool__box__progress__bullet').eq(toolStepI).addClass('is-active');
	$('.tool__box__progress__line').css('width', progressToolBar + '%');
}

function nextStep(step) {
	// reset
	$('.alert--error').addClass('is-hidden');
	$('#selectModel').removeClass('is-required')
	
	// check-in
	var error = false;
	
	var model = $('#selectModel').val();
	var price = $('#formAmount').val();
	var years = $('#rangeYears').val();
	
	if (model == '') {
		error = true;
		$('#selectModel').addClass('is-required');
	}
	
	if (!error) {
		$toolStep.addClass('is-out').removeClass('is-in');

		toolStepI++;
		$toolStep = $('.tool__step').eq(toolStepI);
		toolStepH = getToolStepH();

		$toolStep.addClass('is-in');
		$('.tool__box__cell--steps').css('height', toolStepH + 'px');

		progressTool();
		setTimeout(function(){
			jQuery(window).trigger('resize').trigger('scroll');
		  }, 470);
		
		if (step == 1) {
			// GA event 
			evento('ZonaEco','Calculadora de ahorro', 'EN PROCESO',2);
		}
	} else {
		$('.alert--error.error-step1').removeClass('is-hidden');
		
		toolStepH = getToolStepH();
		$('.tool__box__cell--steps').css('height', toolStepH + 'px');
		
		//$('[data-parallax="scroll"]').parallax();
	}	
}

function resetTool() {
	// Reset Progress
	$('.tool__box__progress__bullet').removeClass('is-active');
	$('.tool__box__progress__bullet:first-of-type').addClass('is-active');
	$('.tool__box__progress__line').css('width', '0');

	// Reset step
	$('.tool__step').removeClass('is-in').removeClass('is-out');
	$('.tool__step:first-child').addClass('is-in');

	// Step Height
	$toolStep = $('.tool__step:first-child');
	toolStepI = $toolStep.index();
	toolStepH = getToolStepH();
	$('.tool__box__cell--steps').css('height', toolStepH + 'px');

	// Reset result
	$('.tool__box__cell__cover').removeClass('is-out');

	setTimeout(function(){
		$('#anualSave').html('');
		$('#accumulatedSave').html('');
		$('#modelSave').attr('src', '');
		$('#linkSave').attr('href', '');
	}, 100);
}

function selectToolModel(model) {
	$('.tool__form__select__container').attr('data-model', model);

	  /*if (model === 'ioniqPhev') {
		$('#priceKw').show();
	  } else {
		$('#priceKw').hide();
	  }*/
  
	$('#priceKw').show();

	toolStepH = getToolStepH();

	$('.tool__box__cell--steps').css('height', toolStepH + 'px');
	
	// GA event 
	evento('ZonaEco','Calculadora de ahorro', 'COMENZADA',1);
}

function selectChargeModel(model) {
	$.ajax({
		url: 'index.php?route=extension/module/charge_simulator/getModel',
		type: 'post',
		data: {code : model},
		dataType: 'json',
		success: function(json) {
			if (json.status == 'OK') {
				var model = json.model;
				
				battery_capacity = model.battery_capacity;	
				inner_charger = model.inner_charger;
				combined_consum = model.combined_consum;	
				city_consum = model.city_consum;	
				mixed_autonomy = model.mixed_autonomy;	
				city_autonomy = model.city_autonomy;	
				superslow_charge = model.superslow_charge;	
				slow_charge = model.slow_charge;	
				semifast_charge_mono = model.semifast_charge_mono;
				semifast_charge_tri = model.semifast_charge_tri;	
				fast_charge_50 = model.fast_charge_50;	
				fast_charge_100 = model.fast_charge_100;	
				fast_charge_percentage = model.fast_charge_percentage;
				alt_charger = model.inner_charger_alt;	
				
				calculateCharge();
			} 
		}
	});
	
	// GA event 
	evento('ZonaEco','Simulador de recarga','COMENZADA-FINALIZADA',1);
}

function calculateSave() {
	// reset
	$('.alert--error').addClass('is-hidden');
	
	// check-in
	var error = false;
	
	var motor = $('#motor-type').val();
	
	if (motor == '') {
		error = true;

	}
  
	if (!error) {
		// summary 
		var model = $('#selectModel option:selected').text();
		var model_code = $('#selectModel').val();
		var price_kw = $('#formAmount').val();
		var years = $('#rangeYears').val();
		var motor_type = '';
		switch (motor) {
			case '1':
				motor_type = 'Gasolina';
				break;
			case '2':
				motor_type = 'Diésel';
				break;
			case '3':
				motor_type = 'Híbrido';
				break;		
		}
		var kms = $('#rangeKms').val();
		var consum = $('#formCons').val();
		var price_comb = $('#formComb').val();

		$('ul.summary_want li:nth-child(1) span').html(model);
		$('span.tool__result__title__model').html(model);
		$('ul.summary_want li:nth-child(2) span').html(numberFormat(price_kw)+'€');		
		$('ul.summary_want li:nth-child(3) span').html(years+' años');	
		$('ul.summary_have li:nth-child(1) span').html(motor_type);	
		$('ul.summary_have li:nth-child(2) span').html(numberFormat(kms)+' KMs');
		$('ul.summary_have li:nth-child(3) span').html(numberFormat(consum));	
		$('ul.summary_have li:nth-child(4) span').html(numberFormat(price_comb));			
		
		// calc saving
		var have = (consum * price_comb * kms) / 100;
		var annual = '761';
		var accumulated = '3.400';
		var modelLink = "#";
		
		$.ajax({
			url: 'index.php?route=extension/module/save_calculator/getModel',
			type: 'post',
			data: {code : model_code},
			dataType: 'json',
			success: function(json) {
				if (json.status == 'OK') {
					var want = 0;
					var model = json.model;
					
					if (model.type == 1) { // ev
						want = (model.consum * price_kw * kms) / 100;		
						
					}
					
					if (model.type == 2) { // phev
						var want_ev = (60 * (model.consum * price_kw * kms) / 100) / 100;	
						var want_comb = (40 * (4.2 * 1.4 * kms) / 100) / 100;	
						want = parseFloat(want_ev) + parseFloat(want_comb);
					}
					
					annual = have - want;
					accumulated = Math.round(annual) * years;
					modelLink = model.link;
					
					$('#anualSave').html(numberFormat(Math.round(annual)) + '<small>€</small>');
					$('#accumulatedSave').html(numberFormat(Math.round(accumulated)) + '<small>€</small>');
					$('#accumulatedYears').html('de ahorro acumulado en ' + years + ' años');
					$('#modelSave').attr('src', model.image);
					$('#linkSave').attr('href', modelLink);
					if (model.type == 2) { // phev
						$('#noteSave').removeClass('is-hidden');
						$('#asteriskSave').removeClass('is-hidden');
					} else {
						$('#noteSave').addClass('is-hidden');
						$('#asteriskSave').addClass('is-hidden');
					}	
				} else {
					
				}
			}
		});

		nextStep(2);

		$('.tool__box__cell__cover').addClass('is-out');

		if (!mqDesktop.matches) {
			setTimeout(function(){ scrollToElement($('.tool__result__anchor'), 0); }, 500);
		}
		
		// GA event 
		evento('ZonaEco','Calculadora de ahorro', 'FINALIZADA',3);
	} else {
		$('.alert--error.error-step2').removeClass('is-hidden');
		
		toolStepH = getToolStepH();
		$('.tool__box__cell--steps').css('height', toolStepH + 'px');
	}	
}

function calculateCharge() {
	var modell = $('#selectChargerModel').val();
	var initial = $('#rangeInitial').val();
	var desired = $('#rangeDesired').val();

	// autonomia recuperada
	var battery_status = (desired - initial) * battery_capacity;
	var combined_corrector = mixed_autonomy / (combined_consum * battery_capacity);
	var city_corrector = city_autonomy / (city_consum * battery_capacity);
	
	var recovery_mixed_autonomy = ((combined_consum * battery_status) * combined_corrector) / 100;
	recovery_mixed_autonomy = Math.round(recovery_mixed_autonomy);
	var recovery_city_autonomy = ((city_consum * battery_status) * city_corrector) / 100;
	recovery_city_autonomy = Math.round(recovery_city_autonomy);
	
	$('#anualautonomy').html(recovery_mixed_autonomy+'<small>km</small>');
	$('#accumulatedautonomy').html(recovery_city_autonomy+'<small>km</small>');
	
	// tiempo de recarga
	// enchufe domestico
	var time_slow = ((battery_status / 2.8) * slow_charge) / 100;
	time_slow = Math.round(time_slow);
	
	// monofasico
	if (alt_charger != '') {
		var time_mono = ((battery_status / alt_charger) * semifast_charge_mono) / 100; 
	} else {
		var time_mono = ((battery_status / inner_charger) * semifast_charge_mono) / 100; 
	}
	//time_mono = Math.round((time_mono + Number.EPSILON) * 100) / 100;
	var n = new Date(0,0);
	n.setMinutes(+time_mono * 60);
	var time_mono_hour = n.toTimeString().slice(0, 2);
	var time_mono_minute = n.toTimeString().slice(3, 5);
	
	// trifasico
	var time_tri = ((battery_status / inner_charger) * semifast_charge_tri) / 100; 
	n = new Date(0,0);
	n.setMinutes(+time_tri * 60);
	var time_tri_hour = n.toTimeString().slice(0, 2);
	var time_tri_minute = n.toTimeString().slice(3, 5);
	
	// carga rapida
	if (modell != 'ioniqPhev') {
		if (desired > 80) {
			battery_status = ((80 - initial) * battery_capacity) / 100;
			
			//var charge_percentage = fast_charge_percentage / 100;
		} else {
			battery_status = ((desired - initial) * battery_capacity) / 100;
			
			//var charge_percentage = desired / 100;
		}	
		
		// 20kw
		var time_20 = ((battery_status) / 20 * fast_charge_50); 
		//var time_20 = (((battery_status/100 * charge_percentage) / 20) * fast_charge_50);
		n = new Date(0,0);
		n.setMinutes(+time_20 * 60);
		var time_20_hour = n.toTimeString().slice(0, 2);
		var time_20_minute = n.toTimeString().slice(3, 5);
		
		// 50kw
		var time_50 = ((battery_status) / 50 * fast_charge_50); 
		//var time_50 = (((battery_status/100 * charge_percentage) / 50) * fast_charge_50); 
		//var time_50 = ((battery_status/100 * (charge_percentage) / 50 * fast_charge_50) / 24); 
		n = new Date(0,0);
		n.setMinutes(+time_50 * 60);
		var time_50_hour = n.toTimeString().slice(0, 2);
		var time_50_minute = n.toTimeString().slice(3, 5);
		
		// 100kw
		var time_100 = ((battery_status) / 100 * fast_charge_100); 
		//var time_100 = (((battery_status/100 * charge_percentage) / 100) * fast_charge_100);
		n = new Date(0,0);
		n.setMinutes(+time_100 * 60);
		var time_100_hour = n.toTimeString().slice(0, 2);
		var time_100_minute = n.toTimeString().slice(3, 5);
	}
	
	$('.tool__load__charger__result li p').each(function(i) {
		if ($(this).attr('data-charger') == 1) { // carga lenta
			$(this).html(time_slow+'<small>h</small>')
		}
		
		if ($(this).attr('data-charger') == 2) { // carga semi rapida mono
			if (time_mono_hour == '00') {
				$(this).html(time_mono_minute+'<small>min</small>');
			} else {
				$(this).html(time_mono_hour+'<small>h</small> '+time_mono_minute+'<small>min</small>');
			}	
		}
		
		if ($(this).attr('data-charger') == 3) { // carga semi rapida tri
			if (time_tri_hour == '00') {
				$(this).html(time_tri_minute+'<small>min</small>');
			} else {	
				$(this).html(time_tri_hour+'<small>h</small> '+time_tri_minute+'<small>min</small>');
			}	
		}
		
		if (modell != 'ioniqPhev') {
			if ($(this).attr('data-charger') == 4) { // carga rapida 20kw
				if (time_20_hour == '00') {
					$(this).html(time_20_minute+'<small>min</small>');
				} else {	
					$(this).html(time_20_hour+'<small>h</small> '+time_20_minute+'<small>min</small>');
				}	
			}
			
			if ($(this).attr('data-charger') == 5) { // carga rapida 50kw
				if (time_50_hour == '00') {
					$(this).html(time_50_minute+'<small>min</small>');
				} else {	
					$(this).html(time_50_hour+'<small>h</small> '+time_50_minute+'<small>min</small>');
				}	
			}
			
			if ($(this).attr('data-charger') == 6) { // carga rapida 50kw
				if (time_100_hour == '00') {
					$(this).html(time_100_minute+'<small>min</small>');
				} else {	
					$(this).html(time_100_hour+'<small>h</small> '+time_100_minute+'<small>min</small>');
				}	
			}
		} else {
			if ($(this).attr('data-charger') == 4) { // carga rapida 20kw
				$(this).html('-<small>min</small>');
			}
			
			if ($(this).attr('data-charger') == 5) { // carga rapida 50kw
				$(this).html('-<small>min</small>');
			}
			
			if ($(this).attr('data-charger') == 6) { // carga rapida 50kw
				$(this).html('-<small>min</small>');
			}
		}	
	});
}

// function for add points to a number
function numberFormat(numero){
	// Variable que contendra el resultado final
	var resultado = "";
 
    // Si el numero empieza por el valor "-" (numero negativo)
    /*if (numero[0]=="-") {
		// Cogemos el numero eliminando los posibles puntos que tenga, y sin
		// el signo negativo
		var nuevoNumero=numero.toString().replace(/\./g,'').substring(1);
	} else{
		// Cogemos el numero eliminando los posibles puntos que tenga
		var nuevoNumero=numero.toString().replace(/\./g,'');
	}*/
	var nuevoNumero = numero.toString();
 
    // Si tiene decimales, se los quitamos al numero
	if (numero.toString().indexOf(".")>=0)
		nuevoNumero=nuevoNumero.substring(0,nuevoNumero.indexOf("."));
 
	// Ponemos un punto cada 3 caracteres
	for (var j, i = nuevoNumero.length - 1, j = 0; i >= 0; i--, j++)
		resultado = nuevoNumero.charAt(i) + ((j > 0) && (j % 3 == 0)? ".": "") + resultado;
 
	// Si tiene decimales, se lo añadimos al numero una vez formateado con 
	// los separadores de miles
	if(numero.toString().indexOf(".")>=0)
		resultado+=','+numero.toString().substring(numero.indexOf(".")+1);
 
	if (numero[0]=="-") {
		// Devolvemos el valor añadiendo al inicio el signo negativo
		return "-"+resultado;
	}else{
		return resultado;
	}
}
