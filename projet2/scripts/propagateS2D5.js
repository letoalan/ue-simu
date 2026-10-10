import fs from 'fs';
import path from 'path';

export function propagateS2D5() {
  const p2 = path.resolve('projet2/json');
  const p1 = path.resolve('projet1/json');
  const p0 = path.resolve('projet0/json');

  const d5Fields = {
    nom: "Coopération diplomatique européenne",
    orientation: "Missions diplomatiques communes et représentation unique",
    proposition: "Instaurer une représentation unique de l’UE dans les organisations internationales et déployer des missions diplomatiques conjointes.",
    description: "Renforcer la voix de l’UE sur la scène mondiale, améliorer la cohérence des positions européennes et promouvoir la paix et la stabilité.",
    declaration_intention: "La présente directive vise à renforcer la cohérence et l’efficacité de la diplomatie européenne en instaurant une représentation unique dans les organisations internationales et en déployant des missions diplomatiques conjointes. Elle entend promouvoir la paix, la sécurité et les valeurs de l’Union sur la scène mondiale, tout en renforçant la solidarité et l’unité entre États membres. Cette initiative s’inscrit dans la stratégie globale de l’Union en matière de politique étrangère, conformément aux priorités du Conseil européen et du Service européen pour l’action extérieure."
  };

  console.log('--- Propagation S2 D5 vers projet0 ---');
  if (fs.existsSync(p0)) {
    const s0File = path.join(p0, 'scenario2.json');
    if (fs.existsSync(s0File)) {
      const s0Data = JSON.parse(fs.readFileSync(s0File, 'utf8'));
      const list0 = s0Data.directive || s0Data.directives;
      const d5_0 = list0 ? list0.find(d => d.id === 5) : null;
      if (d5_0) {
        Object.assign(d5_0, d5Fields);
        fs.writeFileSync(s0File, JSON.stringify(s0Data, null, 2) + '\n', 'utf8');
        console.log(`projet0 : ${s0File} mis à jour pour directive 5.`);
      }
    }
  }

  console.log('--- Propagation S2 D5 vers projet1 ---');
  if (fs.existsSync(p1)) {
    // 1. scenario2.json
    const s1File = path.join(p1, 'scenario2.json');
    if (fs.existsSync(s1File)) {
      const s1Data = JSON.parse(fs.readFileSync(s1File, 'utf8'));
      const list1 = s1Data.directive || s1Data.directives;
      const d5_1 = list1 ? list1.find(d => d.id === 5) : null;
      if (d5_1) {
        Object.assign(d5_1, d5Fields);
        fs.writeFileSync(s1File, JSON.stringify(s1Data, null, 2) + '\n', 'utf8');
        console.log(`projet1 : ${s1File} mis à jour pour directive 5.`);
      }
    }

    // 2. directives/enjeux/s2/s2d5.json
    const enjeuxSrc = path.join(p2, 'directives/enjeux/s2/s2d5.json');
    const enjeuxDest = path.join(p1, 'directives/enjeux/s2/s2d5.json');
    fs.mkdirSync(path.dirname(enjeuxDest), { recursive: true });
    fs.copyFileSync(enjeuxSrc, enjeuxDest);
    console.log(`projet1 : ${enjeuxDest} copié.`);

    // 3. directives/fiches-acteurs/s2/d5/*
    const faDirSrc = path.join(p2, 'directives/fiches-acteurs/s2/d5');
    const faDirDest = path.join(p1, 'directives/fiches-acteurs/s2/d5');
    fs.mkdirSync(faDirDest, { recursive: true });
    const files = [
      'com_s2-d5.json',
      'cou_s2-d5.json',
      'par_s2-d5.json',
      'lob_s2-d5.json',
      's2-d5.json',
      'stats2d5.json'
    ];
    for (const f of files) {
      const src = path.join(faDirSrc, f);
      const dest = path.join(faDirDest, f);
      fs.copyFileSync(src, dest);
      console.log(`projet1 : ${dest} copié.`);
    }
  }

  console.log('Propagation de S2 D5 terminée avec succès !');
}

propagateS2D5();
