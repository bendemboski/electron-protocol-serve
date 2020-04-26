## v1.4.0 (2020-04-26)

#### :rocket: Enhancement
* [#4](https://github.com/bendemboski/electron-protocol-serve/pull/4) If a URL points to a directory, look for an index.html ([@bendemboski](https://github.com/bendemboski))

#### :bug: Bug Fix
* [#10](https://github.com/bendemboski/electron-protocol-serve/pull/10) Omit callback to registerFileProtocol on Electron >= 7 (Closes [#9](https://github.com/pichfl/electron-protocol-ember/issues/9)) ([@jacobq](https://github.com/jacobq))

#### :memo: Documentation
* [#6](https://github.com/bendemboski/electron-protocol-serve/pull/6) Corrected example code ([@davidemorotti](https://github.com/davidemorotti))

#### :house: Internal
* [#15](https://github.com/bendemboski/electron-protocol-serve/pull/15) Update dependencies ([@bendemboski](https://github.com/bendemboski))
* [#14](https://github.com/bendemboski/electron-protocol-serve/pull/14) Set up releases using release-it ([@bendemboski](https://github.com/bendemboski))
* [#11](https://github.com/bendemboski/electron-protocol-serve/pull/11) Bump brace-expansion from 1.1.6 to 1.1.11 ([@dependabot[bot]](https://github.com/apps/dependabot))
* [#12](https://github.com/bendemboski/electron-protocol-serve/pull/12) Bump is-my-json-valid from 2.16.0 to 2.20.0 ([@dependabot[bot]](https://github.com/apps/dependabot))
* [#13](https://github.com/bendemboski/electron-protocol-serve/pull/13) Bump js-yaml from 3.8.2 to 3.13.1 ([@dependabot[bot]](https://github.com/apps/dependabot))
* [#8](https://github.com/bendemboski/electron-protocol-serve/pull/8) Bump lodash from 4.17.4 to 4.17.13 ([@dependabot[bot]](https://github.com/apps/dependabot))

#### Committers: 3
- Ben Demboski ([@bendemboski](https://github.com/bendemboski))
- Davide Morotti ([@davidemorotti](https://github.com/davidemorotti))
- Jacob ([@jacobq](https://github.com/jacobq))

# Changelog

## 1.3.0

- Set environment variable allowing renderer process to set module search path correctly
- 1.2.0 is unpublished as it was broken on npm due to a glitch

## 1.1.0

- Made indexPath accessible via options for more complex configuration
- Cleaned up README
- Added error messages for required params

## 1.0.0

- Initial release
