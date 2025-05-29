# Security Policies and Procedures

This document outlines security procedures and general policies for the Express
project.

  * [Reporting a Bug](#reporting-a-bug)
  * [Disclosure Policy](#disclosure-policy)
  * [Comments on this Policy](#comments-on-this-policy)

## Reporting a Bug or Security Vulnerability  

The Express team and community take all security vulnerabilities seriously. 
Thank you for improving the security of Express and related projects. 
We appreciate your efforts in responsible disclosure and will make every effort 
to acknowledge your contributions.  

A [Security triage team member](https://github.com/expressjs/security-wg#security-triage-team) 
or [the repo captain](https://github.com/expressjs/discussions/blob/HEAD/docs/contributing/captains_and_committers.md) 
will acknowledge your report as soon as possible. 
These timelines may extend when our triage 
volunteers are away on holiday, particularly at the end of the year.

After the initial reply to your report, the security team will
endeavor to keep you informed of the progress towards a fix and full
announcement, and may ask for additional information or guidance.

> [!NOTE]  
> You can find more information about our process in [this guide](https://github.com/expressjs/security-wg/blob/main/docs/handle_security_reports.md)

### Reporting Security Bugs via GitHub Security Advisory (Preferred)  

The preferred way to report security vulnerabilities is through 
[GitHub Security Advisories](https://github.com/advisories). 
This allows us to collaborate on a fix while maintaining the 
confidentiality of the report.  

To report a vulnerability
([docs](https://docs.github.com/en/code-security/security-advisories/guidance-on-reporting-and-writing-information-about-vulnerabilities/privately-reporting-a-security-vulnerability)):

1. Visit the **Security** tab of the affected repository on GitHub.  
2. Click **Report a vulnerability** and follow the provided steps.  

This process applies to any repositories within the Express ecosystem. 
If you are unsure whether a repository falls under this policy, 
feel free to reach out via email.  

### Reporting via Email  

If you prefer, you can also report security issues by emailing `express-security@lists.openjsf.org`.  

To ensure a timely response, please include all relevant details directly in the email body rather than linking to external sources or attaching files.  

The lead maintainer will acknowledge your email within 48 hours and provide an initial response outlining the next steps. The security team will keep you updated on the progress and may request additional details.  

## Pre-release Versions

Alpha and Beta releases are unstable and **not suitable for production use**.
Vulnerabilities found in pre-releases should be reported according to the [Reporting a Bug or Security Vulnerability](#reporting-a-bug-or-security-vulnerability) section.
Due to the unstable nature of the branch it is not guaranteed that any fixes will be released in the next pre-release.

## Disclosure Policy

When the security team receives a security bug report, they will assign it to a
primary handler. This person will coordinate the fix and release process,
involving the following steps:

  * Confirm the problem and determine the affected versions.
  * Audit code to find any potential similar problems.
  * Prepare fixes for all releases still under maintenance. These fixes will be
    released as fast as possible to npm.

## The Express Threat Model

We are currently working on a new version of the security model, the most updated version can be found [here](https://github.com/expressjs/security-wg/blob/main/docs/ThreatModel.md)

## Comments on this Policy

If you have suggestions on how this process could be improved please submit a
pull request.
