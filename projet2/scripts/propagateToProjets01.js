import fs from 'fs';
import path from 'path';

export function propagate() {
  const p2 = path.resolve('projet2/json');
  const p1 = path.resolve('projet1/json');
  const p0 = path.resolve('projet0/json');

  console.log('--- Propagation vers projet0 ---');
  // projet0 : scenario2.json
  if (fs.existsSync(p0)) {
    const s0File = path.join(p0, 'scenario2.json');
    const s0Data = JSON.parse(fs.readFileSync(s0File, 'utf8'));
    const d4 = s0Data.directive ? s0Data.directive.find(d => d.id === 4) : null;
    if (d4) {
      d4.nom = "Souveraineté agricole européenne";
      d4.declaration_intention = "La présente directive vise à garantir la souveraineté agricole de l’Union européenne en instaurant une réserve stratégique de céréales et en soutenant la production agricole locale. Elle entend réduire la dépendance aux importations, renforcer la sécurité alimentaire et promouvoir une agriculture durable et résiliente. Cette initiative s’inscrit dans la stratégie européenne de souveraineté agricole, conformément aux priorités du Conseil européen et du Pacte vert pour l’Europe.";
      fs.writeFileSync(s0File, JSON.stringify(s0Data, null, 2) + '\n', 'utf8');
      console.log(`projet0 : ${s0File} mis à jour.`);
    }
  }

  console.log('--- Propagation vers projet1 ---');
  if (fs.existsSync(p1)) {
    // 1. scenario2.json
    const s1File = path.join(p1, 'scenario2.json');
    const s1Data = JSON.parse(fs.readFileSync(s1File, 'utf8'));
    const d4_1 = s1Data.directive ? s1Data.directive.find(d => d.id === 4) : null;
    if (d4_1) {
      d4_1.nom = "Souveraineté agricole européenne";
      d4_1.declaration_intention = "La présente directive vise à garantir la souveraineté agricole de l’Union européenne en instaurant une réserve stratégique de céréales et en soutenant la production agricole locale. Elle entend réduire la dépendance aux importations, renforcer la sécurité alimentaire et promouvoir une agriculture durable et résiliente. Cette initiative s’inscrit dans la stratégie européenne de souveraineté agricole, conformément aux priorités du Conseil européen et du Pacte vert pour l’Europe.";
      fs.writeFileSync(s1File, JSON.stringify(s1Data, null, 2) + '\n', 'utf8');
      console.log(`projet1 : ${s1File} mis à jour.`);
    }

    // 2. directives/enjeux/s2/s2d4.json
    const enjeuxSrc = path.join(p2, 'directives/enjeux/s2/s2d4.json');
    const enjeuxDest = path.join(p1, 'directives/enjeux/s2/s2d4.json');
    fs.mkdirSync(path.dirname(enjeuxDest), { recursive: true });
    fs.copyFileSync(enjeuxSrc, enjeuxDest);
    console.log(`projet1 : ${enjeuxDest} copié depuis projet2.`);

    // 3. directives/fiches-acteurs/s2/d4/*
    const faDirSrc = path.join(p2, 'directives/fiches-acteurs/s2/d4');
    const faDirDest = path.join(p1, 'directives/fiches-acteurs/s2/d4');
    fs.mkdirSync(faDirDest, { recursive: true });
    const files = ['com_s2-d4.json', 'cou_s2-d4.json', 'par_s2-d4.json', 'lob_s2-d4.json', 's2-d4.json', 'stats2d4.json'];
    for (const f of files) {
      const src = path.join(faDirSrc, f);
      const dest = path.join(faDirDest, f);
      fs.copyFileSync(src, dest);
      console.log(`projet1 : ${dest} copié depuis projet2.`);
    }
  }

  console.log('Propagation terminée avec succès !');
}

propagate();
