# Contributing to Invoice Command

Bug reports, fixes, and features are all welcome.

## Before you start

- **Bugs:** open an issue with steps to reproduce, what you expected, and what happened.
- **Features:** open an issue to discuss the idea before writing much code, so we can agree on the approach.
- **Security issues:** please don't open a public issue. Report them privately through the repository's **Security** tab ("Report a vulnerability").

## Making a change

1. Fork the repo and branch from `development`: `fix/123-short-description` or `feature/123-short-description`, using the issue number.
2. Follow the setup in the [README](README.md).
3. Keep each commit to one logical change, and match the style of the code around it.
4. Run the checks:
   ```bash
   npm run lint
   npm test
   npm run test:e2e   # needs AI_GATEWAY_API_KEY, see the README
   ```
5. Open a pull request against `development` and link the issue (`Closes #123`).

Pull requests from forks don't receive repository secrets, so CI skips the AI-driven end-to-end tests on them. A maintainer runs those before merging.

## Contributor License Agreement

On your first pull request, a bot will ask you to sign the [CLA](CLA.md) by posting a comment. You keep the copyright in your work; the CLA lets the project keep offering Invoice Command under AGPL-3.0 and, if needed, other licenses.

## License

By contributing, you agree that your contributions are licensed as described in the [CLA](CLA.md), and that they are distributed with the project under [AGPL-3.0](LICENSE).
