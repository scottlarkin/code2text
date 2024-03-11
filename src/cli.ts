#!/usr/bin/env node

import * as yargs from "yargs";
import { processFiles } from "./processFiles";

(async () => {
  const argv = await yargs
    .usage("Usage: text2code [options]")
    .option("include", {
      alias: "i",
      description: "Glob patterns for files to include",
      type: "array",
      demandOption: true,
      string: true,
    })
    .option("exclude", {
      alias: "e",
      description: "Glob patterns for files to exclude",
      type: "array",
      string: true,
    })
    .option("include-path", {
      alias: "p",
      description:
        "When true, file path is appended to the beginning of each file string. Defaults to false",
      default: false,
      boolean: true,
    })
    .option("output", {
      alias: "o",
      description: "Output file path",
      type: "string",
      demandOption: true,
    })
    .option("verbose", {
      alias: "v",
      description:
        "Enables verboes logging. Useful for debugging. Defaults to false",
      boolean: true,
      default: false,
    })
    .help("h")
    .alias("h", "help")
    .epilog(
      'Example: bundle all typescript files, ignoring test files and anything in node_modules text2code: -i "**/*.ts" -o out.txt'
    ).argv;

  const inputs = {
    include: argv.include,
    ignore: argv.exclude ?? [],
    outputFilePath: argv.output,
    includePath: argv.includePath,
  };

  if (argv.verbose) {
    console.log("inputs", inputs);
  }

  await processFiles(inputs, argv.verbose);
})().catch((e) => {
  console.error("Error: ", e);
});
