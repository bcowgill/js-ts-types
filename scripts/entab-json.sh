#!/bin/bash
INDENT=4 INDENT_TAB=1 INPLACE=1 fix-spaces.sh `ls *.json5 | perl -pne 's{json5}{json}xmsg'`
