# Express Release Process

This document contains the technical aspects of the Express release process. The
intended audience is those who have been authorized by the Express Technical
Committee (TC) to create, promote and sign official release builds for Express,
as npm packages hosted on https://npmjs.com/package/express.

## Who can make releases?

Release authorization is given by the Express TC. Once authorized, an individual
must have the following access permissions:

### 1. Github release access

The individual making the release will need to be a member of the
`expressjs/express` team with Write permission level so they are able to tag the
release commit and push changes to the `expressjs/express` repository

### 2. npmjs.com release access

The individual making the release will need to be made an owner on the
`express` package on npmjs.com so they are able to publish the release

### 3. GPG key

The individual making the release will need to have a GPG key and have it added to their GitHub account.

It is expected to sign the commits and tags with the GPG key.

[More details](https://docs.github.com/en/authentication/managing-commit-signature-verification/adding-a-gpg-key-to-your-github-account)


## How to publish a release

Notes:

- Version strings are listed below as "vx.y.z" or "x.y.z". Substitute for the release version.
- Examples will use the fictional release version 11.22.33.

**Key considerations for security releases**

When preparing a security release, follow the instruction in [security-release.md] and not this guide.

Security releases are a special case and should be handled with care. If you are
preparing a security release, you should follow the security steps in the details
sections. It is extremely important to avoid disclosing security vulnerabilities
before the release is available to the public, to avoid putting users at risk.


### 0. Pre-release steps

**Define the scope**
Before preparing a Express.js release, you should know:
- the potential proposed changes (eg: bug fixes, new features, etc)
- the type of release: patch, minor or major
- the version number (according to semantic versioning - http://semver.org)
- the release date expected (when the release will be available in npm). 

**Choosing a good date**

Please avoid releasing on weekends or holidays as it may be difficult to get help if something goes wrong and also to avoid the need to work for the users that will need to update their applications.

**Announce the release**

You should notify the community of your
intent to release. This can be done by creating a message in the slack channel
`#express`. This is to ensure that the community is aware of the release and
can provide feedback if necessary.

**Prepare the environment**

It is expected that you will have a clean environment to prepare the release
and you should have a personal fork of the `expressjs/express` repository to push the
release branch to it. 


### 1. Checkout the major branch and create the release proposal branch

Checkout the major branch locally.

```bash
git remote update
git checkout 11.x
git reset --hard upstream/11.x
```

Create a new branch for the release proposal and push it.

```bash
git checkout -b 11.22.33-proposal
git push origin 11.22.33-proposal
git push upstream 11.22.33-proposal
```


### 2. Cherry pick and backport the changes

Cherry pick and backport the changes to the `11.22.33-proposal` branch
that you want to include in the release and then push the changes

```bash
git cherry-pick -x <commit-hash>
# repeat for each commit that you want to include in the release
git push origin 11.22.33-proposal
git push upstream 11.22.33-proposal
```


### 3. Update the metadata and the changelog


Update the `History.md` and `package.json` files with the new version and the changes and commit it.


```bash
git commit -S -m "11.22.33"
```

Push the changes to the release branch

```bash
git push origin 11.22.33-proposal
git push upstream 11.22.33-proposal
```

### 4. Create a pull request with the release proposal

Create a pull request with the release proposal branch and assign the Repo captains and TC Team to review it. You will target the major version branch (eg: `11.x`) from your personal fork.

If the CI tests are not passing, please fix the issues and update the pull request with the new changes, you can leave the PR in draft mode until the CI tests are passing.

**Important:** if the release has changed you will need to update the files and amend the commit. Add the tag release

You can use [this PR](https://github.com/expressjs/express/pull/5505) as a reference

### 4. Land the release proposal

Once the pull request is approved, you can land it to the major branch (e.g. `11.x`) branch.

```bash
git checkout 11.22.33-proposal
git rebase 11.x
git checkout 11.x
git merge --ff-only 11.22.33-proposal
git push
```

**Important:** a release proposal is approved once the pull request was approved by at least one of the Repo captains or a TC Member and has passed 72h since the PR was opened.

Note: The Pull Request will be closed automatically when the release proposal is merged.

### 5. Tag the release

Tag the release from your release branch (e.g. `11.22.33-proposal`) with the same version number

```bash
git checkout 11.22.33-proposal
git tag 11.22.33 --sign --message "11.22.33"
```

### 6. Push the tag

8. Push the tag to the repository, (e.g.`11.22.33`) 
```bash
git push origin 11.22.33
git push upstream 11.22.33
```

### 7. Publish the release

Create a new release on GitHub using the tag (e.g. https://github.com/UlisesGascon/express/releases/new?tag=11.22.33) use https://github.com/expressjs/express/releases/tag/4.18.3 as an example for title and content format. We can use the `History.md` content has the `Main Changes` section, the other sections are autopopulated when clicking on "Generate Release Notes".

### 8. Publish to npm

This is the most critical step as you won't be able to unpublish the release if something goes wrong. So please double-check everything before publishing.

Check the package content:

```bash
npm publish --dry-run
```

When you are ready to publish, run:

```bash
npm publish
```

### 9. Update the release proposal PR

Add a comment in the pull request with the confirmation of the release and the link to the release on GitHub and npm, (e.g. https://github.com/expressjs/express/pull/5505#issuecomment-1970980785)

### 10. Clean up branches and prepare for the next release

Push the release commit to `main` branch and manage the git conflicts if necessary.

```bash
git checkout main
git reset --hard upstream/main
git cherry-pick 11.22.33-proposal
git push origin main
git push upstream main
``` 

Once the release is published, you can delete the release proposal branch and the tag from your local and remote repositories.

```bash
git push origin --delete 11.22.33-proposal
git push upstream --delete 11.22.33-proposal
```

### 11. Announce the release

Promote the release on Slack (`#express` channel) and in social media (e.g [4.18.3](https://openjs-foundation.slack.com/archives/C02QB1731FH/p1709208390734159)).

### 12. Celebrate it 🎉

**Congratulations!** You have successfully released a new version of Express.js. So now it's time to celebrate it _in whatever form you do this..._