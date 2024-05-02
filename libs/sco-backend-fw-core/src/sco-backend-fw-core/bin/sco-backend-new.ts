const fs = require('fs');
const fsExtra = require('fs-extra');
const path = require('path');
const { execSync } = require('child_process');
const readline = require('readline');

const BUILD_FILES: string[] = [
    "package.json",
    "package-lock.json",
    "sco-backend-fw-initial.zip",
    "sco-backend-new.d.ts",
    "sco-backend-new.js",
    "sco-backend-new.js.map",
    "node_modules",
];

async function main() {
    console.log(`Sco Backend Framework starting new proyect...`);

    /* Install Dependencies If Not Exists */
    if (!fs.existsSync('./node_modules')) {
        execSync(`npm i`, { stdio: false });
    }
    
    /* Check Build Files And Delete Others */
    deleteNotBuildFiles('./');

    /* Unzip Initial Proyect  */
    if (fs.existsSync('./sco-backend-fw-initial.zip')) {
        await unzipDirectory('./sco-backend-fw-initial.zip', `./`);
    }

    /* Set New Proyect Name  */
    const projectDir: string = process.argv[2] || 'sco-backend-new';
    fs.cpSync('./sco-backend-fw-initial', `./${projectDir}`, {recursive: true});
    fs.rmSync('./sco-backend-fw-initial', { recursive: true, force: true });

    /* Delete New Proyect Git Folder If Exists  */
    if (fs.existsSync(`./${projectDir}/.git`)) {
        fs.rmSync(`./${projectDir}/.git`, { recursive: true, force: true });
    }

    /* Update New Proyect Package Name */
    modifyTextInAllFiles(`./${projectDir}`, `sco-backend-fw-initial`, projectDir);

    /* Take Input Params From Users To Build New Proyect  */
    const wsParam: boolean = formatInputParameterToBoolean(await getUserInputParameter('Do you want to include the Websockets module in the new project? S/N \n'));
    const mongoParam: boolean = formatInputParameterToBoolean(await getUserInputParameter('Do you want to include the Mongodb module in the new project? S/N \n'));
    const sharedParam: boolean = formatInputParameterToBoolean(await getUserInputParameter('Do you want to include the Shared module in the new project? S/N \n'));

    /* Modified Files Variables  */
    let appModulesLines: number[] = [];
    let envFilesLines: number[] = [];
    let mainFileLines: number[] = [];
    let httpErrorFileLines: number[] = [];
    let packageFileLines: number[] = [];
    let mongodbServiceFiles: number[] = [];

    /* Websockets options */
    if (wsParam == false) {
        fs.rmSync(`./${projectDir}/src/core/websockets`, { recursive: true, force: true });

        appModulesLines = [
            ...appModulesLines,
            ...[41, 40, 39, 38, 37, 36, 35, 34, 33, 32, 31, 24, 10, 9],
        ]

        fs.unlinkSync(`./${projectDir}/src/configuration/configuration-webSockets.ts`);

        envFilesLines = [
            ...envFilesLines,
            ...[23, 22, 21, 20, 19],
        ];

        mainFileLines = [
            ...mainFileLines,
            ...[35, 34, 33, 32, 31, 30, 29, 28, 27, 26, 25, 24, 5],
        ];

        httpErrorFileLines = [
            ...httpErrorFileLines,
            ...[7, 6, 5],
        ];

        packageFileLines = [
            ...packageFileLines,
            ...[34, 32, 31],
        ];
    }
    
    /* Mongodb options */
    if (mongoParam == false) {
        fs.rmSync(`./${projectDir}/src/core/mongo-db`, { recursive: true, force: true });

        appModulesLines = [
            ...appModulesLines,
            ...[42, 26, 14, 13],
        ];

        fs.unlinkSync(`./${projectDir}/src/configuration/configuration-mongo.ts`);

        envFilesLines = [
            ...envFilesLines,
            ...[31, 30, 29, 28, 27, 26, 25, 24]
        ];

        httpErrorFileLines = [
            ...httpErrorFileLines,
            ...[10, 9, 8],
        ];

        packageFileLines = [
            ...packageFileLines,
            ...[33, 29],
        ];
    }

    /* Shared options  */
    if (sharedParam == false) {
        fs.rmSync(`./${projectDir}/src/core/shared`, { recursive: true, force: true });

        appModulesLines = [
            ...appModulesLines,
            ...[43, 12],
        ];

        if (mongoParam == true) {
            mongodbServiceFiles = [
                ...mongodbServiceFiles,
                ...[2],
            ];

            modifyTextInFile(
                `./${projectDir}/src/core/mongo-db/mongo-db.service.ts`, 
                `HTTP_ERRORS_CONSTANTS.MONGODB.MONGODB_OPTIONS_NOT_PROVIDED`, 
                `'MongoDB options not provided'`
            );
        }
    }

    /* Order Array Lines */
    appModulesLines = sortArrayGreaterToMinus(appModulesLines);
    envFilesLines = sortArrayGreaterToMinus(envFilesLines);
    mainFileLines = sortArrayGreaterToMinus(mainFileLines);
    httpErrorFileLines = sortArrayGreaterToMinus(httpErrorFileLines);
    packageFileLines = sortArrayGreaterToMinus(packageFileLines);
    mongodbServiceFiles = sortArrayGreaterToMinus(mongodbServiceFiles);

    /* Delete Lines */
    if (fs.existsSync(`./${projectDir}/src/app.module.ts`)) {
        for (let i = 0; i < appModulesLines.length; i++) {
            deleteFileLines(`./${projectDir}/src/app.module.ts`, appModulesLines[i]);
        }
    }

    if (fs.existsSync(`./${projectDir}/env/development.env`) && fs.existsSync(`./${projectDir}/env/production.env`)) {
        for (let i = 0; i < envFilesLines.length; i++) {
            deleteFileLines(`./${projectDir}/env/development.env`, envFilesLines[i]);
            deleteFileLines(`./${projectDir}/env/production.env`, envFilesLines[i]);
        }
    }

    if (fs.existsSync(`./${projectDir}/src/main.ts`)) {
        for (let i = 0; i < mainFileLines.length; i++) {
            deleteFileLines(`./${projectDir}/src/main.ts`, mainFileLines[i]);
        }
    }

    if (fs.existsSync(`./${projectDir}/src/core/shared/http-errors/http-errors.constants.ts`)) {
        for (let i = 0; i < httpErrorFileLines.length; i++) {
            deleteFileLines(`./${projectDir}/src/core/shared/http-errors/http-errors.constants.ts`, httpErrorFileLines[i]);
        }
    }

    if (fs.existsSync(`./${projectDir}/package.json`)) {
        for (let i = 0; i < packageFileLines.length; i++) {
            deleteFileLines(`./${projectDir}/package.json`, packageFileLines[i]);
        }
    }
    
    if (fs.existsSync(`./${projectDir}/src/core/mongo-db/mongo-db.service.ts`)) {
        for (let i = 0; i < mongodbServiceFiles.length; i++) {
            deleteFileLines(`./${projectDir}/src/core/mongo-db/mongo-db.service.ts`, mongodbServiceFiles[i]);
        }
    }

    /* Get User Install Dependencies Response */
    if (formatInputParameterToBoolean(await getUserInputParameter('Do you want to install the dependencies of the new project? S/N \n'))) {
        execSync(`cd ./${projectDir} && npm i`, { stdio: 'inherit' });
    }

    console.log(`Sco Backend Framework proyect '${projectDir}' successfully created!`);
}

