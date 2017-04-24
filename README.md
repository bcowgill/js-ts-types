# js-ts-types

## Javascript + Typescript type checking library

At the moment the actual code library is in its infancy, it serves mainly as a tooling reference.

Tooled with tslint + mocha + chai + istanbul + json5.

### Repository
[https://github.com/bcowgill/js-ts-types](https://github.com/bcowgill/js-ts-types)

### Setup for Development

Because `json5` files are used for configuration you must globally install `npm-json5`.  You may also want to define a shell alias of `npm5` to `npm-json5`. Apart from that you simply switch to using `npm5` command instead of `npm` when performing normal `npm` actions.

```bash
npm install --global npm-json5
alias npm5='npm-json5'  # may want to add to your shell startup scripts
npm5 install
npm5 run build
```

In some cases you may need an actual `package.json` file instead of `package.json5` you can generate all the `.json` files from `.json5` with a target:
```bash
npm5 run json5
```

### Development Cycle
The build is configured as simple `npm` run scripts within the `package5.json`.

#### NPM shrinkwrap
In order to freeze the project dependencies to have reliable builds we use `npm5 shrinkwrap`. Whenever you install a new module dependency you need to run `npm5 shrinkwrap` afterward. There are two convenience build targets for this.
```bash
npm5 run addmodule -- some-module@version
npm5 run adddevmodule -- some-module@version
```

#### Code Quality

##### Typescript Lint
We use typescript lint `tslint` to check for quality code. This build target does not create any output, just scans the code and reports bad practice.  In addition simple lint errors can be fixed automatically if you like.

```bash
npm5 run lint
npm5 run fix
```

You can suppress a lint error by name if there is no way around it with comments in the code:

```typescript
some code ... // tslint:disable-line:rule-name
```

To actually transpile the typescript code to javascript from `src/` to `dist/` directory use the compile targets.  This will first lint the code (with option to fix issues) before generating the javascript code.

```bash
npm5 run compile
npm5 run compilefix
```

##### Unit Testing
We use mocha and chai as test runner and assertion library.
Unit tests are placed next to the module or class being tested in the `src/` tree.  The standard unit test startup code is in `src/test/setup-tests.ts`.
Running the tests will first lint and compile the code.

```bash
npm5 run test
npm5 run testfix
```

Running and debugging a single test plan.  You can debug in the node REPL or with the Google Chrome devtools using a convenient build target. You will have to provide the path to the built javascript test plan and should put a `debugger;` statement in the source code first.
```bash
npm5 run test:single -- ./dist/plan.test.js
npm5 run test:single:repl -- ./dist/plan.test.js
npm5 run test:single:debug -- ./dist/plan.test.js
```


##### Test Coverage
We use istanbul to check for code coverage when the tests run and fail the build unless our coverage thresholds are met.  To drill down into coverage detail open the file `coverage/lcov-report/index.html` in your browser.

```bash
npm5 run cover
npm5 run coveralls  # to check the thresholds
```

Ideally one test plan will cover one module to 100%. To run coverage for a single test plan you can specify it on the command line.  You have to have used the `compile:cover` target previously.

```bash
npm5 run compile:cover  # once to instrument all the code
npm5 run cover:single -- src/path/module.ts
npm5 run cover:single -- src/path/another.ts
```

You can instruct istanbul to ignore a line or block for coverage purposes if there is no way to cover it.
```typescript
/* istanbul ignore next: reason */
```

##### Development Watchers

You can run a poor man's watch which can run the coverage or fix lint issues for you:

```bash
vim scripts/test.sh  # choose how much of the build you want to execute by uncommenting the appropriate npm5 run line
npm5 run watch
```

You can pause the auto-build by creating a file `pause-build.timestamp` if you are going to start a big operation like git rebase and don't want the code overwritten.


##### Final Build
Because compiling for coverage leaves comments in the code so that `/*istanbul ignore next */` will work, the final build compiles the code without comments after running coverage.

```bash
npm5 run build
```

### Author
```
Brent S.A. Cowgill
```
