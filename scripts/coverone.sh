#!/bin/bash
# run one test plan with coverage and report on only the associated module.

IST_VER="istanbul@1.1.0-alpha.1"
IST_REP_VER="istanbul-reports@^1.0.2"

#===========================================================================
# Change configuration as needed:
#NPM=npm
NPM=npm-json5
SRC=src
#TESTS=test
TESTS=src
#CODE_EXT=.js
CODE_EXT=.ts
SUFF1=spec
SUFF2=test
SUFF3=node
COV_DIR=coverage/lcov-report

TEST_SUFF1=".$SUFF1$CODE_EXT"
TEST_SUFF2=".$SUFF2$CODE_EXT"
TEST_SUFF3=".$SUFF3$CODE_EXT"
GLOB="$SUFF1|$SUFF2|$SUFF3"

COV_CFG=coverone.cfg
COV_CSV=coverone.csv
COV_TAR=coverone.tar
COV_LOG=coverone.log

COV_INDEX=$COV_DIR/index.html
COV_SCRAPE=`dirname $0`/coverone-scrape.pl
COV_OUTPUT=`dirname $0`/coverone-output.pl

#===========================================================================
USAGE=
TEST_PLAN=$1
if [ -z $TEST_PLAN ]; then
	USAGE=1
else
	if [ "$TEST_PLAN" == "--help" ]; then
		USAGE=2
	fi
fi

if [ ! -z $USAGE ]; then
	echo usage: $0 [--help] [--all] [--list] path/to/a/single/test$TEST_SUFF1

	echo "
Gather coverage results for a single module from a single test plan run.

	--list list all the test plans found.
	--all  run all test plans one after the other combining results.
	--help display detailed command help and how to configure to your use.

Run a single unit test plan and gather coverage results for the associated module. This can help ensure that a module is fully covered by actual tests instead of as a side effect of running other code.

Each single test plan run will gather stats and add to a CSV file. After running a number of tests one at a time, the CSV file can be used to generate a combined html report to view the results.

The associated module for a test plan will be determined by replacing the $TEST_SUFF1 with $CODE_EXT to see if it is in the same directory. If that doesn't work then any /test/ or /tests/ directory will be removed from the test plan full path to try and locate the module. Finally, any initial test/ or tests/ directory will be replaced with $SRC/ in case the tests are in a parallel structure tree to the source code.

For example:

	src/path/dummy$TEST_SUFF1 => src/path/dummy$CODE_EXT
	src/path/tests/dummy$TEST_SUFF1 => src/path/dummy$CODE_EXT
	test/path/dummy$TEST_SUFF1 => src/path/dummy$CODE_EXT

If all else fails, you can configure which modules are covered by which test plans by listing an entry in $COV_CFG of the form:

test/plan$TEST_SUFF1 src/file$CODE_EXT
"
	if [ $USAGE == 2 ]; then
		echo "
Configuration:

	Works with istanbul versions: (may work with other versions)
		$IST_VER
		$IST_REP_VER

	Test plan suffixes supported:
		*$TEST_SUFF1 *$TEST_SUFF2 *$TEST_SUFF3

	Source code glob:
		$SRC/**/*$CODE_EXT

	Test plan glob:
		$TESTS/**/*{$TEST_SUFF1,$TEST_SUFF2,$TEST_SUFF3}

	Manual configuration of which modules are covered by which tests in file:
		$COV_CFG

How your npm package.json5? project must be set up to use this:

	Command used to compile all code in prep for coverage:
		$NPM run precover

	Command used to run coverage for a single test plan:
		$NPM run cover:single -- $SRC/path/to/plan$TEST_SUFF1


Locations of coverage files read and written:

	Coverage output for source modules is assumed to be in:
		$COV_DIR
		$COV_DIR/$SRC

	Output from your project's cover command will be logged to:
		$COV_LOG

	Coverage stats from the output html will be recorded in:
		$COV_CSV

	And the output coverage html pages will be accumulated in:
		$COV_TAR

	The final generated HTML page showing coverage by module:
		$COV_INDEX
"
	fi
	exit 0
fi

function cover_start {
	echo "Init coverone processing."
	rm $COV_CSV $COV_TAR $COV_LOG 2> /dev/null
	echo "Preparing to cover single test plans by compiling with comments enabled." >> $COV_LOG
	$NPM run precover >> $COV_LOG 2>&1
}

function get_test_plans {
	find $TESTS -name "*$TEST_SUFF1" \
		-o -name "*$TEST_SUFF2" \
		-o -name "*$TEST_SUFF3" \
		| sort -d
}

function assume_module {
	local plan
	plan="$1"
	echo $plan | \
		GLOB="$GLOB" SRC="$SRC" perl -pne '
			s{\Atests?}{$ENV{SRC}}xmsg;
			s{/tests?/}{/}xmsg;
			s{\.($ENV{GLOB})}{}xmsg
		'
}

