import fs from "fs";
import * as path from "path";
import fg from "fast-glob";

interface Inputs {
  include: string[];
  ignore: string[];
  outputFilePath: string;
  includePath: boolean;
}

const ensureDirectoryExists = async (filePath: string) => {
  const dirname = path.dirname(filePath);
  try {
    await fs.promises.stat(dirname);
  } catch (err: any) {
    if (err.code === "ENOENT") {
      await ensureDirectoryExists(dirname);
      await fs.promises.mkdir(dirname, { recursive: true });
    } else {
      throw err;
    }
  }
};

export const processFiles = async (inputs: Inputs, verbose: boolean) => {
  const start = +new Date();

  await ensureDirectoryExists(inputs.outputFilePath);

  const fileExists = fs.existsSync(inputs.outputFilePath);
  if (fileExists) {
    if (verbose) {
      console.log("File at out path exists already. Removing.");
    }
    await fs.promises.rm(inputs.outputFilePath);
  }

  const outputFileStream = fs.createWriteStream(inputs.outputFilePath, {
    flags: "a",
  });

  const foundFiles = await fg(inputs.include, {
    ignore: inputs.ignore,
  });

  if (verbose) {
    console.log(`Found ${foundFiles.length} files matching glob patterns`);
    foundFiles.forEach((f) => console.log(f));
  }

  const files = await Promise.all(
    foundFiles.map(async (path) => ({
      path,
      content: await fs.promises.readFile(path, "utf-8"),
    }))
  );

  files.filter(Boolean).forEach(({ path, content }) => {
    if (inputs.includePath) {
      return outputFileStream.write("//" + path + "\n" + content);
    }

    return outputFileStream.write(content);
  });

  outputFileStream.end();

  const end = +new Date();
  const duration = end - start;

  if (verbose) {
    const generatedFile = await fs.promises.readFile(inputs.outputFilePath);

    console.log(`Finished writing to ${inputs.outputFilePath}`);
    console.log(
      `Generated file size: ${
        generatedFile.toString().length
      } bytes in ${duration}ms`
    );
  }
};
