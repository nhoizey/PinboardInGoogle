# PinboardInGoogle

This userscript shows Pinboard bookmarks before Google search results.

It gets the query from Google Search's form and use [Pinboard's feeds](https://pinboard.in/howto/#rss) — using the JSON format — to get bookmarks with the same keywords as tags.

<img src="https://raw.githubusercontent.com/nhoizey/PinboardInGoogle/master/screenshot.png" alt="PinboardInGoogle in action" align="center" />

## Installation

### Firefox

Install [the Greasemonkey extension](https://addons.mozilla.org/fr/firefox/addon/greasemonkey/) and then open [the raw version of the script](https://github.com/nhoizey/PinboardInGoogle/raw/master/PinboardInGoogle.user.js).

### Chrome

**Currently [doesn't work](https://github.com/nhoizey/PinboardInGoogle/issues/7), sorry.**

Download [the userscript file](https://github.com/nhoizey/PinboardInGoogle/raw/master/PinboardInGoogle.user.js) and drag it into [the extensions page](chrome://extensions).

## Contributing

Feel free to fork, fix and [submit a pull requests](https://github.com/nhoizey/PinboardInGoogle/pulls). Alternatively, [open issues](https://github.com/nhoizey/PinboardInGoogle/issues/new) for bugs and feature requests.

[@necolas](https://github.com/necolas) wrote down [some good guidelines for contributing](https://github.com/necolas/issue-guidelines). Please keep these in mind when contributing to this project.

Please use the ```.editorconfig``` file in order to set the right usage of tabs/spaces aso. in your editor. Visit [editorconfig.org](http://editorconfig.org/) for more information.

## License

PinboardInGoogle is released under the MIT License.

Copyright (c) 2015 Nicolas Hoizey <nicolas@hoizey.com>

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
