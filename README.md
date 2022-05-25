<p align="center">
  <img src="https://i.ibb.co/7V7ycrs/image.png" width="500" height="280" alt="Warrior Logo" />
</p>

# Duty Chapter - The duty calls!

In this chapter, there's a duty that require us to use all the collected things to serve the "fanciness" of the Fancy Chapter and initialize an interaction between the chapters.

# Getting Started

## Installation

```bash
$ npm install
```

## Running the app

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

## Test

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```

## Contribution Guide

All the commit messages must be following the [Conventional Commits](https://www.conventionalcommits.org/en/v1.0.0/) guide for semantic purposes! Otherwise your commits will be rejected automatically by commit hook!

#### <a name="commit-header"></a>Commit Message Header

```
<type>(<scope>): <short summary>
  │       │             │
  │       │             └─⫸ Summary in present tense. Not capitalized. No period at the end.
  │       │
  │       └─⫸ Commit Scope: Feature scopes
  │
  └─⫸ Commit Type: build|ci|docs|feat|fix|perf|refactor|test|chore
```

The `<type>` and `<summary>` fields are mandatory, the `(<scope>)` field is optional.

##### Type

Must be one of the following:

- **build**: Changes that affect the build system or external dependencies (example scopes: gulp, broccoli, npm)
- **ci**: Changes to our CI configuration files and scripts (example scopes: Circle, BrowserStack, SauceLabs)
- **docs**: Documentation only changes
- **feat**: A new feature
- **fix**: A bug fix
- **perf**: A code change that improves performance
- **refactor**: A code change that neither fixes a bug nor adds a feature
- **test**: Adding missing tests or correcting existing tests
- **chore**: Adding commit that is not related to code (resolve conflicts, etc...)

##### Scope (Optional)

The scope should be the name of the feature's scope that you're developing, it is OPTIONAL so feel free to skip it if you want to be more generic!
