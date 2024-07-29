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

Thanks for helping out! This repository uses eslint and stylistic to ensure the code quality. Lefthook is configured to run on pre-commit and pre-push git hooks but for this to work you need to execute `npm run prepare` to install the git hooks.

## License

See the [license](./LICENSE.md)
