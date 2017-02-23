$(document).ready(function() { //when document is fully loaded and ready

	var api_key = "a5e95177da353f58113fd60296e1d250";
	var user_id = "24662369@N07"; //nasa user account

	/***** Using three flicker api ********/
	var flickr_publicPhoto_api = "https://api.flickr.com/services/rest/?method=flickr.people.getPublicPhotos";
	var flickr_photoInfo_api = "https://api.flickr.com/services/rest/?method=flickr.photos.getInfo";
	var flickr_photoSearch_api = " https://api.flickr.com/services/rest/?method=flickr.photos.search";

	/***** Settings for public photo api ********/
	var publicPhoto_settings = {
	  "async": true,
	  "crossDomain": true,
	  "url": flickr_publicPhoto_api + "&api_key=" + api_key + "&user_id=" + user_id + "&format=json&nojsoncallback=1",
	  "method": "GET",
	  "headers": {}
	}
	//calling the function for retreiving the public photos of NASA
	invokeMethod(publicPhoto_settings);

	/***** Function Definition to render or process the api's ********/

	function invokeMethod(settings){

	$.ajax(settings).done(function (data) { //ajax call to retrieve data

	  $('.photoContainer').empty();
	  if (data.photos.total == 0) { //checking for object data is empty

	  	//When no data is available in the json object
	  	$("<div />",{class: "error-msg"}).text("Empty results returned. Try again.").appendTo('.photoContainer');
	  }

	  	//looping or iterating the photos retrieving from api
		$.each( data.photos.photo, function( i, elements ) {

			
			var farmId = elements.farm;
			var serverId = elements.server;
			var photoId = elements.id;
			var secretId = elements.secret;

			/***** Settings for individual photo info api ********/
			var photoInfo_settings = {
			  "async": true,
			  "crossDomain": true,
			  "url": flickr_photoInfo_api + "&api_key=" + api_key + "&photo_id=" + photoId + "&secret=" + secretId + "&format=json&nojsoncallback=1",
			  "method": "GET",
			  "headers": {}
			}

			$.ajax(photoInfo_settings).done(function (data) { //ajax call

	/***** Building the photo container for all public photos ********/
				var mainContainer = $('<div />', {
		              'class': 'col-xs-max-12 col-xs-6 col-sm-4 col-md-4 col-lg-3',
		              'data-title': data.photo.title._content,
		              'data-posted': data.photo.dates.posted,
		              'data-lastupdate': data.photo.dates.lastupdate   
		            });

				/***** pulling the small pictures ********/
				var urlDefault = 'https://farm' + farmId + '.staticflickr.com/' + serverId + '/' + photoId + '_' + secretId + '_n.jpg';

				$('<h4 />').text(data.photo.title._content).appendTo(mainContainer);
				$('<p />').html($('<img />', {
						          'src': urlDefault
						        })).appendTo(mainContainer);
				 $('<p />', {
			          'class': 'more-info',
			        }).html('Posted On: ' + new Date((data.photo.dates.posted)*1000).toDateString() + '<br/> Last Updated On: ' + new Date((data.photo.dates.lastupdate)*1000).toDateString()).appendTo(mainContainer);
			
				 // final resultset is appended to the main container
				$(mainContainer).appendTo('.photoContainer');
				

			});
	}); 
});
}

/***** Code for User input Filters ********/

    $('.search_form').submit(function(){ // for search form

        $('.photoContainer').empty(); 
        var getSearchValue = $('#keywords').val(); //input value

        /***** Settings for photo search api ********/
        var photoSearch_settings = {
		  "async": true,
		  "crossDomain": true,
		  "url": flickr_photoSearch_api + "&api_key=" + api_key + "&user_id=" + user_id + "&tags=" + getSearchValue + "&tag_mode=all&format=json&nojsoncallback=1",
		  "method": "GET",
		  "headers": {}
		}

	/**** Calling the function for search api - pulls the data based on the search keywords. Search keywords are included to search based on tag names. ****/

        invokeMethod(photoSearch_settings);
		return false;
    });


	/*** Sorting the data based on title, posted date, updated date ***/
	$('#dropdown').change(function() { //onchange event is triggered

		if(this.value == "photo-title" || "0"){
		    var dataCollection = $('.photoContainer').find('div').sort(function (a, b) {
		      return String.prototype.localeCompare.call($(a).data('title'), $(b).data('title'));
		    });
		  
		}
		if(this.value=="posted-date"){
			var dataCollection = $('.photoContainer').find('div').sort(function (a, b) {
			      return String.prototype.localeCompare.call($(a).data('posted'), $(b).data('posted'));
			    });
			   
		}

		if(this.value=="last-update"){

		  var dataCollection = $('.photoContainer').find('div').sort(function (a, b) {
		      return String.prototype.localeCompare.call($(a).data('lastupdate'), $(b).data('lastupdate'));
		    });
		    

		}
		//appending the final collection to display on html page
		$('.photoContainer').empty().append(dataCollection);

  });

	
});