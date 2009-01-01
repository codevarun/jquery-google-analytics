/*
* jquery-google-analytics plugin
*
* A jQuery plugin that simplifies event and link tracking.
*
* Features:
*
* - Easy and extensible event and link tracking plugin for jQuery and Google Analytics
* - Automatic internal/external link detection. Default behavior is to skip tracking of internal links.
* - Configurable: skip internal link tracking, metadata extraction using callbacks.
* - Enforces that tracking event handler is added only once.
*
* Copyright (c) 2008 Christian Hellsten
*
* Plugin homepage:
* http://aktagon.com/projects/jquery/google-analytics/
* http://github.com/christianhellsten/jquery-google-analytics/
*
* Examples:
* http://aktagon.com/projects/jquery/google-analytics/examples/
* http://code.google.com/apis/analytics/docs/eventTrackerGuide.html
*
* Repository:
* git://github.com/christianhellsten/jquery-google-analytics.git
*
* Version 1.0.0
*
* Tested with:
* - Mac: Firefox 3
* - Linux: Firefox 3
* - Windows: Firefox 3, Internet Explorer 6
*
* Licensed under the MIT license:
* http://www.opensource.org/licenses/mit-license.php
*
*/

(function($) {
	
  /**
   * Tracks an event using the given parameters. 
   *
   * The trackEvent method takes four arguments:
   *
   *  category – required string used to group events
   *  action – required string used to define event type, eg. click, download
   *  label – optional label to attach to event, eg. buy
   *  value – optional numerical value to attach to event, eg. price
   *  skip_internal - optional boolean value. If true then internal links are not tracked.
   *
   */
  $.trackEvent = function(category, action, label, value) {
    if(typeof pageTracker == 'undefined') {
      // alert('You need to install the Google Analytics script'); blocked by whatever
    } else {
      pageTracker._trackEvent(category, action, label, value);
    }
  };

  /**
   * Adds click tracking to elements. Usage:
   *
   *  $('a').track()
   *
   */
	$.fn.track = function(options) {
		
    var element = $(this);
		
    // Prevent link from being tracked multiple times 
    if (element.hasClass("tracked")) {
      return;
    }

 		element.addClass("tracked");

    // Add click handler to all matching elements
    return this.each(function() {
			var link	 = $(this);

			// Use default options, if necessary
			var settings = $.extend({}, $.fn.track.defaults, options);

			var category = evaluate(link, settings.category);
			var action   = evaluate(link, settings.action);
			var label    = evaluate(link, settings.label);
			var value    = evaluate(link, settings.value);
			
			var message  = "category:'" + category + "' action:'" + action + "' label:'" + label + "' value:'" + value + "'";
			
			debug('Tracking ' + message);

			link.click(function() {				
        
        // Should we skip internal links?
        var skip = settings.skip_internal && (link[0].hostname == location.hostname);
			
        if(!skip) {
          $.trackEvent(category, action, label, value);
				  debug('Tracked ' + message);
        } else {
          debug('Skipped ' + message);
        }

				return true;
			});
		});

    /**
     * Prints to Firebug console if available. 
     */
		function debug(message) {
			if(typeof console != 'undefined') {
				console.debug(message);
			}			
		};
		
    /**
     * If second parameter is a string: returns the value of the second parameter.
     * If the second parameter is a function: passes the element to the function and returns function's return value.
     */
		function evaluate(element, text_or_function) {
			if(typeof text_or_function == 'function') {
				text_or_function = text_or_function(element);
			}
			return text_or_function;
		};
  };

	// Default (overridable) settings
	$.fn.track.defaults = {
		category 	    : function(element) { return (element[0].hostname == location.hostname) ? 'internal':'external'; },
		action   	    : 'click',
		label		      : function(element) { return element.attr('href') },
		value 		    : null,
    skip_internal : true
	};
})(jQuery);
