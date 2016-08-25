# bulk-resize

> Iterates over the decials of quality in `imagemagick.resize({ quality })` so you don't have to, in order to get a bunch of images to have the same dimentions AND the same-ish mass.

## Installation

    $ git clone https://github.com/panstav/bulk-resize.git
    $ cd bulk-resize && npm install
    // streching is good for you
    $ npm link

## Usage

Check it out

    $ bulk-resize --help
    
If you want to resize some images at `/path/to/lots-of-images` to 400px wide at 30kb

    $ cd /path/to/lots-of-images
    $ bulk-resize -t 30 -w 400