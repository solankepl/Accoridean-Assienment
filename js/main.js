 	//'use strict';
	//var jsonPath = require('globals');
	//var scrollBar = require('jquery.carouFredSel');
	//require('jquery.easing.1.3');
	//require('yt-player');
	//require("libs/bootstrap");
	
	var normalDistance;
	var expandDistance=25;
	var shrinkDistance;
	var result;	
	var speed = 1000;
	var currentPostion = 0;
	var maxWidth;
	
	var onclickThumbImage = false;
	
	var firstImageNum=0;
	var showImages =10;
	
	var useragent = navigator.userAgent,
		isIphone = !!useragent.match(/iPhone/i),
		isIpad = !!useragent.match(/iPad/i),
		isWinDskp = !!useragent.match(/NT/i);
		androidPhone = !!useragent.match(/Android/i);
		ie8 = !!useragent.match(/MSIE 8.0/i);
	
	function create ()	{		
		fnLoadCategoryPlaylists();	
	}	
	
	function fnLoadCategoryPlaylists () {
		//$('#addimages').empty();	
		adjustCSS(); 
		$(window).resize(function() {
          	adjustCSS(); 
     	}); 			
		$.getJSON("data/test.json", function (data) {
			result = data;
			fnCreateTileSlider();
		});			
	}		
	
	function fnCreateTileSlider (position) {
		firstImageNum = 0;
		//$(".left-accordian").css("background-image","url(imgs/Experience/big_"+result.Experiances.Experiance[0]+".jpg)");
		//alert(result.Experiances.Experiance[0]);
		var dummyWidth =0;		
		
		$.each(result.MainNode.Node, function (i, item) {
			var thumbnail = item.ImageURL;			
			
			$('#addimages').append("<li id='thumbimage_"+i+"' class='thumbimage' style='left:"+ dummyWidth+"px;'> <img  src='img/"+thumbnail+".png'></li>");		
			
			dummyWidth += normalDistance;
			maxWidth = dummyWidth;
		})
		
		$("#next").bind("click", setCrousalDirection);
		$("#back").bind("click", setCrousalDirection);
		$('#back').addClass('arrowimagedeactive');
		
		$(".thumbimage").bind("mouseover", exapandOver);
		$(".thumbimage").bind("mouseout", exapandOut);
		$(".thumbimage").bind("click",thumbimageClick);	
		
		
		//$(".thumbimage").bind("touchmove",thumbimageClick);	
    	//$(".video-title").text(result.Experiances.Experiance[0].Title);
		
			
		//scrollify('#scrollbar1');
		//$("#scrollbar1").tinyscrollbar_update();		
		
	}
	// addd mobile event for toch swipe 
	
	function setupSwipe(){
		
		$("#addimages").swipe( {
			//Generic swipe handler for all directions
			
			swipe:function(event, direction, distance, duration, fingerCount) {
				
				if(direction=="left"){
					showData("next");
				} else 
				if ( direction == 'right' ) {
              		showData("back");
					
            	}		  
			},
			//Default is 75px, set to 0 for demo so any distance triggers swipe
			 threshold:50,
       		 //fingers:'all'
      });
	}
	
	function setCrousalDirection()
	{
		var setdirection = $(this).attr("id");
		showData(setdirection);
	}
	
	
	function showData(direction)	{
		
		onclickThumbImage = false;
		exapandOut();
		
		var cureentClick = direction //$(this).attr("id");
				
		currentPostion =parseInt($("#addimages").css('margin-left').replace('px', ''));		
				
		$('#back').unbind("click", setCrousalDirection);
		$('#next').unbind("click", setCrousalDirection);		
		
		if(cureentClick==="back")
		{
			if(currentPostion<0)
			{
				$('#next').addClass('arrowimage');
				$('#next').removeClass('arrowimagedeactive');
				currentPostion = currentPostion + parseInt($("#playlist").css("width"));
			}else 
			{
				currentPostion =0;
				$('#back').addClass('arrowimagedeactive');
				$('#back').removeClass('arrowimage');
			}
		}else{			
			if (currentPostion*-1> maxWidth-parseInt($("#playlist").css("width"))) 
			{
				$('#next').removeClass('arrowimage');
				$('#next').addClass('arrowimagedeactive');	
				
			}else{
				$('#back').removeClass('arrowimagedeactive');
				$('#back').addClass('arrowimage');				
				currentPostion = currentPostion + parseInt($("#playlist").css("width"))*-1;
			}	
							
		}	
				
		if (currentPostion*-1> maxWidth-parseInt($("#playlist").css("width"))) 
			{
				$('#next').removeClass('arrowimage');
				$('#next').addClass('arrowimagedeactive');	
				var temp = parseInt($("#addimages li").last().css("left"))-parseInt($("#playlist").css("width"))+(normalDistance);
				currentPostion = temp*-1; 					
			}
			
			if(currentPostion>=0){
				currentPostion=0;
				$('#back').addClass('arrowimagedeactive');
				$('#back').removeClass('arrowimage');					
			}	
		
		$('#addimages').animate({
				"margin-left":currentPostion
			},speed,function(){
				$('#back').bind("click", setCrousalDirection);
				$('#next').bind("click", setCrousalDirection);					
		});	
		
		firstImageNum =  Math.floor(currentPostion/normalDistance)*-1;
		
	}
		
	function exapandOver(e)	{		
		var currentImage =  e.currentTarget;
		var dummyWidth =0;
		var currentImageNum = parseInt($(currentImage).attr("id").split("_")[1]);
		
		$(".thumbimage").each(function (index, item) {
			if (index>firstImageNum) {
				var myIndex = parseInt($(item).attr("id").split("_")[1]);
				dummyWidth = myIndex * normalDistance;//parseInt($(item).css("left").replace('px', ''));			
			
				onclickThumbImage =false;
				if(currentImageNum < parseInt($(item).attr("id").split("_")[1]))
					{
						dummyWidth += expandDistance+2;						
					}
					else
					{
						dummyWidth -= expandDistance-2
					}
				
				if(index==(firstImageNum+1))
					{
						dummyWidth += expandDistance-15;						
					}		
					//easeOutQuad							
				$(item).stop().animate({left: dummyWidth+'px'},{queue:false, duration:400, easing: 'swing'});		
			}				
		});			
	}		
	
	function exapandOut() {		
		var dummyWidth =0;
		console.log(onclickThumbImage);
		if(!onclickThumbImage)
			{	
				$(".thumbimage").each(function (index, item) {
					$(item).stop().animate({left: dummyWidth+"px"},{queue:false, duration:400, easing: 'swing'})					
					dummyWidth +=normalDistance;						
				})		
			}
	}	
	
	function thumbimageClick (e) {	
	 	var currentNum = parseInt($(e.currentTarget).attr("id").split("_")[1]);		
		//var videoTitle = result.Experiances.Experiance[currentNum].Title;				
		onclickThumbImage =true;			
	}	
	
	// addd div on srcoll bar 
	
	function scrollify(element,options) {   //  '#element', {list:of,key:values}
			$(element).children().wrapAll('<div class="viewport"><div class="overview"></div></div>');
			$(element).prepend('<div class="scrollbar"><div class="track"><div class="thumb"><div class="end"></div></div></div></div>');
			$(element).tinyscrollbar(options);
   	}
	
	function adjustCSS(){
				
			if(ie8){
				//$('.left-accordian').css('height','432px');
				//$('#experiencePlayer').css('background','transparent');		
				//$('.flex-video').find('iframe').css({'padding':'0px','margin':'10%'});	
			}	
		
		
			if(androidPhone || isIphone || isIpad){
				$(".thumbimage").unbind("mouseover",exapandOver);
				$(".thumbimage").unbind("mouseout",exapandOut);
				
				$('#playlist').css({'overflow-x':'scroll','overflow-y': 'hidden','width':'96%'});
				$('.arrowimage').css('display','none');	
				
				//setupSwipe();
			}
			
				
			pageWidth = $(window).width();
	
			if (pageWidth < 340){
				showImages =3;							
			}else
			if (pageWidth > 340 && pageWidth < 380){
				showImages =4;						
			}else
			if (pageWidth > 380 && pageWidth < 550){
				showImages =5;										
			}else
			 if (pageWidth > 550 && pageWidth < 750){
				showImages =8;	
					
			}else	
			 if (pageWidth > 750 && pageWidth < 850){
				showImages =10;				
			}else{	
				showImages =10;				
			 }	
		 
			
			onclickThumbImage =false;
			exapandOut();
			normalDistance = parseInt($("#playlist").css("width"))/showImages;
			firstImageNum =  Math.floor(currentPostion/normalDistance)*-1;
				
			 try{		
				//$("#scrollbar1").tinyscrollbar_update();
			 }catch(e){
				 
			 }			
		
	}	

//http://jsfiddle.net/RXq4C/1/ for refrance