main();

function modifyTextInFile(filePath: string, oldString: string, newString: string): void {
    let content = fs.readFileSync(filePath, 'utf8');
    content = content.replace(new RegExp(oldString, 'g'), newString);
    fs.writeFileSync(filePath, content);
}

function modifyTextInAllFiles(folder: string, oldString: string, newString: string): void {
    fs.readdirSync(folder).forEach(file => {
        const src = path.join(folder, file);
        if (fs.statSync(src).isDirectory()) {
            modifyTextInAllFiles(src, oldString, newString);
        } else {
            modifyTextInFile(src, oldString, newString);
        }
    });
}

function getUserInputParameter(message: string): Promise<string> {
    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout
    });
  
    return new Promise<string>((resolve) => {
      rl.question(message, (response: string) => {
        rl.close();
        resolve(response);
      });
    });
}

function formatInputParameterToBoolean(response: string): boolean {
    return response && (response == 'S' || response == 's' || response == 'Y' || response == 'y') ? true : false;;
}

function deleteFileLines(filePath: string, lineNumber: number): void {
    let lineas = fs.readFileSync(filePath, 'utf8').split('\n');
    lineas.splice(lineNumber - 1, 1);
    fs.writeFileSync(filePath, lineas.join('\n'));
}

function sortArrayGreaterToMinus(array: any[]): any[] {
    return array.sort((a, b) => b - a);
}

async function unzipDirectory(inputFilePath: string, outputDirectory: string): Promise<void> {
    const AdmZip = require('adm-zip');
    const zip = new AdmZip (inputFilePath);
    zip.extractAllTo(outputDirectory, true);
};

function deleteNotBuildFiles(folder: string): void {
    fs.readdirSync(folder).forEach(function(element) {
        const src = path.join(folder, element);
        const stat = fs.statSync(src);
        const existBuildFile = BUILD_FILES.find(f => f == src);
        if (!existBuildFile) {
            if (stat.isFile()) {
                fs.unlinkSync(src);
            } else if (stat.isDirectory()) {
                fs.rmSync(src, { recursive: true, force: true });
            }
        }
    });
}