# Express Triager Guide

## Issue Triage Process

When a new issue or pull request is opened the issue will be labeled with `needs triage`.
If a triage team member is available they can help make sure all the required information
is provided. Depending on the issue or PR there are several next labels they can add for further
classification:

* `needs triage`: This can be kept if the triager is unsure which next steps to take
* `awaiting more info`: If more info has been requested from the author, apply this label.
* `bug`: Issues that present a reasonable conviction there is a reproducible bug.
* `enhancement`: Issues that are found to be a reasonable candidate feature additions.

If the issue is a question or discussion, it should be moved to GitHub Discussions.

### Moving Discussions and Questions to GitHub Discussions

For issues labeled with `question` or `discuss`, it is recommended to move them to GitHub Discussions instead:

* **Questions**: User questions that do not appear to be bugs or enhancements should be moved to GitHub Discussions.
* **Discussions**: Topics for discussion should be moved to GitHub Discussions. If the discussion leads to a new feature or bug identification, it can be moved back to Issues.

In all cases, issues may be closed by maintainers if they don't receive a timely response when
further information is sought, or when additional questions are asked.

## Approaches and Best Practices for getting into triage contributions

Review the organization's [StatusBoard](https://expressjs.github.io/statusboard/),
pay special attention to these columns: stars, watchers, open issues, and contributors.
This gives you a general idea about the criticality and health of the repository.
Pick a few projects based on that criteria, your interests, and skills (existing or aspiring).

Review the project's contribution guideline if present. In a nutshell,
commit to the community's standards and values. Review the
documentation, for most of the projects it is just the README.md, and
make sure you understand the key APIs, semantics, configurations, and use cases.

It might be helpful to write your own test apps to re-affirm your
understanding of the key functions. This may identify some gaps in
documentation, record those as they might be good PR's to open.
Skim through the issue backlog; identify low hanging issues and mostly new ones.
From those, attempt to recreate issues based on the OP description and
ask questions if required. No question is a bad question!

## Removal of Triage Role

There are a few cases where members can be removed as triagers:

- Breaking the CoC or project contributor guidelines
- Abuse or misuse of the role as deemed by the TC
- Lack of participation for more than 6 months

If any of these happen we will discuss as a part of the triage portion of the regular TC meetings.
If you have questions feel free to reach out to any of the TC members.

## Other Helpful Hints:

- Everyone is welcome to attend the [Express Technical Committee Meetings](https://github.com/expressjs/discussions#expressjs-tc-meetings), and as a triager, it might help to get a better idea of what's happening with the project.
- When exploring the module's functionality there are a few helpful steps:
  - Turn on `DEBUG=*` (see https://www.npmjs.com/package/debug) to get detailed log information
  - It is also a good idea to do live debugging to follow the control flow, try using `node --inspect`
  - It is a good idea to make at least one pass of reading through the entire source
- When reviewing the list of open issues there are some common types and suggested actions:
  - New/unattended issues or simple questions: A good place to start
  - Hard bugs & ongoing discussions: always feel free to chime in and help
  - Issues that imply gaps in the documentation: open PRs with changes or help the user to do so
- For recurring issues, it is helpful to create functional examples to demonstrate (publish as gists or a repo)
- Review and identify the maintainers. If necessary, at-mention one or more of them if you are unsure what to do
- Make sure all your interactions are professional, welcoming, and respectful to the parties involved.
- When an issue refers to security concerns, responsibility is delegated to the repository captain or the security group in any public communication. 
  - If an issue has been open for a long time, the person in charge should be contacted internally through the private Slack chat.