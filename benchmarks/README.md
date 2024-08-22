# Express Benchmarks

## Installation

You will need to install [wrk](https://github.com/wg/wrk/blob/master/INSTALL) in order to run the benchmarks.

## Running

To run the benchmarks, first install the dependencies `npm i`, then run `make`

The output will look something like this:

```
  50 connections
  1 middleware
 7.15ms
 6784.01

 [...redacted...]

  1000 connections
  10 middleware
 139.21ms
 6155.19

```

### Tip: Include Node.js version in output

You can use `make && node -v` to include the node.js version in the output.

### Tip: Save the results to a file

You can use `make > results.log` to save the results to a file `results.log`.

# Result full test

```bash
$ node ./tools/check-benchmarks.js
```

| (index) |     Framework      | Requests/sec | Transfer/sec |  Latency   | Total Requests | Transfer Total | Latency Stdev | Latency Max |
|---------|--------------------|--------------|--------------|------------|----------------|----------------|---------------|-------------|
|    0    | cluster_fastify     |  138457.36   |   23.24MB    |  15.58ms   |    1388733     |    233.09MB    |   58.10ms     |  842.11ms   |
|    1    | cluster_http        |  137054.68   |   23.27MB    |  14.56ms   |    1376920     |    233.74MB    |   52.84ms     |  802.10ms   |
|    2    | cluster_koa         |  122922.41   |   20.51MB    |  14.97ms   |    1234474     |    206.03MB    |   52.39ms     |  823.15ms   |
|    3    | cluster_hapi        |   94445.64   |   19.91MB    |  23.66ms   |     949082     |    200.03MB    |   83.97ms     |    1.10s    |
|    4    | cluster_restify     |   93398.96   |   16.48MB    |  22.78ms   |     937893     |    165.47MB    |   79.86ms     |    1.09s    |
|    5    | cluster_express     |   43577.99   |    9.89MB    |  60.64ms   |     437738     |     99.36MB    |  190.66ms     |    2.00s    |
|    6    | single_uws          |   37081.93   |    3.71MB    |  27.45ms   |     372355     |     37.29MB    |    3.06ms     |  76.40ms    |
|    7    | cluster_uws         |   35629.39   |    3.57MB    |  28.57ms   |     357699     |     35.82MB    |    1.82ms     |  95.33ms    |
|    8    | single_http         |   24159.04   |    4.10MB    |  42.09ms   |     242998     |     41.25MB    |    7.12ms     |  235.08ms   |
|    9    | single_fastify      |   23794.91   |    3.99MB    |  43.18ms   |     239197     |     40.15MB    |   11.90ms     |  343.66ms   |
|   10    | single_koa          |   20263.96   |    3.38MB    |  50.25ms   |     204371     |     34.11MB    |   17.65ms     |  294.61ms   |
|   11    | single_hapi         |   14163.93   |    2.99MB    |  71.82ms   |     142853     |     30.11MB    |   16.06ms     |  410.62ms   |
|   12    | single_restify      |   14036.58   |    2.48MB    |  72.46ms   |     141118     |     24.90MB    |   13.49ms     |  527.51ms   |
|   13    | single_express      |   6830.47    |    1.55MB    | 147.89ms   |      68993     |     15.66MB    |   29.75ms     |  626.75ms   |

