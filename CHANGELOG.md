# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

## [1.0.0]

### Changed

* Replaced [Viz.js](https://github.com/mdaines/viz.js/) with
[@hpcc-js/wasm](https://github.com/hpcc-systems/hpcc-js-wasm),
thereby upgraded Graphviz to version 2.44.0.

### Added

* Give detailed error messages when the DOT source is incorrect #3

### Fixed

* Newlines in the DOT source are not respected as component delimiters, giving
incorrect graphs #22

## [0.0.1]

### Added

* Rendering a Graphviz image using the `[graphviz]` BBCode tag
* Support for selecting engine

[Unreleased]: https://github.com/discourse/discourse-graphviz/compare/1.0.0...HEAD
[1.0.0]: https://github.com/discourse/discourse-graphviz/compare/0.0.1...1.0.0
[0.0.1]: https://github.com/discourse/discourse-graphviz/compare/1004f91812741205e94d2516f899720aba408a4b...0.0.1
