// Copyright (c) Nicolas Hoizey 2015
// Released under the MIT license
//
// --------------------------------------------------------------------
// This is a UserScript.
//
// Read here how to install and use it:
// https://github.com/nhoizey/PinboardInGoogle
// --------------------------------------------------------------------
//
// ==UserScript==
// @name          PinboardInGoogle
// @namespace     com.nicolas-hoizey.lab
// @description   Shows your Pinboard bookmarks before Google Search results
// @author        Nicolas Hoizey (https://nicolas-hoizey.com)
// @license       MIT; https://github.com/nhoizey/PinboardInGoogle/blob/master/LICENSE
// @icon          https://pinboard.in/bluepin.gif
// @version       2.0
// @downloadURL   https://github.com/nhoizey/PinboardInGoogle/raw/master/PinboardInGoogle.user.js
// @include       http://www.google.*/*
// @include       https://www.google.*/*
// @require       https://ajax.googleapis.com/ajax/libs/jquery/2.2.4/jquery.min.js
// @grant         GM_xmlhttpRequest
// ==/UserScript==

(function () {

  // --------------------------------------------------------------------
  // EDIT THESE TWO LINES
  // To find your secret, do this:
  // - go to your Pinboard homepage: https://pinboard.in/
  // - click on the orange RSS link on top right
  // - copy the secret in the URL
  // --------------------------------------------------------------------
  var user = '';
  var secret = '';
  // --------------------------------------------------------------------

  var msg = '',
    html = '',
    queryStr = '',
    jsonUrl = '',
    jsonData = '';

  function initResultBox() {
    // Create the results container
    $('#res').prepend('<div id="PinboardInGoogle" class="small"></div>');

    // Add some style to it
    $('head').append('\
      <style>\
      #PinboardInGoogle { background-color: #eee; padding: .2em; margin-bottom: 1em; }\
      #PinboardInGoogle p { margin: .5em 0; }\
      #PinboardInGoogle p.title { color: #aaa; padding-left: 20px; background: url(https://pinboard.in/bluepin.gif) left center no-repeat; }\
      #PinboardInGoogle .how, #PinboardInGoogle .reset { float: right; font-size: .8em; }\
      #PinboardInGoogle.small li:nth-child(n+4) { display: none; }\
      </style>'
    );
  }

  function handleSearch() {
    // Remove any previously created box
    $('#PinboardInGoogle').remove();

    if ('' === user || '' === secret) {
      initResultBox();
      html = '<p class="title">Pinboard bookmarks</p>';
      html += '<p>You need to edit the userscript to define your username and secret.</p>';
      $('#PinboardInGoogle').html(html);
    } else {
      // Get the query value
      queryStr = window.document.querySelector('form[role=search] input[name=q]').value;

      if (undefined !== queryStr) {
        // Translate the query string to a list of tags
        queryStr = queryStr.replace(/[^\w]/g, " ");
        queryStr = queryStr.replace(/ +/g, " ");
        queryStr = queryStr.replace(/^ | $/g, "");

        // Generate Pinboard API JSON URL
        // https://feeds.pinboard.in/json/v1/secret:....../u:nhoizey/t:24-70mm/t:canon?count=20
        queryStr = queryStr.replace(/\s*(\w+)\s*/g, "/t:$1");
        jsonUrl = 'https://feeds.pinboard.in/json/v1/secret:' + secret + '/u:' + user + queryStr;
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
          onload: function (responseDetails) {
            parseFeed(responseDetails);
          },
          onerror: function (responseDetails) {
            // Show the error message
            console.log('error…');
          }
        });
      }
    }
  }

  function parseFeed(responseDetails) {
    var bookmarks = JSON.parse(responseDetails.response),
      nb = bookmarks.length,
      max = Math.min(nb, 20),
      tagsToLinks = function (tags) {
        var htmlLinks = '';

        tags.forEach(function (tag) {
          htmlLinks += `<a href="https://pinboard.in/t:${tag}" target="_blank">${tag}</a> `
        });

        return htmlLinks;
      };

    if (nb > 0) {
      initResultBox();

      html = '<p class="title">Pinboard bookmarks <a class="how" href="https://github.com/nhoizey/PinboardInGoogle">how does it work?</a></p>';
      html += '<ol>';
      for (var i = 0; i < max; i++) {
        html += '<li class="g"><div class="rc">';
        html += '<h3 class="r"><a href="' + bookmarks[i].u + '">' + bookmarks[i].d + '</a></h3>';
        html += '<div class="f slp">' + tagsToLinks(bookmarks[i].t) + '</div>';
        html += '<span class="st">' + bookmarks[i].n + '</span>';
        html += '</li>';
      }
      html += '<li class="g"><div class="rc"><h3 class="r">&gt;&gt; <a href="https://pinboard.in' + queryStr + '">these bookmarks on Pinboard</a></h3></div></li>';
      html += '</ol><p>';
      if (nb > 3) {
        html += '<a class="more" href="#" onclick="document.querySelector(\'#PinboardInGoogle\').className=\'\'; t = document.querySelector(\'#PinboardInGoogle .more\'); t.parentNode.removeChild(t); return false;">+ show more bookmarks</a>';
      }
      html += '&nbsp;';
      html += '</p>';
    }
    $('#PinboardInGoogle').html(html);
  }

  if (window.location.href.match(/^https:\/\/feeds\.pinboard\.in\/rss\/.*$/)) {
    handleSecret();
  } else {
    $(window.document.querySelector('form[role=search] input[name=q]')).on('change', handleSearch);
    handleSearch();
  }
})();
