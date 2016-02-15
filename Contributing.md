# Contributing to Express

## Code of Conduct

The [Code of Conduct][] explains the bare minimum behavior expectations for all
contributors to Express. Please read it before participating.

## Developer's Certificate of Origin

All code contributions to Express fall under the Express
[Developer's Certificate of Origin][].

## Issue Contributions

When opening new issues or commenting on existing issues on this repository
please make sure discussions are related to concrete technical issues with the
Express software.

The issues tracker in this repository is not ideal for posting general help
using Express. Helpful information and documentation can be found at
http://expressjs.com.

Issues for the expressjs.com website should be directed to the
[expressjs.com GitHub repository][].

## Code contributions

The Express project has an Open Governance model and welcomes new contributors.
Individuals making significant and valuable contributions are made
Collaborators and given commit-access to the project. See the
[Express governance document][] for more information about how this works.

This document will guide you through the contribution process.

### Step 1: Fork

Fork the project [on GitHub][] and check out your copy locally.

```
$ git clone git@github.com:username/express.git
$ cd express
$ git remote add upstream git://github.com/expressjs/express.git
```

### Step 2: Branch

Create a feature branch and start hacking:

```
$ git checkout -b my-feature-branch -t origin/master
```

Please follow the existing coding style.

### Step 3: Commit

Make sure git knows your name and email address:

```
$ git config --global user.name "J. Random User"
$ git config --global user.email "j.random.user@example.com"
```

Writing good commit logs is important. A commit log should describe what
changed and why. Follow these guidelines when writing one:

* The first line should be 50 characters or less and contain a short
  description of the change.
* Keep the second line blank.
* Wrap all other lines at 72 columns.

A good commit log can look something like this:

```
explaining the commit in one line

Body of commit message is a few lines of text, explaining things
in more detail, possibly giving some background about the issue
being fixed, etc. etc.

The body of the commit message can be several paragraphs, and
please do proper word-wrap and keep columns shorter than about
72 characters or so. That way `git log` will show things
nicely even when it is indented.
```

The header line should be meaningful; it is what other people see when they run
`git shortlog` or `git log --oneline`.

### Step 4: Rebase

Use `git rebase` (*not* `git merge`) to sync your work from time to time.

```
$ git fetch upstream
$ git rebase upstream/master
```

### Step 5: Test

Bug fixes and features should come with tests. Add your tests in the `test/`
directory. Look at other tests to see how they should be structured (license
boilerplate, common includes, etc.).

```
$ npm test
```

All tests must pass. Please do not submit pull requests with failing tests.

### Step 6: Push

```
$ git push origin my-feature-branch
```

Go to https://github.com/yourusername/express and select your feature branch.
Click the 'Pull Request' button and fill out the form.

Pull requests are usually reviewed within a few days. If there are comments to
address, apply your changes in a separate commit and push that to your feature
branch. Post a comment in the pull request afterwards; GitHub does not send out
notifications when you add commits.

[Code of Conduct]: CODE_OF_CONDUCT.md
[Express governance document]: GOVERNANCE.md
[expressjs.com GitHub repository]: https://github.com/strongloop/expressjs.com
[on GitHub]: https://github.com/expressjs/express
[Developer's Certificate of Origin]: GOVERNANCE.md#developers-certificate-of-origin-11
