# Overview

A shell script which uses [wrk](https://github.com/wg/wrk) to test the
performance of Express under various different loads.


# Depedencies

[wrk](https://github.com/wg/wrk) is the HTTP benchmarking tool used.

Your OS may have a binary for it available but if not, you'll have to compile it
from source. To do that, clone its repo and run: `make`. This will output a
binary executable in the directory you ran `make` in.

Add the path to the binary to your path if it isn't already there.

# Instructions

Once all depedencies are met, you can run: `make` in the current directory:
`benchmarks`.


