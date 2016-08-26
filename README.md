# bulk-resize

> Iterates over the decimals of `quality` in `imagemagick.resize({ quality })` so you don't have to.

## Why

In order to get a bunch of images to have the same dimensions AND the same-ish mass. This might be a bit ocd on one's behalf, but I used manually find the right quality to produce a batch of equal weight.

**NOTE**: This piece of software is only good for *shrinking* images.

## Installation

    $ git clone https://github.com/panstav/bulk-resize.git
    $ cd bulk-resize && npm install
    // stretching is good for you
    $ npm link

## Usage

Check it out!

    $ bulk-resize --help
    
If you want to resize some images at `/path/to/lots-of-images` to 400px wide at 30kb

    $ cd /path/to/lots-of-images
    $ bulk-resize -t 30 -w 400