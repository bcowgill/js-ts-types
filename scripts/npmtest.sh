#!/bin/bash
# test all the npm build targets we rely on
set -x
NPM=npm-json5
$NPM run env
$NPM run json5
$NPM run clean:json
$NPM run clean
$NPM run cleanall
$NPM run lint
$NPM run fix
$NPM run compile
$NPM run compilefix
$NPM run compile:debug
$NPM run compile:cover
$NPM run test
$NPM run testfix
$NPM run test:single -- ./dist/string/shorten.test.js
$NPM run cover
$NPM run precover && npm5 run cover:single -- src/string/shorten-left.test.ts
$NPM run coveralls
$NPM run build

exit 0
// TODO continue testing targets here
cover one script test
$NPM run test:watch
$NPM run watch-mt
$NPM run watch-mt1

exit 0
# below can only be manually tested
$NPM run test:single:repl -- ./dist/string/shorten.test.js
$NPM run test:single:debug -- ./dist/string/shorten.test.js
$NPM run watch
$NPM run addmodule -- module name
$NPM run adddevmodule -- module name
