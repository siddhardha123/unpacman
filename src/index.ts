#!/usr/bin/env node

import { promises as fs } from "fs";
import * as path from "path";
import pacote from "pacote";
import tar from "tar-stream";
import zlib from "zlib";
import { pipeline } from "stream";
import { promisify } from "util";
import chalk from "chalk";

const pipelineAsync = promisify(pipeline);

async function getDependencySizes(packageJsonPath: string): Promise<void> {
  const packageJson = JSON.parse(await fs.readFile(packageJsonPath, "utf-8"));
  const dependencies = packageJson.dependencies || {};
  let totalUnpackedSize = 0;

  console.log(chalk.bold("Calculating unpacked sizes of dependencies...\n"));
  console.log(chalk.cyan.bold("Package Name") + "  |  " + chalk.cyan.bold("Unpacked Size"));
  console.log(chalk.cyan("-".repeat(40)));

  for (const [dep, version] of Object.entries(dependencies)) {
    try {
      const tarballStream = await pacote.tarball.stream(
        `${dep}@${version}`,
        (stream) => Promise.resolve(stream)
      );

      const unpackedSize = await calculateTarballSize(tarballStream as NodeJS.ReadableStream);
      totalUnpackedSize += unpackedSize;

      const sizeInKB = unpackedSize / 1024;
      const sizeInMB = sizeInKB / 1024;
      let sizeDisplay = `${sizeInKB.toFixed(2)} KB`;

      // Display in MB if the size is greater than 1024 KB
      if (sizeInMB >= 1) {
        sizeDisplay = `${sizeInMB.toFixed(2)} MB`;
      }

      // Colorize output based on size
      if (sizeInKB > 500) {
        console.log(chalk.red(`${dep.padEnd(20)} |  ${sizeDisplay}`));
      } else {
        console.log(chalk.green(`${dep.padEnd(20)} |  ${sizeDisplay}`));
      }
    } catch (error) {
      if (error instanceof Error) {
        console.error(chalk.yellow(`Failed to fetch size for ${dep}: ${error.message}`));
      } else {
        console.error(chalk.yellow(`Failed to fetch size for ${dep}: Unknown error`));
      }
    }
  }

  console.log(chalk.cyan("-".repeat(40)));
  const totalSizeInKB = totalUnpackedSize / 1024;
  const totalSizeInMB = totalSizeInKB / 1024;
  let totalSizeDisplay = `${totalSizeInKB.toFixed(2)} KB`;

  // Display total size in MB if greater than 1024 KB
  if (totalSizeInMB >= 1) {
    totalSizeDisplay = `${totalSizeInMB.toFixed(2)} MB`;
  }

  console.log(chalk.bold(`Total Unpacked Size: ${chalk.magenta.bold(totalSizeDisplay)}`));
}

async function calculateTarballSize(tarballStream: NodeJS.ReadableStream): Promise<number> {
  const extract = tar.extract();
  const gunzip = zlib.createGunzip();
  let totalSize = 0;

  extract.on("entry", (header, stream, next) => {
    totalSize += header.size || 0; // Accumulate the size of each entry
    stream.resume(); // Consume the stream
    stream.on("end", next);
  });

  // Decompress the tarball stream and pipe it to the tar extractor
  await pipelineAsync(tarballStream, gunzip, extract);

  return totalSize;
}

// Locate the nearest package.json and calculate dependency sizes
(async () => {
  const packageJsonPath = path.resolve(process.cwd(), "package.json");

  try {
    console.log(chalk.bold(`Found package.json at: ${packageJsonPath}\n`));
    await getDependencySizes(packageJsonPath);
  } catch (error) {
    if (error instanceof Error) {
      console.error(chalk.red(`Error: ${error.message}`));
    } else {
      console.error(chalk.red("Unknown error occurred."));
    }
  }
})();
