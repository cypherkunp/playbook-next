import fs from 'fs/promises';
import path from 'path';
import { minify } from 'terser';
import { minify as uglify } from 'uglify-js';

async function build() {
  try {
    // Check if 'dist' directory exists, and create it if it doesn't
    try {
      await fs.access('dist');
    } catch (error) {
      await fs.mkdir('dist');
    }

    // Minify JavaScript files into 'dist'
    await minifyJSFiles('*.js', 'dist');

    // Uglify JavaScript files into 'dist'
    await uglifyJSFiles('*.js', 'dist');

    await copyHbsFiles('templates', 'dist/templates');


    console.log('Build completed successfully.');
  } catch (error) {
    console.error('Build failed:', error);
  }
}

async function minifyJSFiles(pattern, outputDirectory) {
  const files = await fs.readdir('.');
  const jsFiles = files.filter((file) => file.endsWith('.js'));

  for (const jsFile of jsFiles) {
    const jsContent = await fs.readFile(jsFile, 'utf-8');
    const minified = await minify(jsContent);

    if (minified.error) {
      throw minified.error;
    }

    await fs.writeFile(`${outputDirectory}/${jsFile}`, minified.code);
  }
}

async function uglifyJSFiles(pattern, outputDirectory) {
  const files = await fs.readdir('.');
  const jsFiles = files.filter((file) => file.endsWith('.js'));

  for (const jsFile of jsFiles) {
    const jsContent = await fs.readFile(jsFile, 'utf-8');
    const uglified = uglify(jsContent);

    if (uglified.error) {
      throw uglified.error;
    }

    await fs.writeFile(`${outputDirectory}/${jsFile}`, uglified.code);
  }
}

async function uglifyHbsFiles(inputDirectory, outputDirectory) {
    const files = await fs.readdir(inputDirectory);
  
    for (const file of files) {
      if (file.endsWith('.hbs')) {
        const hbsContent = await fs.readFile(`${inputDirectory}/${file}`, 'utf-8');
        const uglifiedHbs = uglify(hbsContent);
  
        if (uglifiedHbs.error) {
          throw uglifiedHbs.error;
        }
  
        await fs.writeFile(`${outputDirectory}/${file}`, uglifiedHbs.code);
      }
    }
  }

  async function copyHbsFiles(sourceDir, targetDir) {
    try {
      // Ensure the target directory exists; create it if it doesn't.
      await fs.mkdir(targetDir, { recursive: true });
  
      // Read the list of files in the source directory.
      const files = await fs.readdir(sourceDir);
  
      // Copy each file from the source directory to the target directory.
      for (const file of files) {
        const sourceFilePath = path.join(sourceDir, file);
        const targetFilePath = path.join(targetDir, file);
  
        await fs.copyFile(sourceFilePath, targetFilePath);
      }
  
      console.log('Files copied successfully.');
    } catch (error) {
      console.error('Error copying files:', error);
    }
  }

build();
