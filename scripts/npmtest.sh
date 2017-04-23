#!/bin/bash
# test all the npm build targets we rely on
set -x
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
npm5 run test1 -- ./dist/string/shorten.test.js
npm5 run test1:repl -- ./dist/string/shorten.test.js
npm5 run test1:debug -- ./dist/string/shorten.test.js
npm5 run cover
npm5 run coveralls

exit 0
// TODO continue testing targets here
npm5 run build

exit 0
# below can only be manually tested
npm5 run watch
npm5 run start
npm5 run addmodule -- module name
npm5 run adddevmodule -- module name
