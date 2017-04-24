#!/usr/bin/env perl
# scrape the coverage values from the html output
# MODULE=path/obj.js TEST_PLAN=path/obj.test.js coverone-scrape.pl index.html

use English qw(-no_match_vars);
use strict;
use warnings;
use Data::Dumper;

my $DEBUG = 0;

local $INPUT_RECORD_SEPARATOR = undef;

my $filename = "";
my $module = "";
my %coverage = ();
my $worst;

my $PCT = 0;
my $TYPE = 1;
my $RATIO = 2;

my $report = $ARGV[0];
my $html = <>;

if ($html =~ m{Code \s+ coverage \s+ report \s+ for \s+ (.+?) \s*</title>}xms)
{
	$module = $1;
}

if ($html =~ m{</a> \s* ([^<>]+?) \s* </h1>}xms)
{
	$filename = $1;
}

$html =~ s{
	<div \s+ class='fl \s+ pad1y .+?>(.+?) </div>
}{
	pull_stats($1);
	''
}xmsge;

#print "module: $module\n";
#print Dumper(\%coverage);
#print qq{\n};
print qq{$worst,$filename,$ENV{MODULE},$coverage{Statements},$coverage{Branches},$coverage{Functions},$coverage{Lines},$ENV{TEST_PLAN},$report\n};

sub pull_stats
{
	my ($div) = @ARG;
	my @stats = ();
	$div =~ s{
		> \s* (.+?) \%? \s* </span>
	}{
		push(@stats, $1);
		''
	}xmsge;
	if (scalar(@stats) >= 3)
	{
		$coverage{$stats[$TYPE]} = "$stats[$PCT]\%,$stats[$RATIO]";
		if (!$worst || $stats[$PCT] < $worst)
		{
			$worst = $stats[$PCT];
		}
	}
	return \@stats;
}
