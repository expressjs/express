#!/usr/bin/env bash

echo
MW=$1 node $2 &
pid=$!

echo "  $3 connections"

sleep 2

wrk 'http://localhost:3333/?foo[bar]=baz' \
  -d 3 \
  -c $3 \
  -t 8 \
  | grep 'Requests/sec\|Latency' \
  | awk '{ print " " $2 }'

kill $pid
