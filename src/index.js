// src/index.js
const fs = require('fs');

console.log("--- Initializare Instanta AG ---");
console.log("Verificare structura foldere...");

const paths = ['./src/components', './src/utils', './assets/textures'];
paths.forEach(p => {
    if (fs.existsSync(p)) {
        console.log(`[OK] Path gasit: ${p}`);
    } else {
        console.log(`[EROARE] Lipseste: ${p}`);
    }
});

console.log("Status: Gata pentru procesare.");
