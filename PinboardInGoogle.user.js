// Copyright (c) Nicolas Hoizey 2015
// Released under the MIT license
//
// PinboardInGoogle
// userscript to show your Pinboard bookmarks alongside Google Search results
//
// Author
// Nicolas Hoizey <nicolas@hoizey.com>
//
// --------------------------------------------------------------------
// This is a UserScript.
//
// To install it on Firefox, you need the Greasemonkey addon:
//   http://greasemonkey.mozdev.org/
// Nothing is needed to install it on Chrome
// --------------------------------------------------------------------
//
// ==UserScript==
// @name          PinboardInGoogle
// @namespace     com.gasteroprod.lab
// @description   shows your Pinboard bookmarks alongside Google Search results
// @version       1.0
// @include       http://www.google.*/*
// @include       https://www.google.*/*
// @require	      https://ajax.googleapis.com/ajax/libs/jquery/1.7.1/jquery.min.js
// @grant         GM_xmlhttpRequest
// ==/UserScript==

(function(w, d) {
		var waitingImg = '<img src="data:image/gif;base64,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" width="16" height="16" alt="..." border="0" />',
        htmlHeader = '<h3>Pinboard bookmarks (<a href="https://github.com/nhoizey/PinboardInGoogle">how?</a>)</h3>',
		    msg = '',
        html = '',
        queryStr = '',
        jsonUrl = '',
        jsonData = '';

		// Create the results container
		$('body').prepend('<div id="PinboardInGoogle"></div>');

		// Add some style to it
	  $('head').append('\
	    <style>\
	    #PinboardInGoogle { position: absolute; right: 10px; top: 180px; width: 320px; font-size: 1em; margin: 1em 0; padding: 0; border: 1px solid #46a; background: white; z-index: 100; }\
	    #PinboardInGoogle h3 { margin: 0; padding: 0.3em; font-weight: bold; background: #e5ecf9; }\
	    #PinboardInGoogle h4 { margin: 0; padding: 0.3em; font-weight: bold; }\
	    #PinboardInGoogle p { margin: .5em; }\
	    #PinboardInGoogle ul { list-style: none; margin: .5em; padding: 0; }\
	    #PinboardInGoogle li { margin: 0; padding: .5em; border-bottom: 1px dotted #46a; }\
      #PinboardInGoogle li:nth-child(2n) { background-color: #eef; }\
      #PinboardInGoogle .tags { font-size: .9em; color: #666; }\
      #PinboardInGoogle .more { float: right; font-weight: bold; }\
	    </style>'
	  );

	  function handleSearch() {
      // Get the query value
      queryStr = d.querySelector('form[role=search] input[name=q]').value;

      if (undefined === queryStr) {
        html = htmlHeader + '<p>No search to perform.</p>';
        $('#PinboardInGoogle').html(html);
      } else {
        // Translate the query string to a list of tags
        queryStr = queryStr.replace(/[^\w]/g, " ");
        queryStr = queryStr.replace(/ +/g, " ");
        queryStr = queryStr.replace(/^ | $/g, "");

        // Show the loading message
        html = htmlHeader + '<p>' + waitingImg + ' Loading bookmarks tagged <strong>' + queryStr + '</strong>...</p>';
        $('#PinboardInGoogle').html(html);

        // Generate Pinboard API JSON URL
        // https://feeds.pinboard.in/json/v1/u:nhoizey/t:24-70mm/t:canon?count=20
    	  queryStr = queryStr.replace(/\s*(\w+)\s*/g, "/t:$1");
    		jsonUrl = 'https://feeds.pinboard.in/json/v1/u:nhoizey' + queryStr;
        jsonData = 'count=20'; // todo: doesn't seem to work

        // Request the API
        GM_xmlhttpRequest({
          method: 'GET',
          url: jsonUrl,
          data: jsonData,
          timeout: 10000, // 10 seconds
          headers: {
            'User-Agent': 'PinboardInGoogle',
            'Accept': 'application/json'
          },
          onload: function(responseDetails) {
            parseFeed(responseDetails);
          },
          onerror: function(responseDetails) {
            // Show the error message
            html = htmlHeader + '<p>Could not load Pinboard bookmarks</p>';
            $('#PinboardInGoogle').html(html);
          }
        });
    	}
	  }

		function parseFeed(responseDetails) {
      var bookmarks = JSON.parse(responseDetails.response),
          nb = bookmarks.length,
          max = Math.min(nb, 20);

      if (nb > 0) {
        html = htmlHeader + '<ul>';
        for (var i = 0; i < max; i++) {
          html += '<li>';
          html += '<a href="' + bookmarks[i].u + '">' + bookmarks[i].d + '</a>';
          html += '<br /><span class="tags">' + bookmarks[i].t.join(', ') + '</span>';
          html += '</li>';
        }
        html += '</ul>';
        if (max < nb) {
          html += '<p class="more"><a href="https://pinboard.in/u:nhoizey' + queryStr + '">more bookmarks</a></p>';
        }
	    } else {
        // Show error
        html = htmlHeader + '<p>No related links!</p>';
	    }
      $('#PinboardInGoogle').html(html);
		}

		$(document.querySelector('form[role=search] input[name=q]')).on('change', handleSearch);
		handleSearch();
})(window, document);
