# Express.js Community Contributing Guide 1.0

The goal of this document is to create a contribution process that:

* Encourages new contributions.
* Encourages contributors to remain involved.
* Avoids unnecessary processes and bureaucracy whenever possible.
* Creates a transparent decision making process that makes it clear how
contributors can be involved in decision making.

## Vocabulary

* A **Contributor** is any individual creating or commenting on an issue or pull request.
* A **Committer** is a subset of contributors who have been given write access to the repository.
* A **Project Captain** is the lead maintainer of a repository.
* A **TC (Technical Committee)** is a group of committers representing the required technical
expertise to resolve rare disputes.
* A **Triager** is a subset of contributors who have been given triage access to the repository.

## Logging Issues

Log an issue for any question or problem you might have. When in doubt, log an issue, and
any additional policies about what to include will be provided in the responses. The only
exception is security disclosures which should be sent privately.

Committers may direct you to another repository, ask for additional clarifications, and
add appropriate metadata before the issue is addressed.

Please be courteous and respectful. Every participant is expected to follow the
project's Code of Conduct.

## Contributions

Any change to resources in this repository must be through pull requests. This applies to all changes
to documentation, code, binary files, etc. Even long term committers and TC members must use
pull requests.

No pull request can be merged without being reviewed.

For non-trivial contributions, pull requests should sit for at least 36 hours to ensure that
contributors in other timezones have time to review. Consideration should also be given to
weekends and other holiday periods to ensure active committers all have reasonable time to
become involved in the discussion and review process if they wish.

The default for each contribution is that it is accepted once no committer has an objection.
During a review, committers may also request that a specific contributor who is most versed in a
particular area gives a "LGTM" before the PR can be merged. There is no additional "sign off"
process for contributions to land. Once all issues brought by committers are addressed it can
be landed by any committer.

In the case of an objection being raised in a pull request by another committer, all involved
committers should seek to arrive at a consensus by way of addressing concerns being expressed
by discussion, compromise on the proposed change, or withdrawal of the proposed change.

If a contribution is controversial and committers cannot agree about how to get it to land
or if it should land then it should be escalated to the TC. TC members should regularly
discuss pending contributions in order to find a resolution. It is expected that only a
small minority of issues be brought to the TC for resolution and that discussion and
compromise among committers be the default resolution mechanism.

## Becoming a Triager

Anyone can become a triager! Read more about the process of being a triager in
[the triage process document](Triager-Guide.md).

[Open an issue in `expressjs/express` repo](https://github.com/expressjs/express/issues/new)
to request the triage role. State that you have read and agree to the
[Code of Conduct](Code-Of-Conduct.md) and details of the role.

Here is an example issue content you can copy and paste:

```
Title: Request triager role for <your GitHub username>

I have read and understood the project's Code of Conduct.
I also have read and understood the process and best practices around Express triaging.

I request for a triager role for the following GitHub organizations:

jshttp
pillarjs
express
```

Once you have opened your issue, a member of the TC will add you to the `triage` team in
the organizations requested. They will then close the issue.

Happy triaging!

## Becoming a Committer

All contributors who land a non-trivial contribution should be on-boarded in a timely manner,
and added as a committer, and be given write access to the repository.

Committers are expected to follow this policy and continue to send pull requests, go through
proper review, and have other committers merge their pull requests.

## TC Process

The TC uses a "consensus seeking" process for issues that are escalated to the TC.
The group tries to find a resolution that has no open objections among TC members.
If a consensus cannot be reached that has no objections then a majority wins vote
is called. It is also expected that the majority of decisions made by the TC are via
a consensus seeking process and that voting is only used as a last-resort.

Resolution may involve returning the issue to project captains with suggestions on
how to move forward towards a consensus. It is not expected that a meeting of the TC
will resolve all issues on its agenda during that meeting and may prefer to continue
the discussion happening among the project captains.

Members can be added to the TC at any time. Any TC member can nominate another committer
to the TC and the TC uses its standard consensus seeking process to evaluate whether or
not to add this new member. The TC will consist of a minimum of 3 active members and a
maximum of 10. If the TC should drop below 5 members the active TC members should nominate
someone new. If a TC member is stepping down, they are encouraged (but not required) to
nominate someone to take their place.

TC members will be added as admin's on the Github orgs, npm orgs, and other resources as
necessary to be effective in the role.

To remain "active" a TC member should have participation within the last 6 months and miss
no more than three consecutive TC meetings. Members who do not meet this are expected to step down.
If A TC member does not step down, an issue can be opened in the discussions repo to move them
to inactive status. TC members who step down or are removed due to inactivity will be moved
into inactive status.

Inactive status members can become active members by self nomination if the TC is not already
larger than the maximum of 10. They will also be given preference if, while at max size, an
active member steps down.

## Project Captains

The Express TC can designate captains for individual projects/repos in the
organizations. These captains are responsible for being the primary
day-to-day maintainers of the repo on a technical and community front.
Repo captains are empowered with repo ownership and package publication rights.
When there are conflicts, especially on topics that effect the Express project
at large, captains are responsible to raise it up to the TC and drive
those conflicts to resolution. Captains are also responsible for making sure
community members follow the community guidelines, maintaining the repo
and the published package, as well as in providing user support.

Like TC members, Repo captains are a subset of committers.

To become a captain for a project the candidate is expected to participate in that
project for at least 6 months as a committer prior to the request. They should have
helped with code contributions as well as triaging issues. They are also required to
have 2FA enabled on both their GitHub and npm accounts. Any TC member or existing
captain on the repo can nominate another committer to the captain role, submit a PR to
this doc, under `Current Project Captains` section (maintaining the sort order) with
the project, their GitHub handle and npm username (if different). The PR will require
at least 2 approvals from TC members and 2 weeks hold time to allow for comment and/or
dissent.  When the PR is merged, a TC member will add them to the proper GitHub/npm groups.

### Current Project Captains

- `expressjs/express`: @wesleytodd
- `expressjs/discussions`: @wesleytodd
- `expressjs/expressjs.com`: @crandmck
- `expressjs/body-parser`: @wesleytodd
- `expressjs/multer`: @LinusU
- `expressjs/cookie-parser`: @wesleytodd
- `expressjs/generator`: @wesleytodd
- `expressjs/statusboard`: @wesleytodd
- `pillarjs/path-to-regexp`: @blakeembrey
- `pillarjs/router`: @dougwilson, @wesleytodd
- `pillarjs/finalhandler`: @wesleytodd
- `pillarjs/request`: @wesleytodd
- `jshttp/http-errors`: @wesleytodd
- `jshttp/cookie`: @wesleytodd
- `jshttp/on-finished`: @wesleytodd
- `jshttp/forwarded`: @wesleytodd
- `jshttp/proxy-addr`: @wesleytodd

