import autocannon from "autocannon";
import { argv } from 'process';

const label = argv[2];

async function run() {
  console.log(`Running performance test with label: ${label}`);

  // Start server
  const test = await import('./start-server.mjs');
  const {
    server,
    url
  } = await test.default(label);

  try {
    const result = await autocannon({
      url,
      connections: 10,
      duration: 5,
    });

    console.log(autocannon.printResult(result));
    console.log('Raw Data');
    console.log('---start:expf-autocanon-data---');
    console.log(JSON.stringify(result, null, 2));
    console.log('---end:expf-autocanon-data---');

  } catch (err) {
    console.error("Autocannon error:", err);
  } finally {
    server.close();
  }
}

run();
