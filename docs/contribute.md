---
layout: default
---

### Contributing

---

Thank you for considering contributing to Sprite! Open-source software thrives thanks to individuals who generously share their time and passion for problem-solving with the community.

#### Overview

This documented is divided into the following sections, listed here for your convenience:

1. [Who Can Help?](#who-can-help)
2. [Technical Description](#technical-description)
3. [Getting Started](#gettings-started)
4. [Making Changes](#making-changes)
5. [Pull Requests](#pull-requests)

#### Who can help?

---

Everyone. There are many areas that need attention, including, but not limited to:

##### Lib (TS/JS)

- Adding features
- Squashing bugs
- Refactoring
- Refining types

##### Frontend (Jekyll / HTML / JS / CSS)

- Refactoring docs site
- CSS improvements
- Implementing new features

##### Design (Documentation Site)

- UI / UX /Accessibility
- Aesthetics

##### Writing

- Improving documentation

#### Technical Description

---

A brief technological description of the library:

##### Lib

- Pure ESM with TypeScript
- Node.js development environment
- Jest for testing
- pnpm is the package manager

##### Docs

- Jekyll / Github Pages
- CSS is a mix of utility classes and custom CSS

---

#### Gettings Started

##### 1. Fork the repository

Fork our repository on GitHub by clicking the "Fork" button in the upper-right corner of the repository page. This will create a copy of the repository in your own GitHub account.

##### 2. Clone the repository

Clone your forked repository to your local machine using the command:

```
git clone https://github.com/<your-username>/sprite.git
```

##### 3. Install dependencies

Install the project from the root of the repository:

```
cd sprite && pnpm install
```

##### 4. Test the project

Run the tests by running the command:

```
pnpm test
```

If all the tests passed, congratulations! You are now ready to begin contributing.

#### Making Changes

##### 1. Create a new branch

Create a new branch for your changes by running the command:

```
git checkout -b my-new-feature
```

##### 2. Make your changes

Make your changes to the code, following good coding standards and best practices.

##### 3. Lint and Format

Code formatting via prettier is accomplished by running the command:

```
pnpm run format
```

Linting is accomplished via

```
pnpm run lint
```

##### 3. Unit Tests

If you added features that require new tests, ensure there are unit tests written for the new functionality. This is accomplished using Jest in the `test/unit` folder located in the project root.

Unit tests are executed by running:

```
pnpm test:unit
```

##### 4. Integration Tests

Integration tests are accomplished using a docker container to spin up a database in isolation that can have tests run against it without worry about interfering with any local data you might have.

1. You will need to ensure that docker is installed on your machine.
2. Run the following command from the root of the sprite repository.

```
docker-compose up
```

---
###### Note

Depending on your environment, you may need to run with elevated privileges (i.e. `sudo`)

---

Once the docker container has established the database, you may run integration tests against it:

```
pnpm test:integration
```

### Pull Requests

A pull request is a request for the upstream (@tragedy-labs/sprite) to incorporate your changes.

#### 1. Push your changes

Push your changes to your forked repository by running the command:

```
git push origin my-new-feature
```

### 2. Create a pull request

Create a pull request on GitHub by clicking the "New pull request" button on your forked repository page.

### 3. Describe your changes

Describe your changes in the pull request description, including any relevant context or explanations.

#### Review Process

---

1. Automated Testing

Your PR will go through automated testing to help ensure nothing was broken in the process.

2. Code Review

Once your PR passes automated testing, a human from the Tragedy Labs organization will review it.

3. Address Feedback

There is a chance that your code will recieve feedback that needs to be addressed prior to being merged.

### 3. Integration

Once your pull request is approved, your changes will be merged into the main repository.

## **Coding Standards**

### 1. Follow TypeScript best practices

Follow the official TypeScript documentation and best practices.

### 2. Use consistent coding style

Use a consistent coding style throughout the project.

### 3. Write clean, readable code

Write clean, readable code that is easy to understand and maintain.

## **Additional Resources**

- [TypeScript documentation](https://www.typescriptlang.org/docs/)
- [Our project's coding standards](https://github.com/your-username/your-repo-name/blob/main/CODING_STANDARDS.md)

## **Thank You!**

Thank you for contributing to our project! Your time and effort in helping make Sprite better is genuinely appreciated.
