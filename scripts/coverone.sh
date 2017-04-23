#!/bin/bash
# run one test plan with coverage and report on only the associated module.

IST_VER="istanbul@1.1.0-alpha.1"
IST_REP_VER="istanbul-reports@^1.0.2"

#===========================================================================
# Change configuration as needed:
NPM=npm5
SRC=src
TESTS=src
CODE_EXT=.ts
SUFF1=spec
SUFF2=test
SUFF3=node

TEST_SUFF1=".$SUFF1$CODE_EXT"
TEST_SUFF2=".$SUFF2$CODE_EXT"
TEST_SUFF3=".$SUFF3$CODE_EXT"
GLOB="$SUFF1|$SUFF2|$SUFF3"

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

How your project must be set up to use this:

Command used to compile all code in prep for coverage:
$NPM run precover

Command used to run coverage for a single test plan:
$NPM run cover:single -- $SRC/path/to/plan$TEST_SUFF1
"
	fi
	exit 0
fi

function assume_module {
	local plan
	plan="$1"
	RETURN=`
	echo $plan |
	GLOB="$GLOB" SRC="$SRC" perl -pne '
		s{\Atests?}{$ENV{SRC}}xmsg;
		s{/tests?/}{/}xmsg;
		s{\.($ENV{GLOB})}{}xmsg
	'`
}

PLANS=`find $TESTS -name "*$TEST_SUFF1" -o -name "*$TEST_SUFF2" -o -name "*$TEST_SUFF3" | sort -d`

#===========================================================================
# list all test plans
if [ $TEST_PLAN == "--list" ]; then
	echo Test plans found and assumed module being tested:
	for plan in $PLANS not.spec.ts test/x.spec.ts; do
		assume_module $plan
		if [ -e "$plan" ]; then
			if [ -e "$RETURN" ]; then
				echo "$plan"
				echo "  ^-- $RETURN"
			else
				echo "$plan: unknown test target module."
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
	echo --all NOT SUPPORTED YET
	exit 1
fi

#===========================================================================
# cover one specific test plan
assume_module $TEST_PLAN
MODULE=$RETURN
echo "$TEST_PLAN => $MODULE"

exit 1

# run one test plan with coverage and report on only the associated module.
# assumes test plan named     ..../tests?/MMMMM.spec.ts  (or node/test)
# has associated module named ..../MMMMM.ts
# or if ..../MMMMM.spec.ts is a test plan and ..../MMMMM.ts is the module
# being tested.

# rm coverage.csv coverage.tar; ./scripts/coverone.sh app/utils/tests/MarkObject.spec.js ; ./scripts/coverone.sh app/utils/tests/Props.spec.js; cat coverage.csv ; tar tvf coverage.tar

COV_DIR=coverage
COV_TAR=coverage.tar
COV_CSV=coverage.csv
COV_LOG=coverage.log
COV_INDEX=$COV_DIR/index.html
PKG=package.json5

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

#===========================================================================
# cover one specific test plan
MODULE=`echo $TEST_PLAN | perl -pne 's{/tests/}{/}xmsg; s{\.(spec|node|test)}{}xmsg'`
COV_HTML=`basename $MODULE`.html

echo TEST_PLAN=$TEST_PLAN
echo MODULE=$MODULE
echo COV_HTML=$COV_HTML

# update the include nyc list in package.json5 with the single module
MODULE="$MODULE" perl -i.covbak -e '
	local $/ = undef;
	$_ = <>;
	s{
		("include" \s* : \s* \[ \s* /\*nyc-marker\*/ \s* ) [^\]]+ (\])
	}{$1 "$ENV{MODULE}" $2}xmsg;
	print
' $PKG

npm run json5
npm run clean:coverage
npm run clean:build:test
echo Covering Single Module $MODULE from $TEST_PLAN
npm run test:coverage:single -- $TEST_PLAN
# restore package.json5 to normal
mv $PKG.covbak $PKG
npm run json5

if [ ! -f $COV_CSV ]; then
	echo "Worst,File,Full Path,Statements,Statements Detail,Branches,Branches Detail,Functions,Functions Detail,Lines,Lines Detail,Test Plan" > $COV_CSV
fi
# first 12 span elements contain the total coverage resuls
# td.file.medium data-value contains file name
TMP=`mktemp`
(\
	cat $COV_CSV; \
	egrep 'span|data-value' $COV_INDEX \
	| MODULE="$MODULE" TEST_PLAN="$TEST_PLAN" perl -ne '
		unless ($filename) {
			if (m{data-value="([^"]+)"}xms)
			{
				$filename = $1
			}
		}
		if (m{<span[^>]*>\s*(.+?)\%?\s*</span>})
		{
			push(@spans, $1);
			if (scalar(@spans) >= 3)
			{
				$cov{$spans[1]} = "$spans[0]%,$spans[2]";
				if (!$worst || $spans[0] < $worst)
				{
					$worst = $spans[0]
				};
				@spans = ()
			}
		}
		END {
			print qq{$worst,$filename,$ENV{MODULE},$cov{Statements},$cov{Branches},$cov{Functions},$cov{Lines},$ENV{TEST_PLAN}\n}
		}
	' \
) | sort -n > $TMP
mv $TMP $COV_CSV

M=r
if [ ! -f $COV_TAR ]; then
	M=c
fi
tar ${M}f $COV_TAR $COV_DIR/$COV_HTML || find $COV_DIR -ls
