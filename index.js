const fs = require('fs'),
	fse = require('fs-extra'),
	globby = require('globby'),
	path = require('path'),
	moment = require('moment');

const FILETYPES = [
	'.JPG',
	'.PNG',
	'.MOV'
];

/**
 * Runs file date sorting over a directory passed as a cli argument.
 * 
 */
function main(){
	let imagesPath = process.argv[2];

	if (!imagesPath) throw new Error('Images path argument not specified.');

	let paths = FILETYPES.map(fileType => path.join(imagesPath, '/**/*' + fileType));

	globby(paths).then(allPaths => {
		allPaths.forEach((filepath, idx, filePaths) => {
			copyFile(filepath);
			console.log(`${idx + 1} / ${filePaths.length} [${(idx/filePaths.length*100).toFixed(2)}%]`);

			if (idx === filePaths.length - 1) console.log('Copying completed!')
		});
	});
}


/**
 * Creates directory based on file creation date and copys file into it.
 * 
 * @param {string} filepath 
 */
function copyFile(filepath) {
	fs.stat(filepath, (err, stats) => {
		let folderName = moment(stats.mtime).format('YYYY-MM-DD');

		let newDir = path.join('output', folderName);
		let newFile = path.join(newDir, filepath.split('/').pop())

		fs.mkdir(newDir, err => {
			try {
				fse.copySync(filepath, newFile);
			} catch (err) {
				console.error(err)
			}
		});
	});
}

main();