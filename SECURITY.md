# Security Policy

## Supported Versions

We release patches for security vulnerabilities in the following versions:

| Version | Supported          |
| ------- | ------------------ |
| 0.0.x   | :white_check_mark: |

## Reporting a Vulnerability

If you discover a security vulnerability within this project, please send an email to the maintainer. All security vulnerabilities will be promptly addressed.

**Please do not report security vulnerabilities through public GitHub issues.**

### What to Include

When reporting a vulnerability, please include:

- Type of vulnerability
- Full paths of source file(s) related to the vulnerability
- Location of the affected source code (tag/branch/commit or direct URL)
- Any special configuration required to reproduce the issue
- Step-by-step instructions to reproduce the issue
- Proof-of-concept or exploit code (if possible)
- Impact of the issue, including how an attacker might exploit it

### Response Timeline

- We will acknowledge your email within 48 hours
- We will provide a more detailed response within 7 days indicating next steps
- We will keep you informed of the progress towards a fix and announcement
- We may ask for additional information or guidance

## Security Best Practices

When deploying this application:

1. **Keep dependencies updated**: Run `npm audit` regularly and update packages
2. **Use HTTPS**: Always deploy with SSL/TLS enabled
3. **Environment variables**: Never commit sensitive data (API keys, credentials) to version control
4. **Access control**: Implement proper authentication and authorization if needed
5. **Monitor logs**: Set up logging and monitoring for your deployment

## Disclosure Policy

When we receive a security bug report, we will:

1. Confirm the problem and determine affected versions
2. Audit code to find any similar problems
3. Prepare fixes for all supported versions
4. Release new versions as soon as possible

## Comments on this Policy

If you have suggestions on how this process could be improved, please submit a pull request.
