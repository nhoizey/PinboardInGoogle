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
// @description   shows your Pinboard bookmarks before Google Search results
// @copyright     2015, Nicolas Hoizey (http://gasteroprod.com/)
// @license       MIT; https://github.com/nhoizey/PinboardInGoogle/blob/master/LICENSE
// @icon          https://pinboard.in/bluepin.gif
// @namespace     com.gasteroprod.lab
// @version       1.6
// @downloadURL   https://github.com/nhoizey/PinboardInGoogle/raw/master/PinboardInGoogle.user.js
// @include       http://www.google.*/*
// @include       https://www.google.*/*
// @include       https://feeds.pinboard.in/rss/*
// @require       https://ajax.googleapis.com/ajax/libs/jquery/2.1.3/jquery.min.js
// @grant         GM_getValue
// @grant         GM_setValue
// @grant         GM_deleteValue
// @grant         GM_xmlhttpRequest
// ==/UserScript==

(function () {
  var msg = '',
    html = '',
    queryStr = '',
    jsonUrl = '',
    jsonData = '';

  function handleSecret() {
    var secret = window.location.href.replace(/^.*\/secret:([^\/]+)\/.*$/g, "$1"),
      user = window.location.href.replace(/^.*\/u:([^\/]+)\/.*$/g, "$1");
    GM_setValue('secret', secret);
    GM_setValue('user', user);
  }

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
    var user = GM_getValue('user'),
      secret = GM_getValue('secret');

    // Remove any previously created box
    $('#PinboardInGoogle').remove();

    if (undefined === user || undefined === secret) {
      initResultBox();
      html = '<p class="title">Pinboard bookmarks</p>';
      html += '<p>To configure this:</p><ol>';
      html += '<li style="list-style: decimal inside">go to <a href="https://pinboard.in/">your Pinboard homepage</a></li>';
      html += '<li style="list-style: decimal inside">click on the orange "<span style="color: orange">RSS</span>" link on top right</li>';
      html += '<li style="list-style: decimal inside">come back here</li></ol>';
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
