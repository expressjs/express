//@see https://github.com/nestjs/nest/blob/master/tools/benchmarks/get-benchmarks.ts

const wrkPkg = require('wrk');
const { spawn } = require('child_process');
const { join } = require('path');
const { table } = require('console');

const wrk = (options) =>
  new Promise((resolve, reject) =>
    wrkPkg(options, (err, result) =>
      err ? reject(err) : resolve(result),
    ),
  );

const sleep = (time) =>
  new Promise(resolve => setTimeout(resolve, time));

const BENCHMARK_PATH = join(process.cwd(), 'servers');
const LIBS = [
  'single_uws', 'single_express', 'single_fastify', 
  'single_koa', 'single_hapi', 'single_http', 
  'single_restify', 'cluster_http', 'cluster_express',
  'cluster_uws', 'cluster_fastify', 'cluster_koa',
  'cluster_hapi', 'cluster_restify'
];//cmmv, 

async function runBenchmarkOfLib(lib) {
  const libPath = join(BENCHMARK_PATH, `${lib}.js`);
  const process = spawn('node', [libPath], {
    //detached: true,
  });

  process.stdout.on('data', data => {
    console.log(`stdout: ${data}`);
  });

  process.stderr.on('data', data => {
    console.log(`stderr: ${data}`);
  });

  process.unref();

  await sleep(5000); 

  const result = await wrk({
    threads: 8,
    duration: '10s',
    connections: 1024,
    url: 'http://localhost:3000',
  });

  process.kill();
  return result;
}

async function getBenchmarks() {
  const results = {};
  for (const lib of LIBS) {
    console.log(`Running benchmark for ${lib}`);
    try {
      const result = await runBenchmarkOfLib(lib);
      results[lib] = result;
    } catch (error) {
      console.error(`Error during benchmark for ${lib}:`, error);
    }
  }
  return results;
}

async function run() {
  const results = await getBenchmarks();

  const tableData = Object.entries(results).map(([lib, result]) => ({
    Framework: lib,
    'Requests/sec': result.requestsPerSec,
    'Transfer/sec': result.transferPerSec,
    Latency: result.latencyAvg,
    'Total Requests': result.requestsTotal,
    'Transfer Total': result.transferTotal,
    'Latency Stdev': result.latencyStdev,
    'Latency Max': result.latencyMax,
  }));

  tableData.sort((a, b) => b['Requests/sec'] - a['Requests/sec']);

  console.table(tableData);
}

run();
