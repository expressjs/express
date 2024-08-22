//@see https://github.com/nestjs/nest/blob/master/tools/benchmarks/check-benchmarks.ts

const bytes = require('bytes');
const { getBenchmarks, LIBS } = require('./get-benchmarks');

module.default = async function checkBenchmarks() {
  const currentBenchmarks = await getBenchmarks();
  
  const baselineBenchmarks = await loadBaselineBenchmarks();
  
  const report = getBenchmarksReport(currentBenchmarks, baselineBenchmarks);
  
  console.log(report.longDescription);

  await saveBaselineBenchmarks(currentBenchmarks);
}

async function loadBaselineBenchmarks() {
  return undefined;
}

async function saveBaselineBenchmarks(benchmarks) {}

function getBenchmarksReport(current, baseline) {
  const diff = getDiff(current, baseline);

  const shortDescription = getShortDescription(baseline, diff);
  const longDescription = getLongDescription(current, baseline, diff);

  return {
    name: 'Benchmarks',
    status: 'success',
    shortDescription,
    longDescription,
  };
}

function getShortDescription(baseline, diff) {
  if (!baseline) {
    return 'New benchmarks generated';
  }

  const avgDiff = getAverageDiff(diff);
  if (avgDiff > 0) {
    return `Performance improved by ${avgDiff.toFixed(2)}% on average, good job!`;
  }
  if (avgDiff === 0) {
    return `No changes in performance detected`;
  }
  if (avgDiff < 0) {
    return `Performance decreased by ${avgDiff.toFixed(2)}% on average, be careful!`;
  }
}

function getLongDescription(current, baseline, diff) {
  function printTableRow(id, label) {
    return `${label} | ${current[id].requestsPerSec.toFixed(0)} | ${current[id].transferPerSec} | ${baseline ? formatPerc(diff[id].requestsPerSecDiff) : '-'} | ${baseline ? formatPerc(diff[id].transferPerSecDiff) : '-'}`;
  }

  let table = `
| Framework | Req/sec | Trans/sec | Req/sec DIFF | Trans/sec DIFF |
|-----------|---------|-----------|--------------|----------------|
${printTableRow('express', 'Express')}
${printTableRow('fastify', 'Fastify')}
`;

  return table.trim();
}

function getDiff(current, baseline) {
  const diff = {};
  for (const l of LIBS) {
    if (!baseline) {
      diff[l] = {
        requestsPerSecDiff: undefined,
        transferPerSecDiff: undefined
      };
      continue;
    }

    const currentValue = current[l];
    const baselineValue = baseline[l];

    diff[l] = {
      requestsPerSecDiff: getRequestDiff(
        currentValue.requestsPerSec,
        baselineValue.requestsPerSec,
      ),
      transferPerSecDiff: getTransferDiff(
        currentValue.transferPerSec,
        baselineValue.transferPerSec,
      ),
    };
  }
  return diff;
}

function getTransferDiff(currentTransfer, baselineTransfer) {
  return 1 - bytes.parse(currentTransfer) / bytes.parse(baselineTransfer);
}

function getAverageDiff(diff) {
  const validDiffs = Object.values(diff).filter(
    (d) => d && d.requestsPerSecDiff !== undefined && d.transferPerSecDiff !== undefined
  );
  
  const totalDiff = validDiffs.reduce((acc, d) => {
    return acc + (d.requestsPerSecDiff ?? 0) + (d.transferPerSecDiff ?? 0);
  }, 0);
  
  return totalDiff / (validDiffs.length * 2);
}

function getRequestDiff(currentRequest, baselineRequest) {
  return 1 - currentRequest / baselineRequest;
}

function formatPerc(n) {
  return (n > 0 ? '+' : '') + (n * 100).toFixed(2) + '%';
}
