#!/usr/bin/env perl
# generated regex for color inversion
# vim ~/bin/invert-css-color.pl ; filter-css-colors.pl --color-only --nonames coverage/lcov-report/*.css | sort | uniq | invert-css-color.pl  > replace.pl
my %remap = (
	"#000" => "#fff",
	"#006" => "#ff9",
	"#0074d9" => "#ff8b26",
	"#008" => "#ff7",
	"#044" => "#fbb",
	"#060" => "#f9f",
	"#066" => "#f99",
	"#080" => "#f7f",
	"#111" => "#eee",
	"#333" => "#ccc",
	"#404" => "#bfb",
	"#440" => "#bbf",
	"#555" => "#aaa",
	"#600" => "#9ff",
	"#606" => "#9f9",
	"#660" => "#99f",
	"#666" => "#999",
	"#7f7f7f" => "#808080",
	"#800" => "#7ff",
	"#888" => "#777",
	"#999" => "#666",
	"#bbb" => "#444",
	"#c21f39" => "#3de0c6",
	"#ccc" => "#333",
	"#ddd" => "#222",
	"#e8e8e8" => "#171717",
	"#eaeaea" => "#151515",
	"#eee" => "#111",
	"#f6c6ce" => "#093931",
	"#fce1e5" => "#031e1a",
	"green" => "#f0f",
	"red" => "#0ff",
	"rgb(161,215,106" => "rgb(94, 40, 149",
	"rgb(230,245,208" => "rgb(25, 10, 47",
	"rgb(77,146,33" => "rgb(178, 109, 222",
	"rgba(0,0,0" => "rgba(255, 255, 255",
	"white" => "#000",
	"yellow" => "#00f",
);

while (my $line = <>)
{
	$line =~ s{( red|white|yellow|green|\#[0-9a-fA-F]+|(rgba?\( \s* (\d+) \s* , \s* (\d+) \s* , \s* (\d+)) )}{$remap{lc($1)}}xmsge;
	print $line;
}
