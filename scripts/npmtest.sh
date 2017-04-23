#!/bin/bash
# test all the npm build targets we rely on
set -x
npm5 run env
npm5 run json5
npm5 run clean
npm5 run cleanall
npm5 run lint
npm5 run fix
npm5 run compile
npm5 run compilefix
npm5 run compile:debug
npm5 run compile:cover
npm5 run test
npm5 run testfix
npm5 run test:single -- ./dist/string/shorten.test.js
npm5 run test:single:repl -- ./dist/string/shorten.test.js
npm5 run test:single:debug -- ./dist/string/shorten.test.js
npm5 run cover
npm5 run precover && npm5 run cover:single -- src/string/shorten-left.test.ts
npm5 run coveralls
npm5 run build

exit 0
// TODO continue testing targets here
npm5 run cover:single -- ./src/string/shorten.test.ts
npm5 run test:watch
npm5 run watch-mt
npm5 run watch-mt1

exit 0
# below can only be manually tested
npm5 run watch

// TODO continue testing targets here
npm5 run start
npm5 run addmodule -- module name
npm5 run adddevmodule -- module name
