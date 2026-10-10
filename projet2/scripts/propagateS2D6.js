import fs from 'fs';
import path from 'path';

export function propagateS2D6() {
  const p2Public = path.resolve('projet2/public/json');
  const p2 = path.resolve('projet2/json');
  const p1 = path.resolve('projet1/json');
  const p0 = path.resolve('projet0/json');

  const refScenario2 = JSON.parse(fs.readFileSync(path.join(p2Public, 'scenario2.json'), 'utf8'));
  const refList = refScenario2.directive || refScenario2.directives;
  const refD6 = refList.find(d => d.id === 6);

  if (!refD6) {
    throw new Error('Directive 6 not found in projet2/public/json/scenario2.json');
  }

  console.log('--- Propagation S2 D6 vers projet0 ---');
  if (fs.existsSync(p0)) {
    const s0File = path.join(p0, 'scenario2.json');
    if (fs.existsSync(s0File)) {
      const s0Data = JSON.parse(fs.readFileSync(s0File, 'utf8'));
      const list0 = s0Data.directive || s0Data.directives;
      const d6Index = list0 ? list0.findIndex(d => d.id === 6) : -1;
      if (d6Index !== -1) {
        list0[d6Index] = JSON.parse(JSON.stringify(refD6));
        fs.writeFileSync(s0File, JSON.stringify(s0Data, null, 2) + '\n', 'utf8');
        console.log(`projet0 : ${s0File} mis à jour pour directive 6.`);
      }
    }
  }

  console.log('--- Propagation S2 D6 vers projet1 ---');
  if (fs.existsSync(p1)) {
    // 1. scenario2.json
    const s1File = path.join(p1, 'scenario2.json');
    if (fs.existsSync(s1File)) {
      const s1Data = JSON.parse(fs.readFileSync(s1File, 'utf8'));
      const list1 = s1Data.directive || s1Data.directives;
      const d6Index = list1 ? list1.findIndex(d => d.id === 6) : -1;
      if (d6Index !== -1) {
        list1[d6Index] = JSON.parse(JSON.stringify(refD6));
        fs.writeFileSync(s1File, JSON.stringify(s1Data, null, 2) + '\n', 'utf8');
        console.log(`projet1 : ${s1File} mis à jour pour directive 6.`);
      }
    }

    // 2. directives/enjeux/s2/s2d6.json
    const enjeuxSrc = path.join(p2, 'directives/enjeux/s2/s2d6.json');
    const enjeuxDest = path.join(p1, 'directives/enjeux/s2/s2d6.json');
    fs.mkdirSync(path.dirname(enjeuxDest), { recursive: true });
    fs.copyFileSync(enjeuxSrc, enjeuxDest);
    console.log(`projet1 : ${enjeuxDest} copié.`);

    // 3. directives/fiches-acteurs/s2/d6/*
    const faDirSrc = path.join(p2, 'directives/fiches-acteurs/s2/d6');
    const faDirDest = path.join(p1, 'directives/fiches-acteurs/s2/d6');
    fs.mkdirSync(faDirDest, { recursive: true });
    const files = [
      'com_s2-d6.json',
      'cou_s2-d6.json',
      'par_s2-d6.json',
      'lob_s2-d6.json',
      's2-d6.json',
      'stats2d6.json'
    ];
    for (const f of files) {
      const src = path.join(faDirSrc, f);
      const dest = path.join(faDirDest, f);
      fs.copyFileSync(src, dest);
      console.log(`projet1 : ${dest} copié.`);
    }
  }

  console.log('Propagation de S2 D6 terminée avec succès !');
}

propagateS2D6();
