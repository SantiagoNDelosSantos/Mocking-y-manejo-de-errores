import { fileURLToPath } from 'url';
import { dirname } from 'path';

// Obtener el nombre de archivo y el nombre de directorio actual usando 'import.meta.url':
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Exportar el nombre de directorio actual (__dirname) para usarlo en otras partes del proyecto.
export default __dirname;