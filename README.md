# `node-skeleton`

[](start)
## Build

    npm run build

This will set up `package.json`, init a fresh repo, and clean up after itself.

Everything below is part of the default README.md. Everything above will be erased by `npm run build`. I haven't done any extensive testing, so use at your own risk. The purpose of this project was to figure out a good way to put all of these things together in a single, reusable location.
[](end)

## Installation

    git clone <repo>
    npm install

## `gulp` Overview

Default is `watch`.

* `gulp doc:build`: runs JSDoc
* `gulp doc:server`: runs JSDoc and starts a local server
* `gulp lint`: runs JSHint (config in `.jshintrc`)
* `gulp mocha`: runs `mocha` tests. `npm test` or `mocha` (if globally installed) is probably a better idea.
* `gulp prettify`: runs JS Beautify (config in `.jsbeautifyrc`)
* `gulp todo`: compiles `TODO.md`
* `gulp watch`: runs JSHint and compiles TODO on file change

## Miscellaneous

### Docs

    gulp doc:build
    # or
    gulp doc:server

The command will either compile documentation or compile documentation and launch a local webserver.

### TODOs

    gulp todo

The result is stored in `TODO.md`.

### Configs

#### `.editorconfig`

The excellent [Editor Config](http://editorconfig.org/) makes editor settings as consistent as possible.

    [*]
    # 4 spaces
    indent_style = space
    indent_size = 4
    # Consistent EOL
    end_of_line = lf
    # Consistent charset
    charset = utf-8
    # Consistent terminators
    trim_trailing_whitespace = true
    insert_final_newline = true

#### `.jsbeautifyrc`

Provides a simple config for [JS Beautifier](http://jsbeautifier.org/).

    {
        // Consistent spacing
        "indent_size": 4,
        "indent_char": " ",
        "js": {
            // Consistent spacing
            "indent_size": 4,
            // Allow lax arrays (eg , element)
            "keep_array_indentation": true
        }
    }


#### `.jshintrc`

JS Styleguide using the amazing [JSHint](http://jshint.com/).

    {
        // Require scope
        "curly": true,
        // Require ===
        "eqeqeq": true,
        // Allow newer syntax
        "esnext": true,
        // 4 spaces
        "indent": 4,
        // Allow ", arrayValue"
        "laxcomma": true,
        // Default to node syntax (e.g. require)
        "node": true,
        // Maintain consistent quotations (but don't enforce one)
        "quotmark": true,
        // Required defined variables
        "undef": true,
        // Allow bluebird
        "predef": [ "-Promise" ]
    }
