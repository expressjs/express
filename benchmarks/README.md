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

The makefile relies on a particular git config variable that isn't always set:
`credential.username`. Run: `git config --get-all credential.username` to check
whether it is set. If it is not, run:

`git config credential.username "yourusername"`

To set it accordingly.


Once all depedencies are met, you can run: `make` in the `benchmarks` directory
to run a HTTP server tests as defined in the 'run' script.

Once the benchmarks have finished running, your results will be outputed to the
terminal and stored in `results/<your-node-version>/<time-date>`

The output format is as follows:
```
# Of connections
Average latency
Requests / second
```

For more information on how these are calculated, see: `wrk --help`


TODO: Write a script for testing current benchmarks with the last previous
benchmark for this version of Node and (potentially) for this user.


