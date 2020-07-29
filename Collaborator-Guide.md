# Express Collaborator Guide

## Website Issues

Open issues for the expressjs.com website in https://github.com/expressjs/expressjs.com.

## PRs and Code contributions

* Tests must pass.
* Follow the [JavaScript Standard Style](http://standardjs.com/) and `npm run lint`.
* If you fix a bug, add a test.

## Branches

Use the `master` branch for bug fixes or minor work that is intended for the
current release stream.

Use the correspondingly named branch, e.g. `5.0`, for anything intended for
a future release of Express.

## Submitting a Pull Request (PR)

Before you submit your Pull Request (PR) consider the following guidelines:

1. Search [GitHub](https://github.com/expressjs/express/pulls) for an open or closed PR that relates to your submission. You don't want to duplicate effort.

2. [Create an issue](https://github.com/expressjs/express/issues/new) for the
   bug you want to fix or the feature that you want to add.

3. Fork the `expressjs/express` repo.

4. Make your changes in a new git branch:

 ```shell
   git checkout -b my-fix-branch master
 ```

5. Create your patch, **including appropriate test cases**.

6. Install the dependencies by running:

```shell
  npm install
```

7. Run the full expressjs test suite , and ensure that all tests pass :

```shell
 npm run test
```

8. Commit your changes using a descriptive commit message

```shell
 git commit -a
```

Note: the optional commit `-a` command line option will automatically "add" and "rm" edited files.

9. Push your branch to GitHub:

```shell
git push origin my-fix-branch
```

10. In GitHub, Send a pull request to `expressjs:master`

> Make sure to reference your issue from the pull request comments by including the issue number e.g. `#123`.

- If we suggest changes then:

   - Make the required updates.

   - Re-run the expressjs test suites to ensure tests are still passing.

   - Rebase your branch and force push to your GitHub repository (this will update your Pull Request):
   ```shell
   git rebase master -i
   git push -f
   ```

That's it! Thank you for your contribution!

**After your pull request is merged**

After your pull request is merged, you can safely delete your branch and pull the changes from the main (upstream) repository:

- Delete the remote branch on GitHub either through the GitHub web UI or your local shell as follows:

```shell
git push origin --delete my-fix-branch
```

- Check out the master branch:

```shell
git checkout master -f
```

- Delete the local branch:

```sh
git branch -D my-fix-branch
```

## Issues which are questions

We will typically close any vague issues or questions that are specific to some
app you are writing. Please double check the docs and other references before
being trigger happy with posting a question issue.

Things that will help get your question issue looked at:

* Full and runnable JS code.
* Clear description of the problem or unexpected behavior.
* Clear description of the expected result.
* Steps you have taken to debug it yourself.

If you post a question and do not outline the above items or make it easy for
us to understand and reproduce your issue, it will be closed.
