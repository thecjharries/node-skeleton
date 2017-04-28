# `node-skeleton`

[](start)
## Build

    npm install
    npm run build

This will set up `package.json`, init a fresh repo, and clean up after itself.
[](end)

## Installation

    git clone <repo>
    npm install

## `gulp` Overview

Default is `watch`.

* `gulp doc:build`: runs JSDoc
* `gulp doc:server`: runs JSDoc and starts a local server
* `gulp jshint`: runs JSHint (config in `.jshintrc`)
* `gulp todo`: compiles `TODO.md`
* `gulp watch`: runs JSHint and compiles TODO on file change

## Miscellaneous

### Docs

    gulp doc:build

### TODOs

    gulp todo

### Configs

#### `.editorconfig`

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

#### `.jshintrc`

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
