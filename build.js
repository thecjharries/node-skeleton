const colors = require('colors/safe');
const execThenable = require('node-exec-promise').exec;
const fs = require('fs');
const fsp = require('fs-promise');
const git = require('simple-git')();
const path = require('path');
const Promise = require('bluebird');
const prompt = require('prompt');

function getDefaultName() {
    return __dirname.match(/[^\/]+$/)[0];
}

const defaultDesc = '';
const defaultVersion = '1.0.0';
const defaultAuthor = 'CJ Harries <cj@wizardsoftheweb.pro>';
const defaultLicense = 'MIT';

// TODO: validate input
const promptProperties = {
    properties: {
        packageName: {
            description: colors.white(`Project name (${getDefaultName()})`)
        },
        packageDesc: {
            description: colors.white(`Description ("${defaultDesc}")`)
        },
        packageVersion: {
            description: colors.white(`Version (${defaultVersion})`)
        },
        packageAuthor: {
            description: colors.white(`Author (${defaultAuthor})`)
        },
        packageLicense: {
            description: colors.white(`License (${defaultLicense})`)
        },
        packageRepo: {
            description: colors.white('Remote repo (optional)')
        }
    }
};

prompt.message = colors.green('node-skeleton');
prompt.delimiter = colors.green(': ');

let remote = null;

function writePackageJson(results) {
    if (results.packageRepo.length > 0) {
        remote = results.packageRepo;
    }
    return fsp.readFile(path.join(__dirname, 'finalPackage.json'), 'utf-8')
        .then((contents) => {
            return contents
                .replace(
                    /<packageName>/gi,
                    results.packageName || getDefaultName()
                )
                .replace(
                    /<packageDesc>/gi,
                    results.packageDesc || defaultDesc
                )
                .replace(
                    /<packageVersion>/gi,
                    results.packageVersion || defaultVersion
                )
                .replace(
                    /<packageAuthor>/gi,
                    results.packageAuthor || defaultAuthor
                )
                .replace(
                    /<packageLicense>/gi,
                    results.packageLicense || defaultLicense
                )
                .replace(
                    /<packageRepo>/gi,
                    results.packageRepo
                )
                .replace(
                    / +"repository": "",\n/gi,
                    ''
                );
        })
        .then((contents) => {
            fsp.writeFile(path.join(__dirname, 'package.json'), contents);
        });
}

function wipeGit() {
    return fsp.remove(path.join(__dirname, '.git'))
        .then(() => {
            return new Promise((resolve, reject) => {
                git.init(() => {
                    if (remote) {
                        git.addRemote('origin', remote, resolve);
                    } else {
                        resolve();
                    }
                });
            });
        });
}

function cleanUp() {
    return fsp.readFile(path.join(__dirname, 'README.md'), 'utf-8')
        .then((contents) => {
            return fsp.writeFile(
                path.join(__dirname, 'README.md'),
                contents.replace(/\n\[\]\(start\)[\s\S]*\[\]\(end\)\n/gi, '')
            );
        })
        .then(() => {
            return fsp.remove(path.join(__dirname, 'finalPackage.json'));
        })
        .then(() => {
            return fsp.remove(path.join(__dirname, 'build.js'));
        })
        .then(() => {
            return execThenable('npm prune');
        })
        .then((stdout) => {
            console.log(stdout);
            return execThenable('npm install');
        })
        .then((stdout) => {
            console.log(stdout);
            return;
        });
}

function exit() {
    process.exit();
}

let promptResults = {};
new Promise((resolve, reject) => {
        prompt.start();

        prompt.get(promptProperties, (error, results) => {
            if (error) {
                return reject(error);
            }
            return resolve(results);
        });
    })
    .then(writePackageJson)
    .then(wipeGit)
    .then(cleanUp)
    .then(exit)
    .catch((error) => {
        console.log(error);
    });
