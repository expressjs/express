const { Octokit } = require("@octokit/rest");

// Parse the PR payload from environment variable or command line arguments
function parsePRPayload() {
  // First try to get from environment variable (preferred for GitHub Actions)
  let payloadArg = process.env.GITHUB_EVENT;

  // Fallback to command line argument for local testing
  if (!payloadArg) {
    payloadArg = process.argv[2];
  }

  if (!payloadArg) {
    console.error(
      "[scripts/detect-readme-pr] ❌ No PR payload provided via GITHUB_EVENT env var or command line"
    );
    process.exit(1);
  }

  try {
    return JSON.parse(payloadArg);
  } catch (error) {
    console.error(
      "[scripts/detect-readme-pr] ❌ Failed to parse PR payload:",
      error.message
    );
    process.exit(1);
  }
}

// Check if PR title contains "update readme" in lowercase
function checkPRTitleContainsUpdateReadme(prTitle) {
  const titleLower = prTitle.toLowerCase();
  const hasUpdateReadme = titleLower.includes("update readme");

  console.log(`[scripts/detect-readme-pr] 📝 PR Title: "${prTitle}"`);
  console.log(
    `[scripts/detect-readme-pr] 🔍 Title contains "update readme": ${hasUpdateReadme}`
  );

  return hasUpdateReadme;
}

// Check if README.md file has been changed using GitHub API
async function checkReadmeFileChanged(payload) {
  const pr = payload.pull_request;
  const repo = payload.repository;

  if (!pr || !repo) {
    console.error("[scripts/detect-readme-pr] ❌ Invalid PR payload structure");
    process.exit(1);
  }

  const octokit = new Octokit({
    auth: process.env.GITHUB_TOKEN,
  });

  try {
    const { data: files } = await octokit.pulls.listFiles({
      owner: repo.owner.login,
      repo: repo.name,
      pull_number: pr.number,
    });

    console.log("[scripts/detect-readme-pr] 📁 Files in PR:", files);

    // Check for README.md file changes (case-insensitive)
    const readmeChanged = files.some(
      (file) => file.filename.toLowerCase() === "readme.md"
    );

    console.log(
      `[scripts/detect-readme-pr] 📁 Files changed in PR: ${files.length}`
    );
    console.log(
      `[scripts/detect-readme-pr] 📄 README.md changed: ${readmeChanged}`
    );

    if (readmeChanged) {
      const readmeFile = files.find(
        (file) => file.filename.toLowerCase() === "readme.md"
      );
      console.log(
        `[scripts/detect-readme-pr] 📊 README.md changes: ${readmeFile.changes} additions, ${readmeFile.additions} additions, ${readmeFile.deletions} deletions`
      );
    }

    return readmeChanged;
  } catch (error) {
    console.error(
      "[scripts/detect-readme-pr] ❌ Error checking PR files:",
      error.message
    );
    return false;
  }
}

// Main function
async function main() {
  console.log("[scripts/detect-readme-pr] 🚀 Starting PR analysis...");

  const payload = parsePRPayload();
  // console.log(`[scripts/detect-readme-pr] 🔍 Payload: ${JSON.stringify(payload, null, 2)}`);
  const pr = payload.pull_request;

  if (!pr) {
    console.log(
      "[scripts/detect-readme-pr] ⚠️  No pull request found in payload"
    );
    process.exit(1);
  }

  console.log(`[scripts/detect-readme-pr] 🔗 PR #${pr.number}: ${pr.title}`);

  // Check PR title
  const titleHasUpdateReadme = checkPRTitleContainsUpdateReadme(pr.title);

  // Check if README.md file has changed
  const readmeFileChanged = await checkReadmeFileChanged(payload);

  // Summary
  console.log("\n[scripts/detect-readme-pr] 📋 Summary:");
  console.log(
    `  • Title contains "update readme": ${titleHasUpdateReadme ? "✅" : "❌"}`
  );
  console.log(`  • README.md file changed: ${readmeFileChanged ? "✅" : "❌"}`);

  if (titleHasUpdateReadme && readmeFileChanged) {
    console.log(
      "[scripts/detect-readme-pr] ❌ PR is irrelevant - Youtube tutorial!"
    );
    process.exit(1);
  } else if (titleHasUpdateReadme) {
    console.log(
      '[scripts/detect-readme-pr] ⚠️  PR title contains "update readme" but README.md was not changed'
    );
  } else if (readmeFileChanged) {
    console.log(
      '[scripts/detect-readme-pr] ⚠️  README.md was changed but title does not contain "update readme"'
    );
  } else {
    console.log(
      "[scripts/detect-readme-pr] ✅ PR is not created through a Youtube tutorial"
    );
  }
}

// Run the main function
main().catch((error) => {
  console.error("[scripts/detect-readme-pr] ❌ Script failed:", error.message);
  process.exit(1);
});
