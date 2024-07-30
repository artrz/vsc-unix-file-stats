# unix-file-stats

Adds file stats information  to your editor status bar on *nix environments.

![Preview](https://raw.githubusercontent.com/artrz/vsc-unix-file-stats/main/resources/example.png)

## Features

 - Shows file permissions (file mode)
 - Shows file size
 - Allow to change file permissions (with sudo retry support)

## Requirements

A unix like box. Tested on macOS Sonoma & Debian Sid.

## Extension Settings

This extension contributes the following settings:

* `fileStats.size.enabled`:             Displays the file size on the status bar.
* `fileStats.size.position`:            Sets the position (left or right) of the file size status item.
* `fileStats.size.priority`:            A higher number means nearer to the left.
* `fileStats.permissions.enabled`:      Displays the file permissions on the status bar.
* `fileStats.permissions.position`:     Sets the position (left or right) of the file permissions status item.
* `fileStats.permissions.priority`:     A higher number means nearer to the left.
* `fileStats.permissions.format`:       Sets the permissions format (numeric or letters/-).
* `fileStats.permissions.warnReadonly`: Shows the permissions menu item with a warning background when file in not writeable.

## Release Notes

See the [changelog](./CHANGELOG.md)

## Contributing

First of, thanks for your interest in helping out!

This repository uses ESLint and [Stylistic](https://eslint.style/) to ensure the code quality and [commitlint](https://commitlint.js.org/) to ensure consistent commit messages. Lefthook is configured to automatically perform lint asks on pre-commit and pre-push hooks but for this to work you need to execute `npm run prepare` to install the git hooks. Make sure to run the command to enable the hooks in your cloned repo.

### Pre-commit

Before committing, eslint will run on staged files. If everything is ok, the commit messages will be linted too using the default conventional configuration.

### Pre-push

Before pushing, a package audit is going to be performed to verify there are no risky packages as dependencies.

## License

See the [license](./LICENSE.md)
