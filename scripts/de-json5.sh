#!/bin/sh
# convert json5 specific package.json to json versions so normal npm commands can be used on build vm's
# we run in /bin/sh and use sed instead of bash/perl as there are limited commands available on the build vm's
#set -x
if [ -e package.json5 ]; then
	json5 -c *.json5
	sed -i -e "s/npm-json5/npm/g" -e "s/npm run clean:json/\/bin\/true/g"  -e "s/npm run json5/\/bin\/true/g" package.json
fi
echo == $? ==
