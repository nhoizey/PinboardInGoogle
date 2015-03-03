// Copyright (c) Nicolas Hoizey 2015
// Released under the MIT license
//
// PinboardInGoogle
// userscript to show your Pinboard bookmarks alongside Google Search results
// https://github.com/nhoizey/PinboardInGoogle/
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
// @version       1.1
// @updateURL     https://github.com/nhoizey/PinboardInGoogle/raw/master/PinboardInGoogle.user.js
// @include       http://www.google.*/*
// @include       https://www.google.*/*
// @require	      https://ajax.googleapis.com/ajax/libs/jquery/2.1.3/jquery.min.js
// @grant         GM_xmlhttpRequest
// ==/UserScript==

(function(w, d) {
		var msg = '',
        html = '',
        queryStr = '',
        jsonUrl = '',
        jsonData = '';

	  function handleSearch() {
      // Get the query value
      queryStr = d.querySelector('form[role=search] input[name=q]').value;

      if (undefined !== queryStr) {
        // Translate the query string to a list of tags
        queryStr = queryStr.replace(/[^\w]/g, " ");
        queryStr = queryStr.replace(/ +/g, " ");
        queryStr = queryStr.replace(/^ | $/g, "");

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
            console.log('error…');
          }
        });
    	}
	  }

		function parseFeed(responseDetails) {
      var bookmarks = JSON.parse(responseDetails.response),
          nb = bookmarks.length,
          max = Math.min(nb, 20);

      if (nb > 0) {
        // Create the results container
        $('#res').prepend('<div id="PinboardInGoogle" class="small"></div>');

        // Add some style to it
        $('head').append('\
          <style>\
          #PinboardInGoogle { background-color: #eee; padding: .2em; margin-bottom: 1em; }\
          #PinboardInGoogle p { margin: .5em 0; }\
          #PinboardInGoogle p.title { color: #aaa; padding-left: 20px; background: url(https://pinboard.in/bluepin.gif) left center no-repeat; }\
          #PinboardInGoogle .how { float: right; font-size: .8em; }\
          #PinboardInGoogle.small li:nth-child(n+4) { display: none; }\
          </style>'
        );

        html = '<p class="title">Pinboard bookmarks <a class="how" href="https://github.com/nhoizey/PinboardInGoogle">how does it work?</a></p>';
        html += '<ol>';
        for (var i = 0; i < max; i++) {
          html += '<li class="g"><div class="rc">';
          html += '<h3 class="r"><a href="' + bookmarks[i].u + '">' + bookmarks[i].d + '</a></h3>';
          html += '<div class="f slp">' + bookmarks[i].t.join(', ') + '</div>';
          html += '<span class="st">' + bookmarks[i].n + '</span>';
          html += '</li>';
        }
        html += '</ol><p>';
        if (nb > 3) {
          html += '<a class="more" href="" onclick="document.querySelector(\'#PinboardInGoogle\').className=\'\'; t = document.querySelector(\'#PinboardInGoogle .more\'); t.parentNode.removeChild(t); return false;">+ show more</a>&nbsp;';
        }
        html += '<a href="https://pinboard.in/u:nhoizey' + queryStr + '" style="float: right;">these bookmarks on Pinboard</a>';
        html += '</p>';
	    }
      $('#PinboardInGoogle').html(html);
		}

		$(document.querySelector('form[role=search] input[name=q]')).on('change', handleSearch);
		handleSearch();
})(window, document);