function module_config {
	local plan found
	plan="$1"
   #perl -e "print STDERR qq{mod config $plan\n}"
	#perl -ne "print STDERR qq{find $plan \$_\\n}; if (s{\\A$plan\\s+}{}xms) { print; print STDERR \$_}" $COV_CFG
	found=`perl -ne "if (s{\\A$plan\\s+}{}xms) { print; }" $COV_CFG`
	echo "$found"
}

function append_csv {
	local plan module html TMP
	plan="$1"
	module="$2"
	html="$3"
	if [ ! -f $COV_CSV ]; then
		echo "Worst,File,Full Path,Statements,Statements Detail,Branches,Branches Detail,Functions,Functions Detail,Lines,Lines Detail,Test Plan,Cover HTML" > $COV_CSV
	fi
	# first 12 span elements contain the total coverage resuls
	# td.file.medium data-value contains file name
	TMP=`mktemp`
	(\
		cat $COV_CSV; \
		COV_DIR="$COV_DIR/" MODULE="$module" TEST_PLAN="$plan" $COV_SCRAPE "$html" \
	) | sort -n > $TMP
	mv $TMP $COV_CSV
}

function cover_single {
	local plan module html
	plan="$1"
	module="$2"
	html="$3"
	echo Covering Single Module $module from $plan into $html >> $COV_LOG
	$NPM run cover:single -- "$plan" >> $COV_LOG 2>&1
	if [ -e "$html" ]; then
		append_csv "$plan" "$module" "$html"
		M=r
		if [ ! -f $COV_TAR ]; then
			M=c
		fi
		tar ${M}f $COV_TAR $html
	else
		#find $COV_DIR -type f >> $COV_LOG
		echo "$plan: coverage not found, possible test targets are:"
		pushd $COV_DIR > /dev/null
			find . -type f | grep -v 'index.html' | perl -pne 's{\A}{   }xmsg; s{\.html}{}xmsg'
		popd > /dev/null
	fi
}

function cover_summary {
	echo "Coverage Summary created:"
	echo "$COV_INDEX"
	tar xvf $COV_TAR
	$COV_OUTPUT $COV_CSV > $COV_INDEX
	tar rf $COV_TAR $COV_INDEX $COV_CSV
}

PLANS=$(get_test_plans)

#===========================================================================
# list all test plans
if [ $TEST_PLAN == "--list" ]; then
	echo Test plans found and assumed module being tested:
	for plan in $PLANS; do
		MODULE=$(assume_module "$plan")
		if [ -e "$plan" ]; then
			if [ -e "$MODULE" ]; then
				echo "$plan"
				echo "  ^-- $MODULE"
			else
				echo "$plan: unknown test target module."
			fi
			MODULE=$(module_config "$plan")
			if [ ! -z "$MODULE" ]; then
				echo "  ^-- $MODULE.html (manually configured)"
			fi
		else
			echo "$plan: does not exist."
		fi
	done
	exit 0
fi

#===========================================================================
# cover all test plans
if [ $TEST_PLAN == "--all" ]; then
	cover_start
	for plan in $PLANS; do
		echo "$plan"
		$0 "$plan"
	done
	cover_summary
	exit 0
fi

#===========================================================================
# cover one specific test plan
ACTUAL=$(assume_module "$TEST_PLAN")
MODULE=$(module_config "$TEST_PLAN")
if [ -z "$MODULE" ]; then
	MODULE=$ACTUAL
fi
COV_HTML="$COV_DIR/$MODULE.html"
if [ -e "$TEST_PLAN" ]; then
	if [ -e "$ACTUAL" ]; then
		echo "$TEST_PLAN: covers $ACTUAL into $COV_HTML"
	else
		echo "$TEST_PLAN: configured $MODULE into $COV_HTML"
	fi
	cover_single "$TEST_PLAN" "$ACTUAL" "$COV_HTML"
else
	echo "$TEST_PLAN: does not exist."
fi

exit 1

# rm coverage.csv coverage.tar; ./scripts/coverone.sh app/utils/tests/MarkObject.spec.js ; ./scripts/coverone.sh app/utils/tests/Props.spec.js; cat coverage.csv ; tar tvf coverage.tar

#===========================================================================
# cover all test plans
if [ $TEST_PLAN == "--all" ]; then
	rm $COV_CSV $COV_TAR $COV_LOG
	for test in $PLANS; do
		echo $test;
		./scripts/coverone.sh $test \
			| egrep -A 6 -i 'Covering Single|Coverage summary' \
			| egrep -v '^(--|>)' >> $COV_LOG; done

	tar xvf $COV_TAR
	# generate a new index page from the CSV results (skip Unknown%)
	./scripts/coverone-output.pl $COV_CSV > $COV_INDEX
	tar rf $COV_TAR $COV_INDEX $COV_CSV
	exit 0
fi
