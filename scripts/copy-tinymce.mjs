import fse from 'fs-extra';
import path from 'path';
import { fileURLToPath } from 'url';

const root = path.dirname(path.dirname(fileURLToPath(import.meta.url)));
const dest = path.join(root, 'public', 'tinymce');

fse.emptyDirSync(dest);
fse.copySync(path.join(root, 'node_modules', 'tinymce'), dest, { overwrite: true });
