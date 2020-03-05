#!/usr/bin/perl
#
# Perl script to update symlinks to CSS and JS files. Client-side/browser caching is too
# agressive for development even with meta tags in use. Symlinks provide a hack. The
# script will create new symlink in the CSS and JS folders. It will also update allHTML
# files.
#
use strict;
use vars qw($DOC_ROOT $HTML_PATH $CSS_PATH $JS_PATH);


$DOC_ROOT = '/var/www/html';
$HTML_PATH = $DOC_ROOT.'/gray';
$CSS_PATH = $DOC_ROOT.'/css';
$JS_PATH = $DOC_ROOT.'/js';


sub pdbug {
    my $msg = shift;
    my ($program) = $0 =~ /(\w+\.pl)/;
    print "$program: $msg\n";
}
    

sub get_symlinks {
    my $dir = shift;
    my $ext = shift;

    my @files = glob("$dir/*.$ext");
    my @wanted = ();
    my $file;
    foreach $file (@files) {
        if (-l "$file") {
            push(@wanted, "$file");
            pdbug("Found symlink=($file)");
        }
    }
    return @wanted;
}


sub unlink_relink {
    my $path = shift;
    my $dir = shift;
    my $filename = shift;
    my $ver = shift;
    my $ext = shift;

    my $old_file = "$path/$dir/$filename$ver.$ext";
    pdbug("old_file=($old_file)");
    if ($ver == 99) {
        $ver = 10;
    }
    else {
        $ver++;
    }
    my $new_file = "$path/$dir/$filename$ver.$ext";
    pdbug("new file=($new_file)");

    if (-l "$old_file") {
        unlink "$old_file" or die "Cannot unlink $old_file";
        symlink "$filename$ext", "$new_file";
        pdbug("Unlink success");
    }
    return "$filename$ver.$ext";
}


sub mk_new_symlinks {
    my @files = @_;
    my $file;
    my @updates = ();

    foreach $file (@files) {
        my (@data) = $file =~ m#(/var/www/html)/(css|js)/(\S+\.)(\d\d)\.(css|js)#;
        pdbug("filename=($data[2]), ver=($data[3])");
        push(@updates, unlink_relink(@data));
    }
    return @updates;
}


sub update_links {
    my $html = shift;
    my @updates = @_;
    my $update;

    foreach $update (@updates) {
        pdbug("Updating link=($update)");
        my ($filename, $ver, $ext) = $update =~ m#^(\S+\.)(\d\d)\.(css|js)$#;
        $html =~ s#(/$ext/$filename)\d\d\.($ext)#$1$ver.$2#;
    }
    return $html;
}


sub update_html_files {
    my @updates = @_;

    my @files = glob("$HTML_PATH/*.html");
    my $file;

    foreach $file (@files) {
        pdbug("Reading file=($file)");
        open fh, "<$file" or die "Cannot read $file";
        $/ = undef;
        my $html = <fh>;
        close fh;

        $html = update_links($html, @updates);

        open fh, ">$file" or die "Cannot write $file";
        print fh "$html";
        close fh;
        pdbug("Updated file=($file)");
    }
}


update_html_files(mk_new_symlinks(get_symlinks($CSS_PATH, 'css')), mk_new_symlinks(get_symlinks($JS_PATH, 'js')));


