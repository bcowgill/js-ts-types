#!/bin/bash
rm error.flag 2> /dev/null > /dev/null

# fix lint errors and run tests only
#(npm run testfix || touch error.flag) 2>&1 | grep -v 'ERR!'

# lint but don't fix and run tests
#(npm run test || touch error.flag) 2>&1 | grep -v 'ERR!'

# run coverage (no fixing)
#(npm run coveralls || touch error.flag) 2>&1 | grep -v 'ERR!'

# run coverage with lint fixing
(if npm run fix 2>&1; then
    (npm run coveralls || touch error.flag) 2>&1 | grep -v 'ERR!'
else
    touch error.flag
fi) | grep -v 'ERR!'

rm error.flag 2> /dev/null && echo BUILD ERROR && exit 1
