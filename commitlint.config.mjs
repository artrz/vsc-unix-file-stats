export default { extends: ['@commitlint/config-conventional'] };

// COMMIT STRUCTURE
//     type: short description of the commit content
//   Example:
//     feat: allow to undo last file change

// VALID TYPES:
//   - build: Changes affecting the build system or external dependencies (e.g., changes in webpack, npm packages).
//   - chore: A catch-all type for any other commits. If you're implementing a single feature and it makes sense to divide the work into multiple commits, you should mark one commit as feat and the rest as chore.
//   - ci: Changes to Continuous Integration configuration files and scripts (e.g., Travis, CircleCI, Jenkins).
//   - docs: Changes in documentation only.
//   - feat: Introduces a new feature.
//   - fix: Fixes a bug.
//   - perf: Code changes that improve performance, without functional changes.
//   - refactor: Code changes that neither fix a bug nor introduce a feature, typically improving code readability or structure.
//   - revert: Reverts a previously made commit.
//   - style: Code changes that do not impact the functionality (e.g., formatting, white-space, etc)
//   - test: Addition of missing tests or corrections to existing tests.
