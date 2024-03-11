# text2code

text2code is a command-line tool that combines multiple text files into a single output file. It supports filtering files based on glob patterns and can optionally include the file path in the generated output.

## Installation

To install text2code, you need to have Node.js installed on your system. Once you have Node.js installed, you can install text2code globally using npm:

```
npm install -g text2code
```

## Usage

```
Options:
-i, --include      Glob patterns for files to include                [array] [required] [string]
-e, --exclude      Glob patterns for files to exclude                [array] [string]
-p, --include-path When true, file path is appended to the beginning of each file string. Defaults to false [boolean] [default: false]
-o, --output       Output file path                                  [string] [required]
-v, --verbose      Enables verbose logging. Useful for debugging. Defaults to false [boolean] [default: false]
-h, --help         Show help                                         [boolean]
```

## Examples

To combine all TypeScript files in the current directory and its subdirectories, excluding any files in the `node_modules` and `test` directories, and write the output to a file named `out.txt`, you can run the following command:

```
text2code -i "**/*.ts" -e "/node_modules/" -e "**/*.test.ts" -o out.txt

```

To include the file path in the output file, add the `-p` or `--include-path` option:

```
text2code -i "**/*.ts" -e "/node_modules/" -e "**/*.test.ts" -o out.txt -p

```
