const {execSync, spawn} = require('child_process')
const fs = require('fs')

const runCommand = command => execSync(command, {encoding: 'utf8'}).trim()

const startServer = (middleware, isVersionTest) => {
  console.log(`Starting server with ${middleware} middleware layers...`)
  const server = spawn('node', ['benchmarks/middleware.js'], {
    env: {
      ...process.env,
      MW: middleware,
      NO_LOCAL_EXPRESS: isVersionTest
    },
    stdio: 'inherit'
  })

  return new Promise((resolve, reject) => {
    setTimeout(() => {
      try {
        execSync('curl -s http://127.0.0.1:3333')
        resolve(server)
      } catch (error) {
        server.kill()
        reject(new Error('Server failed to start.'))
      }
    }, 3000)
  })
}

const runLoadTest = (url, connectionsList) => {
  return connectionsList.map(connections => {
    try {
      const output = runCommand(`wrk ${url} -d 3 -c ${connections} -t 8`)
      const reqSec = output.match(/Requests\/sec:\s+(\d+.\d+)/)?.[1]
      const latency = output.match(/Latency\s+(\d+.\d+)/)?.[1]
      return {connections, reqSec, latency}
    } catch (error) {
      console.error(
        `Error running load test for ${connections} connections:`,
        error.message
      )
      return {connections, reqSec: 'N/A', latency: 'N/A'}
    }
  })
}

const generateMarkdownTable = results => {
  const headers = `| Connections | Requests/sec | Latency |\n|-------------|--------------|---------|`
  const rows = results
    .map(
      r => `| ${r.connections} | ${r.reqSec || 'N/A'} | ${r.latency || 'N/A'} |`
    )
    .join('\n')
  return `${headers}\n${rows}`
}

const cleanUp = () => {
  console.log('Cleaning up...')
  runCommand('npm uninstall express')
  runCommand('rm -rf package-lock.json node_modules')
}

const runTests = async ({
  identifier,
  connectionsList,
  middlewareCounts,
  outputFile,
  isVersionTest = false
}) => {
  if (isVersionTest) {
    console.log(`Installing Express v${identifier}...`)
    runCommand(`npm install express@${identifier}`)
  } else {
    console.log(`Checking out branch ${identifier}...`)
    runCommand(`git fetch origin ${identifier}`)
    runCommand(`git checkout ${identifier}`)
    runCommand('npm install')
    console.log('Installing deps...')
  }

  const resultsMarkdown = [
    `\n\n# Load Test Results for ${isVersionTest ? `Express v${identifier}` : `Branch ${identifier}`}`
  ]

  for (const middlewareCount of middlewareCounts) {
    try {
      const server = await startServer(middlewareCount, isVersionTest)
      const results = runLoadTest(
        'http://127.0.0.1:3333/?foo[bar]=baz',
        connectionsList
      )
      server.kill()
      resultsMarkdown.push(
        `### Load test for ${middlewareCount} middleware layers\n\n${generateMarkdownTable(results)}`
      )
    } catch (error) {
      console.error('Error in load test process:', error)
    }
  }

  fs.writeFileSync(outputFile, resultsMarkdown.join('\n\n'))
  cleanUp()
}

const compareBranches = async ({
  prevBranch,
  currBranch,
  connectionsList,
  middlewareCounts,
}) => {
  console.log(`Comparing branches: ${prevBranch} vs ${currBranch}`)
  await runTests({
    identifier: prevBranch,
    connectionsList,
    middlewareCounts,
    outputFile: `benchmarks/results_${prevBranch}.md`,
    isVersionTest: false
  })
  await runTests({
    identifier: currBranch,
    connectionsList,
    middlewareCounts,
    outputFile: `benchmarks/results_${currBranch}.md`,
    isVersionTest: false
  })
}

const compareVersions = async ({
  prevVersion,
  currVersion,
  connectionsList,
  middlewareCounts,
}) => {
  console.log(
    `Comparing versions: Express v${prevVersion} vs Express v${currVersion}`
  )
  await runTests({
    identifier: prevVersion,
    connectionsList,
    middlewareCounts,
    outputFile: `benchmarks/results_${prevVersion}.md`,
    isVersionTest: true
  })
  await runTests({
    identifier: currVersion,
    connectionsList,
    middlewareCounts,
    outputFile: `benchmarks/results_${currVersion}.md`,
    isVersionTest: true
  })
}

const compareBranchAndVersion = async ({
  branch,
  version,
  connectionsList,
  middlewareCounts,
}) => {
  console.log(`Comparing branch ${branch} with Express version ${version}`)
  await runTests({
    identifier: branch,
    connectionsList,
    middlewareCounts,
    outputFile: `benchmarks/results_${branch}.md`,
    isVersionTest: false
  })
  await runTests({
    identifier: version,
    connectionsList,
    middlewareCounts,
    outputFile: `benchmarks/results_${version}.md`,
    isVersionTest: true
  })
}

const main = async () => {
  const connectionsList = [50, 100, 250]
  const middlewareCounts = [1, 10, 25, 50]
  const prevBranch = process.env.PREV_BRANCH
  const currBranch = process.env.CURR_BRANCH
  const prevVersion = process.env.PREV_VERSION
  const currVersion = process.env.CURR_VERSION
  const version = process.env.VERSION
  const branch = process.env.BRANCH

  if (prevBranch && currBranch) {
    await compareBranches({
      prevBranch,
      currBranch,
      connectionsList,
      middlewareCounts,
    })
    return
  }

  if (prevVersion && currVersion) {
    await compareVersions({
      prevVersion,
      currVersion,
      connectionsList,
      middlewareCounts,
    })
    return
  }

  if (branch && version) {
    await compareBranchAndVersion({
      branch,
      version,
      connectionsList,
      middlewareCounts,
    })
    return
  }

  console.error(
    'Invalid input combination. Provide either two branches, two versions, or one branch and one version.'
  )
  process.exit(1)
}

main()
