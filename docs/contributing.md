Here's the edited and formatted document:

---

### Contributing to Sprite

---

Thank you for considering contributing to Sprite! Open-source software thrives thanks to the generous contributions of individuals like you.

#### Overview

This document is divided into the following sections for your convenience:

1. [Who Can Help?](#who-can-help)
2. [Technical Description](#technical-description)
3. [Getting Started](#getting-started)
4. [Making Changes](#making-changes)
5. [Pull Requests](#pull-requests)

#### Who Can Help?

---

Everyone can contribute! Programmers can assist with bugs, features, and optimization, while front-end developers, designers, and writers can help with the docs.

#### Technical Description

---

A brief overview of the library:

**Lib**

- Pure ESM with TypeScript
- Node.js development environment
- Jest for testing
- pnpm as the package manager

**Docs**

- Jekyll / GitHub Pages
- CSS: mix of utility classes and custom CSS

---

#### Getting Started

---

1. **Fork the Repository**

   Fork the repository on GitHub by clicking the "Fork" button in the upper-right corner of the repository page. This will create a copy of the repository in your GitHub account.

2. **Clone the Repository**

   Clone your forked repository to your local machine:

   ```sh
   git clone https://github.com/<your-username>/sprite.git
   ```

3. **Install Dependencies**

   Navigate to the project root and install dependencies:

   ```sh
   cd sprite && pnpm install
   ```

4. **Test the Project**

   Run the unit tests:

   ```sh
   pnpm test:unit
   ```

   If the tests pass, you're ready to start contributing.

#### Making Changes

---

1. **Create a New Branch**

   Create a new branch for your changes:

   ```sh
   git checkout -b my-new-feature
   ```

2. **Make Your Changes**

   Make your changes, following coding standards and best practices.

3. **Lint and Format**

   Format your code with Prettier:

   ```sh
   pnpm run format
   ```

   Lint your code:

   ```sh
   pnpm run lint
   ```

4. **Unit Tests**

   If your changes add new features, write corresponding unit tests. Unit tests are located in the `test/unit` folder and are run with:

   ```sh
   pnpm test:unit
   ```

5. **Integration Tests**

   Integration tests run in a Docker container to ensure they don't interfere with local data. Make sure Docker is installed, then run:

   ```sh
   docker-compose up
   ```

   Once the database is established, run integration tests:

   ```sh
   pnpm test:integration
   ```

   > **Note:** Depending on your environment, you may need to run commands with elevated privileges (e.g., `sudo`).

---

### Pull Requests

---

A pull request (PR) is a request to incorporate your changes into the main repository.

1. **Push Your Changes**

   Push your changes to your forked repository:

   ```sh
   git push origin my-new-feature
   ```

2. **Create a Pull Request**

   On GitHub, click "New pull request" on your forked repository page.

3. **Describe Your Changes**

   Provide a detailed description of your changes, including any relevant context.

#### Review Process

---

1. **Automated Testing**

   Your PR will go through automated tests to ensure nothing was broken.

2. **Code Review**

   After passing tests, a reviewer from Tragedy Labs will review your PR.

3. **Address Feedback**

   You may receive feedback that needs to be addressed before your PR is merged.

4. **Integration**

   Once approved, your changes will be merged into the main repository.

---

### Coding Standards

---

1. **Follow TypeScript Best Practices**

   Adhere to the official TypeScript documentation and best practices.

2. **Use Consistent Coding Style**

   Maintain a consistent coding style throughout the project.

3. **Write Clean, Readable Code**

   Write code that is easy to understand and maintain.

---

### Additional Resources

- [TypeScript Documentation](https://www.typescriptlang.org/docs/)

---

### Thank You!

Thank you for contributing to Sprite! Your efforts are greatly appreciated.
