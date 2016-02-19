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
expressjs/express team with Write or Admin permission level so they are 
able to tag the release commit (see Step 4).

[tunniclm: Is there  a separate way to indicate whether an individual is allowed
           to tag a release, or some higher level of permission?]

### 2. npmjs.com release accesss

The individual making the release will need to be a member of the expressjs 
organisation on npmjs.com so they are able to publish the release package 
(see Step 6).

## How to create a release

### 1. Check all the code and doc changes are in

Check the milestone and labels for the release in github, depending on the
express major version (eg: 4 vs 5) to ensure all the code, tests and
documentation updates are complete.

### 2. Update the History.md and package.json to the new version number

The new release version number is determined by semver and whether the code
for the release includes any semver-minor or semver-major changes.
[tunniclm: link to or explain the semver rules here? Or the semver command-line
           tool?]

The branch to use depends on the major version to be released:

 Major version | Branch
---------------|--------
           4.x | master [tunniclm: how does the 4.x branch get updated?]
           5.x | 5.0    [tunniclm: is this correct?]

The changes so far for the release should already be documented under the
"unreleased" section at the top of the History.md file on the release branch,
as per the usual development practice.
Change "unreleased" to the new release version / date.
Example diff fragment:
```diff
-unreleased
-==========
+4.13.3 / 2015-08-02
+===================
```

The version property in the package.json should already contain the version of
the previous release. Change it to the new release version.

Commit these changes together under a single commit with the message set to
the new release version (eg: `4.13.3`).

Example (in a local clone of expressjs/express):
```shell
git checkout master
<..edit files..>
git add History.md package.json
git commit -m '4.13.3'
```

As per the usual development practice, the commit should follow directly from
the release branch with no merge commit.

### 4. Identify and tag the release commit with the new release version

Create a lightweight tag (rather than an annotated tag) named after the new
release version (eg: `4.13.3`).

Example:
```shell
git tag 4.13.3
```

### 5. Push the release branch changes and tag to github

The commit should be pushed directly to the main repository
(https://github.com/expressjs/express).

Example:
```shell
git push origin master
git push origin 4.13.3
```

### 6. Publish to npmjs.com

Ensure your local working copy is completely clean (no extra or changed files).
You can use `git status` for this purpose.

Example:
```shell
npm login tunniclm
npm publish
```
