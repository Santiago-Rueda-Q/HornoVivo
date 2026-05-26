const fs = require('fs');
const path = require('path');

const TEMPLATE_FILE = path.join(__dirname, 'template.html');
const COMPONENTS_DIR = path.join(__dirname, 'components');
const OUTPUT_FILE = path.join(__dirname, 'index.html');

function compile() {
  console.log('Compilando componentes...');
  try {
    if (!fs.existsSync(TEMPLATE_FILE)) {
      console.error(`Error: La plantilla base no existe en ${TEMPLATE_FILE}`);
      return;
    }

    let template = fs.readFileSync(TEMPLATE_FILE, 'utf8');
    
    // Buscar patrones: <!-- {{COMP:nombre-componente}} -->
    const compRegex = /<!--\s*\{\{\s*COMP:([a-zA-Z0-9_-]+)\s*\}\}\s*-->/g;
    
    let result = template.replace(compRegex, (fullMatch, compName) => {
      const compPath = path.join(COMPONENTS_DIR, `${compName}.html`);
      if (fs.existsSync(compPath)) {
        console.log(`- Insertando componente: ${compName}`);
        return fs.readFileSync(compPath, 'utf8');
      } else {
        console.warn(`[ADVERTENCIA] Componente no encontrado: ${compName} (${compPath})`);
        return fullMatch;
      }
    });
    
    fs.writeFileSync(OUTPUT_FILE, result, 'utf8');
    console.log(`¡Compilación exitosa! index.html generado en: ${OUTPUT_FILE}\n`);
  } catch (error) {
    console.error('Error durante la compilación:', error);
  }
}

// Analizar argumentos
const args = process.argv.slice(2);
const isWatch = args.includes('--watch');

// Compilación inicial
compile();

if (isWatch) {
  console.log('Modo de escucha activo. Monitoreando cambios en plantilla y componentes...');
  
  // Observar carpeta de componentes (recursivo si el SO lo soporta)
  try {
    fs.watch(COMPONENTS_DIR, { recursive: true }, (eventType, filename) => {
      if (filename) {
        console.log(`Cambio detectado en componente: ${filename}`);
        compile();
      }
    });
  } catch (e) {
    // Si no soporta recursive en este OS, observar la carpeta directamente
    fs.watch(COMPONENTS_DIR, (eventType, filename) => {
      if (filename) {
        console.log(`Cambio detectado en componentes: ${filename}`);
        compile();
      }
    });
  }

  // Observar template.html
  fs.watch(TEMPLATE_FILE, (eventType, filename) => {
    console.log('Cambio detectado en plantilla base (template.html)');
    compile();
  });
}
