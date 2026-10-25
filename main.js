const rubriques = [
  { id: "apropos", icone: "avatar", titre: "Qui suis-je ?", sousTitre: "Mon profil" },
  { id: "projets", icone: "terminal", titre: "Mes projets", sousTitre: "Ce que j'ai réalisé" },
  { id: "parcours", icone: "toque", titre: "Mon parcours", sousTitre: "Formation et expériences" },
  { id: "sport", icone: "ballon", titre: "Sport", sousTitre: "Football américain et rugby" },
  { id: "contact", icone: "enveloppe", titre: "Contact", sousTitre: "Me joindre" },
  { id: "competences", icone: "puce", titre: "Compétences", sousTitre: "Avec des preuves" },
  { id: "cyber", icone: "cadenas", titre: "Cybersécurité", sousTitre: "Ce que j'apprends" },
  { id: "jeux", icone: "manette", titre: "Jeux vidéo", sousTitre: "Unity et jeux web" }
];

function retenirRubrique(id) {
  try { sessionStorage.setItem("derniereRubrique", id); } catch (e) {}
}
function lireRubrique() {
  try {
    const id = sessionStorage.getItem("derniereRubrique");
    sessionStorage.removeItem("derniereRubrique");
    return id;
  } catch (e) {
    return null;
  }
}

const lignesDeCode = [
  "const joueur = new Joueur();",
  "for (let i = 0; i < 10; i++)",
  "if (rayon < 50) gameOver();",
  "def main():",
  "print('hello world')",
  "SELECT * FROM etudiants;",
  "git commit -m 'fix'",
  "function update(dt) {",
  "return true;",
  "while (enJeu) {",
  "console.log(score);",
  "import numpy as np",
  "#include <iostream>",
  "std::cout << x;",
  "let vies = 3;",
  "echo $nom;",
  "public void Start()",
  "document.querySelector()",
  "npm install three",
  "x = x + 1",
  "else { pause(); }",
  "ctx.fillRect(0, 0, w, h);",
  "class Brique extends Mesh",
  "socket.emit('move', pos);",
  "session_start();",
  "INSERT INTO panier VALUES"
];

const canvasMatrix = document.getElementById("matrix");
const ctx = canvasMatrix.getContext("2d");
let taille = 16;
let colonnes = [];

function ligneAuHasard() {
  return lignesDeCode[Math.floor(Math.random() * lignesDeCode.length)];
}

function nouvelleColonne(debutEnHaut) {
  return {
    texte: ligneAuHasard(),
    lettre: 0,
    y: debutEnHaut ? -Math.floor(Math.random() * 30) : -Math.floor(Math.random() * (innerHeight / taille)),
    vitesse: 0.4 + Math.random() * 0.6
  };
}

function initMatrix() {
  canvasMatrix.width = innerWidth;
  canvasMatrix.height = innerHeight;
  taille = innerWidth < 600 ? 13 : 16;
  colonnes = [];
  const nb = Math.ceil(innerWidth / taille);
  for (let i = 0; i < nb; i++) {
    colonnes.push(nouvelleColonne(false));
  }
  ctx.fillStyle = "black";
  ctx.fillRect(0, 0, innerWidth, innerHeight);
}

let dernierFrameMatrix = 0;

function dessinerMatrix(temps) {
  requestAnimationFrame(dessinerMatrix);

  if (temps - dernierFrameMatrix < 33) return;
  dernierFrameMatrix = temps;

  ctx.fillStyle = "rgba(0, 0, 0, 0.08)";
  ctx.fillRect(0, 0, innerWidth, innerHeight);
  ctx.font = taille + "px monospace";
  ctx.textBaseline = "top";

  for (let i = 0; i < colonnes.length; i++) {
    const col = colonnes[i];
    if (Math.random() > col.vitesse) continue;

    const x = i * taille;

    if (col.y >= 0) {
      if (col.lettre > 0) {
        const avant = col.texte[col.lettre - 1];
        ctx.fillStyle = "black";
        ctx.fillRect(x, (col.y - 1) * taille, taille, taille);
        ctx.fillStyle = "#12e07a";
        ctx.fillText(avant, x, (col.y - 1) * taille);
      }
      const lettre = col.texte[col.lettre];
      if (lettre && lettre != " ") {
        ctx.fillStyle = "#d6ffe6";
        ctx.fillText(lettre, x, col.y * taille);
      }
      col.lettre++;
    }
    col.y++;

    if (col.lettre >= col.texte.length) {
      col.texte = ligneAuHasard();
      col.lettre = 0;
      col.y += 2 + Math.floor(Math.random() * 6);
    }

    if (col.y * taille > innerHeight) {
      colonnes[i] = nouvelleColonne(true);
    }
  }
}

initMatrix();
requestAnimationFrame(dessinerMatrix);
window.addEventListener("resize", initMatrix);

if (document.getElementById("scene")) {
  lancerMenu();
} else {
  lancerSousPage();
}

function lancerSousPage() {
  const idPage = document.body.dataset.rubrique;
  const num = rubriques.findIndex((r) => r.id == idPage);

  function allerAuMenu(e) {
    if (e) e.preventDefault();
    retenirRubrique(idPage);
    document.body.classList.add("depart");
    setTimeout(() => {
      window.location.href = "../index.html";
    }, 350);
  }

  document.querySelectorAll("a.vers-menu").forEach((a) => {
    a.addEventListener("click", allerAuMenu);
  });

  window.addEventListener("keydown", (e) => {
    if (e.key == "Escape") allerAuMenu();
  });

  const suite = document.querySelector(".suite");
  if (suite && num != -1) {
    const avant = rubriques[(num - 1 + rubriques.length) % rubriques.length];
    const apres = rubriques[(num + 1) % rubriques.length];
    suite.innerHTML =
      '<a href="' + avant.id + '.html">← précédent<b>' + avant.titre + '</b></a>' +
      '<a href="' + apres.id + '.html">suivant →<b>' + apres.titre + '</b></a>';

    suite.querySelectorAll("a").forEach((a) => {
      a.addEventListener("click", (e) => {
        e.preventDefault();
        document.body.classList.add("depart");
        setTimeout(() => {
          window.location.href = a.getAttribute("href");
        }, 350);
      });
    });
  }

  document.querySelectorAll(".video[data-youtube]").forEach(lancerVideo);

  document.querySelectorAll("[data-copier]").forEach((bouton) => {
    bouton.addEventListener("click", () => {
      const texte = bouton.dataset.copier;
      const ancien = bouton.textContent;
      navigator.clipboard.writeText(texte).then(() => {
        bouton.textContent = "copié !";
        setTimeout(() => { bouton.textContent = ancien; }, 1500);
      }).catch(() => {
        bouton.textContent = "sélectionne le texte";
      });
    });
  });

  window.addEventListener("pageshow", () => {
    document.body.classList.remove("depart");
  });
}

function lancerMenu() {

  function majHeure() {
    const d = new Date();
    document.getElementById("heure").textContent =
      String(d.getHours()).padStart(2, "0") + ":" + String(d.getMinutes()).padStart(2, "0");
  }
  majHeure();
  setInterval(majHeure, 10000);

  const canvasScene = document.getElementById("scene");
  const renderer = new THREE.WebGLRenderer({ canvas: canvasScene, antialias: true, alpha: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.75));
  renderer.setClearColor(0x000000, 0);
  renderer.outputEncoding = THREE.sRGBEncoding;

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(42, innerWidth / innerHeight, 0.1, 100);
  const positionDepart = new THREE.Vector3(0, 0, 14);
  const cible = new THREE.Vector3(0, 0, 0);
  camera.position.copy(positionDepart);

  scene.add(new THREE.AmbientLight(0x9affc8, 0.45));

  const lumiere1 = new THREE.DirectionalLight(0xffffff, 0.9);
  lumiere1.position.set(4, 6, 10);
  scene.add(lumiere1);

  const lumiere2 = new THREE.DirectionalLight(0x19ff8c, 0.5);
  lumiere2.position.set(-6, -4, 4);
  scene.add(lumiere2);

  const lumiereSouris = new THREE.PointLight(0x33ff99, 0, 9, 2);
  lumiereSouris.position.set(0, 0, 3);
  scene.add(lumiereSouris);

  const vertNeon = new THREE.MeshStandardMaterial({ color: 0x19ff8c, emissive: 0x00d45e, emissiveIntensity: 0.45, metalness: 0.45, roughness: 0.3 });
  const blanc = new THREE.MeshStandardMaterial({ color: 0xeafff2, emissive: 0xaaffcc, emissiveIntensity: 0.25, roughness: 0.35 });
  const sombre = new THREE.MeshStandardMaterial({ color: 0x0c2418, metalness: 0.7, roughness: 0.35 });
  const ecranNoir = new THREE.MeshBasicMaterial({ color: 0x03200f });
  const traitVert = new THREE.LineBasicMaterial({ color: 0x19ff8c });

  function objet(geometrie, materiau, x = 0, y = 0, z = 0) {
    const m = new THREE.Mesh(geometrie, materiau);
    m.position.set(x, y, z);
    return m;
  }
  function cube(l, h, p, materiau, x, y, z) {
    return objet(new THREE.BoxGeometry(l, h, p), materiau, x, y, z);
  }
  function contour(m) {
    return new THREE.LineSegments(new THREE.EdgesGeometry(m.geometry), traitVert);
  }

  const icones = {};

  icones.avatar = function () {
    const g = new THREE.Group();
    const tete = objet(new THREE.SphereGeometry(0.24, 32, 24), vertNeon, 0, 0.3, 0);
    const corps = objet(new THREE.SphereGeometry(0.42, 32, 16, 0, Math.PI * 2, 0, Math.PI / 2), vertNeon, 0, -0.4, 0);
    corps.scale.set(1, 0.9, 0.7);
    g.add(tete, corps);

    return {
      groupe: g,
      anim(t, survol) {
        tete.position.y = 0.3 + Math.sin(t * 2) * 0.02 * (1 + survol * 2);
      }
    };
  };

  icones.terminal = function () {
    const g = new THREE.Group();
    const cadre = cube(1, 0.7, 0.1, sombre);
    const ecran = objet(new THREE.PlaneGeometry(0.88, 0.58), ecranNoir, 0, 0, 0.051);

    const chevron1 = cube(0.14, 0.035, 0.02, vertNeon, -0.325, 0.14, 0.06);
    chevron1.rotation.z = -0.62;
    const chevron2 = cube(0.14, 0.035, 0.02, vertNeon, -0.325, 0.06, 0.06);
    chevron2.rotation.z = 0.62;
    const curseur = cube(0.11, 0.03, 0.02, blanc, -0.16, 0.04, 0.06);

    const lignes = [];
    const largeurs = [0.5, 0.32, 0.42];
    for (let i = 0; i < 3; i++) {
      const l = cube(largeurs[i], 0.025, 0.015, vertNeon, -0.38 + largeurs[i] / 2, -0.07 - i * 0.08, 0.06);
      lignes.push(l);
      g.add(l);
    }

    const pied = cube(0.08, 0.14, 0.06, sombre, 0, -0.42, 0);
    const socle = cube(0.42, 0.04, 0.22, sombre, 0, -0.5, 0);
    g.add(cadre, contour(cadre), ecran, chevron1, chevron2, curseur, pied, socle);

    return {
      groupe: g,
      anim(t, survol) {
        curseur.visible = Math.floor(t * (2 + survol * 4)) % 2 == 0;
        for (let i = 0; i < lignes.length; i++) {
          lignes[i].scale.x = 0.6 + 0.4 * Math.abs(Math.sin(t + i));
        }
      }
    };
  };

  icones.toque = function () {
    const g = new THREE.Group();
    const dessus = new THREE.Group();
    dessus.add(cube(0.95, 0.05, 0.95, vertNeon, 0, 0.12, 0));
    dessus.add(objet(new THREE.SphereGeometry(0.045, 16, 12), blanc, 0, 0.16, 0));
    dessus.add(cube(0.475, 0.014, 0.014, blanc, 0.2375, 0.152, 0));

    const pompon = new THREE.Group();
    pompon.position.set(0.475, 0.15, 0);
    pompon.add(cube(0.014, 0.28, 0.014, blanc, 0, -0.14, 0));
    pompon.add(objet(new THREE.CylinderGeometry(0.035, 0.06, 0.12, 12), blanc, 0, -0.32, 0));
    dessus.add(pompon);
    dessus.rotation.y = Math.PI / 4;

    const base = objet(new THREE.CylinderGeometry(0.3, 0.34, 0.28, 32), sombre, 0, -0.04, 0);
    g.add(dessus, base);
    g.rotation.x = 0.45;

    return {
      groupe: g,
      anim(t, survol) {
        pompon.rotation.z = Math.sin(t * 3) * 0.18 * (0.4 + survol * 1.6);
      }
    };
  };

  icones.ballon = function () {
    const g = new THREE.Group();
    const ballon = new THREE.Group();

    const forme = objet(new THREE.SphereGeometry(0.32, 40, 24), vertNeon);
    forme.scale.set(1.55, 1, 1);
    ballon.add(forme);

    const bande = new THREE.TorusGeometry(0.245, 0.014, 8, 48);
    const b1 = objet(bande, blanc, -0.33, 0, 0);
    const b2 = objet(bande, blanc, 0.33, 0, 0);
    b1.rotation.y = Math.PI / 2;
    b2.rotation.y = Math.PI / 2;
    ballon.add(b1, b2);

    ballon.add(cube(0.38, 0.03, 0.03, blanc, 0, 0, 0.32));
    for (const x of [-0.13, -0.045, 0.045, 0.13]) {
      ballon.add(cube(0.025, 0.1, 0.03, blanc, x, 0, 0.32));
    }

    g.add(ballon);
    g.rotation.z = 0.45;

    return {
      groupe: g,
      anim(t, survol) {
        ballon.rotation.x = Math.sin(t * 0.9) * 0.6 + survol * t * 6;
      }
    };
  };

  icones.enveloppe = function () {
    const g = new THREE.Group();

    const dos = cube(1, 0.64, 0.03, sombre, 0, 0, -0.04);

    const lettre = new THREE.Group();
    lettre.add(cube(0.86, 0.56, 0.01, blanc));
    for (let i = 0; i < 3; i++) {
      lettre.add(cube(i == 2 ? 0.34 : 0.6, 0.025, 0.004, sombre, i == 2 ? -0.13 : 0, 0.17 - i * 0.07, 0.007));
    }

    const formePoche = new THREE.Shape();
    formePoche.moveTo(-0.5, -0.32);
    formePoche.lineTo(0.5, -0.32);
    formePoche.lineTo(0.5, 0.32);
    formePoche.lineTo(0, -0.02);
    formePoche.lineTo(-0.5, 0.32);
    formePoche.closePath();
    const geoPoche = new THREE.ExtrudeGeometry(formePoche, { depth: 0.02, bevelEnabled: false });
    const poche = objet(geoPoche, sombre, 0, 0, 0.015);
    const bordPoche = new THREE.LineSegments(new THREE.EdgesGeometry(geoPoche), traitVert);
    bordPoche.position.z = 0.015;

    const triangle = new THREE.Shape();
    triangle.moveTo(-0.5, 0);
    triangle.lineTo(0.5, 0);
    triangle.lineTo(0, -0.4);
    triangle.closePath();
    const rabat = new THREE.Group();
    rabat.position.set(0, 0.32, 0.04);
    rabat.add(objet(new THREE.ExtrudeGeometry(triangle, { depth: 0.015, bevelEnabled: false }), vertNeon));

    g.add(dos, contour(dos), lettre, poche, bordPoche, rabat);

    return {
      groupe: g,
      anim(t, survol) {
        const ouverture = Math.min(1, survol * 2);
        const sortie = Math.max(0, (survol - 0.45) / 0.55);
        rabat.rotation.x = ouverture * 2.8;
        lettre.position.y = sortie * 0.36;
      }
    };
  };

  icones.puce = function () {
    const g = new THREE.Group();
    const matCoeur = vertNeon.clone();
    g.add(cube(0.66, 0.66, 0.1, sombre));
    g.add(cube(0.34, 0.34, 0.06, matCoeur, 0, 0, 0.07));

    const patteV = new THREE.BoxGeometry(0.06, 0.12, 0.04);
    const patteH = new THREE.BoxGeometry(0.12, 0.06, 0.04);
    for (const p of [-0.21, -0.07, 0.07, 0.21]) {
      g.add(objet(patteV, vertNeon, p, 0.39, 0));
      g.add(objet(patteV, vertNeon, p, -0.39, 0));
      g.add(objet(patteH, vertNeon, 0.39, p, 0));
      g.add(objet(patteH, vertNeon, -0.39, p, 0));
    }

    return {
      groupe: g,
      anim(t, survol) {
        matCoeur.emissiveIntensity = 0.35 + (0.25 + survol * 0.6) * (0.5 + 0.5 * Math.sin(t * 4));
      }
    };
  };

  icones.cadenas = function () {
    const g = new THREE.Group();
    g.add(cube(0.66, 0.5, 0.24, vertNeon, 0, -0.15, 0));
    const anse = objet(new THREE.TorusGeometry(0.21, 0.055, 12, 32, Math.PI), blanc, 0, 0.1, 0);
    const trou = objet(new THREE.CylinderGeometry(0.06, 0.06, 0.02, 20), sombre, 0, -0.1, 0.125);
    trou.rotation.x = Math.PI / 2;
    g.add(anse, trou, cube(0.04, 0.12, 0.02, sombre, 0, -0.19, 0.125));

    return {
      groupe: g,
      anim(t, survol) {
        anse.position.y = 0.1 + survol * 0.16;
        anse.rotation.y = survol * 0.5;
      }
    };
  };

  icones.manette = function () {
    const g = new THREE.Group();
    g.add(cube(0.62, 0.32, 0.18, vertNeon));
    for (const x of [-0.32, 0.32]) {
      const poignee = objet(new THREE.SphereGeometry(0.2, 24, 16), vertNeon, x, -0.05, 0);
      poignee.scale.set(1, 1, 0.55);
      g.add(poignee);
    }
    g.add(cube(0.16, 0.05, 0.03, sombre, -0.3, 0, 0.125));
    g.add(cube(0.05, 0.16, 0.03, sombre, -0.3, 0, 0.125));

    const boutons = [];
    const geoBouton = new THREE.SphereGeometry(0.035, 12, 10);
    for (const [dx, dy] of [[0, 0.06], [0.06, 0], [0, -0.06], [-0.06, 0]]) {
      const b = objet(geoBouton, blanc, 0.3 + dx, dy, 0.125);
      boutons.push(b);
      g.add(b);
    }

    return {
      groupe: g,
      anim(t, survol) {
        boutons.forEach((b, i) => {
          b.scale.setScalar(1 + (0.15 + survol * 0.5) * Math.max(0, Math.sin(t * 5 - i * 1.3)));
        });
      }
    };
  };

  const LARGEUR = 2.4;
  const HAUTEUR = 1.7;
  const ESPACE = 0.4;
  const BISEAU = 0.06;

  function rectangleArrondi(l, h, r) {
    const s = new THREE.Shape();
    const x = -l / 2, y = -h / 2;
    s.moveTo(x + r, y);
    s.lineTo(x + l - r, y);
    s.quadraticCurveTo(x + l, y, x + l, y + r);
    s.lineTo(x + l, y + h - r);
    s.quadraticCurveTo(x + l, y + h, x + l - r, y + h);
    s.lineTo(x + r, y + h);
    s.quadraticCurveTo(x, y + h, x, y + h - r);
    s.lineTo(x, y + r);
    s.quadraticCurveTo(x, y, x + r, y);
    return s;
  }

  const formeBrique = rectangleArrondi(LARGEUR - BISEAU * 2, HAUTEUR - BISEAU * 2, 0.28);
  const geoBrique = new THREE.ExtrudeGeometry(formeBrique, {
    depth: 0.22,
    bevelEnabled: true,
    bevelThickness: BISEAU,
    bevelSize: BISEAU,
    bevelSegments: 4,
    curveSegments: 10
  });
  geoBrique.center();
  geoBrique.computeBoundingBox();
  const DEVANT = geoBrique.boundingBox.max.z;

  const geoContour = new THREE.BufferGeometry().setFromPoints(formeBrique.getPoints(14));

  const canvasHalo = document.createElement("canvas");
  canvasHalo.width = 128;
  canvasHalo.height = 128;
  const ctxHalo = canvasHalo.getContext("2d");
  const degrade = ctxHalo.createRadialGradient(64, 64, 4, 64, 64, 64);
  degrade.addColorStop(0, "rgba(40,255,150,0.9)");
  degrade.addColorStop(0.45, "rgba(25,255,140,0.25)");
  degrade.addColorStop(1, "rgba(0,0,0,0)");
  ctxHalo.fillStyle = degrade;
  ctxHalo.fillRect(0, 0, 128, 128);
  const textureHalo = new THREE.CanvasTexture(canvasHalo);
  const geoHalo = new THREE.PlaneGeometry(LARGEUR * 1.7, HAUTEUR * 1.9);

  const grille = new THREE.Group();
  scene.add(grille);

  const briques = [];
  const meshesCliquables = [];

  for (let i = 0; i < rubriques.length; i++) {
    const groupe = new THREE.Group();

    const matBrique = new THREE.MeshPhysicalMaterial({
      color: 0x081a11,
      metalness: 0.25,
      roughness: 0.32,
      clearcoat: 1,
      clearcoatRoughness: 0.18,
      emissive: 0x00ff66,
      emissiveIntensity: 0.02,
      transparent: true,
      opacity: 0.9
    });
    const corps = new THREE.Mesh(geoBrique, matBrique);
    corps.userData.num = i;

    const matContour = new THREE.LineBasicMaterial({ color: 0x19ff8c, transparent: true, opacity: 0.35 });
    const bord = new THREE.LineLoop(geoContour, matContour);
    bord.position.z = DEVANT + 0.003;

    const matHalo = new THREE.MeshBasicMaterial({
      map: textureHalo,
      transparent: true,
      opacity: 0,
      blending: THREE.AdditiveBlending,
      depthWrite: false
    });
    const halo = new THREE.Mesh(geoHalo, matHalo);
    halo.position.z = -0.3;

    const icone = icones[rubriques[i].icone]();
    const supportIcone = new THREE.Group();
    supportIcone.position.z = DEVANT + 0.42;
    supportIcone.add(icone.groupe);

    groupe.add(halo, corps, bord, supportIcone);
    grille.add(groupe);
    meshesCliquables.push(corps);

    briques.push({
      rubrique: rubriques[i],
      groupe, matBrique, matContour, matHalo, supportIcone, icone,
      position: new THREE.Vector3(),
      decalage: Math.random() * Math.PI * 2,
      survol: 0,
      recul: 0,
      incl: new THREE.Vector2(),
      inclVoulue: new THREE.Vector2(),
      apparition: 0,
      retard: 0,
      tour: 0
    });
  }

  let etat = "grille";
  let briqueSurvolee = null;
  let briqueOuverte = null;
  let selectionClavier = 0;
  let modeClavier = false;
  let sourisDansLaPage = false;
  let nbColonnes = 4;

  const souris = new THREE.Vector2(10, 10);
  const raycaster = new THREE.Raycaster();
  const bulle = document.getElementById("bulle");

  function placerBriques() {
    if (!innerWidth || !innerHeight) return;

    const ratio = innerWidth / innerHeight;
    nbColonnes = ratio < 0.85 ? 2 : 4;
    const nbLignes = Math.ceil(briques.length / nbColonnes);

    briques.forEach((b, i) => {
      const col = i % nbColonnes;
      const lig = Math.floor(i / nbColonnes);
      b.position.x = (col - (nbColonnes - 1) / 2) * (LARGEUR + ESPACE);
      b.position.y = ((nbLignes - 1) / 2 - lig) * (HAUTEUR + ESPACE) - 0.15;
    });

    const largeurTotale = nbColonnes * LARGEUR + (nbColonnes - 1) * ESPACE;
    const hauteurTotale = nbLignes * HAUTEUR + (nbLignes - 1) * ESPACE;
    const demiAngle = THREE.MathUtils.degToRad(camera.fov / 2);
    const d1 = (hauteurTotale / 2) / Math.tan(demiAngle);
    const d2 = (largeurTotale / 2) / (Math.tan(demiAngle) * ratio);
    positionDepart.z = Math.max(d1, d2) * 1.2 + 1;

    if (etat == "grille") camera.position.copy(positionDepart);
  }

  function redimensionner() {
    if (!innerWidth || !innerHeight) return;
    renderer.setSize(innerWidth, innerHeight, false);
    camera.aspect = innerWidth / innerHeight;
    camera.updateProjectionMatrix();
    placerBriques();
  }

  const anim = {
    t: 1,
    duree: 1,
    depart: new THREE.Vector3(),
    arrivee: new THREE.Vector3(),
    regardDepart: new THREE.Vector3(),
    regardArrivee: new THREE.Vector3(),
    quandFini: null,
    versAccueil: false
  };

  function lisser(x) {
    return x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2;
  }

  function rebond(x) {
    const c = 1.7;
    return 1 + (c + 1) * Math.pow(x - 1, 3) + c * Math.pow(x - 1, 2);
  }

  function deplacerCamera(versPos, versCible, duree, quandFini) {
    anim.versAccueil = versPos == positionDepart;
    anim.depart.copy(camera.position);
    anim.arrivee.copy(versPos);
    anim.regardDepart.copy(cible);
    anim.regardArrivee.copy(versCible);
    anim.t = 0;
    anim.duree = duree;
    anim.quandFini = quandFini;
  }

  function briqueSous(x, y) {
    raycaster.setFromCamera({ x, y }, camera);
    const touche = raycaster.intersectObjects(meshesCliquables)[0];
    if (!touche) return null;

    const b = briques[touche.object.userData.num];
    const local = b.groupe.worldToLocal(touche.point.clone());
    b.inclVoulue.set(
      THREE.MathUtils.clamp(local.x / (LARGEUR / 2), -1, 1),
      THREE.MathUtils.clamp(local.y / (HAUTEUR / 2), -1, 1)
    );
    return b;
  }

  function ouvrir(b) {
    if (etat != "grille") return;
    etat = "ouverture";
    briqueOuverte = b;
    briqueSurvolee = null;
    bulle.classList.remove("visible");
    canvasScene.style.cursor = "default";

    const pos = b.position.clone();
    deplacerCamera(new THREE.Vector3(pos.x, pos.y, 3.6), pos, 0.9, () => {
      etat = "depart";
      document.body.classList.add("depart");
      setTimeout(() => {
        window.location.href = "pages/" + b.rubrique.id + ".html";
      }, 350);
    });
  }

  function introGrille() {
    briques.forEach((b, i) => {
      b.apparition = 0;
      b.retard = 0.15 + i * 0.07;
    });
    camera.position.copy(positionDepart);
    camera.position.z += 4;
    cible.set(0, 0, 0);
    etat = "retour";
    deplacerCamera(positionDepart, cible.clone(), 1.4, () => {
      etat = "grille";
    });
  }

  function retourDepuis(id) {
    const b = briques.find((x) => x.rubrique.id == id);
    if (!b) {
      introGrille();
      return;
    }

    const pos = b.position;
    camera.position.set(pos.x, pos.y, 3.6);
    cible.copy(pos);

    briques.forEach((x, i) => {
      x.apparition = x == b ? 1 : 0;
      const distance = x.position.distanceTo(pos);
      x.retard = 0.25 + distance * 0.06;
      x.recul = x == b ? 0 : 1;
    });
    b.survol = 1;
    b.tour = -Math.PI * 2;

    etat = "retour";
    briqueOuverte = null;
    deplacerCamera(positionDepart, new THREE.Vector3(0, 0, 0), 1.1, () => {
      etat = "grille";
    });
  }

  window.addEventListener("pageshow", (e) => {
    if (e.persisted && briqueOuverte) {
      document.body.classList.remove("depart");
      const id = briqueOuverte.rubrique.id;
      briqueOuverte = null;
      anim.quandFini = null;
      retourDepuis(id);
    }
  });

  window.addEventListener("pointermove", (e) => {
    souris.x = (e.clientX / innerWidth) * 2 - 1;
    souris.y = -(e.clientY / innerHeight) * 2 + 1;
    sourisDansLaPage = true;
    modeClavier = false;
  });

  document.addEventListener("pointerleave", () => {
    sourisDansLaPage = false;
  });

  canvasScene.addEventListener("click", (e) => {
    if (etat != "grille") return;
    const b = briqueSous((e.clientX / innerWidth) * 2 - 1, -(e.clientY / innerHeight) * 2 + 1);
    if (b) ouvrir(b);
  });

  window.addEventListener("keydown", (e) => {
    if (etat != "grille") return;

    let deplacement = 0;
    if (e.key == "ArrowRight") deplacement = 1;
    if (e.key == "ArrowLeft") deplacement = -1;
    if (e.key == "ArrowDown") deplacement = nbColonnes;
    if (e.key == "ArrowUp") deplacement = -nbColonnes;

    if (deplacement != 0) {
      e.preventDefault();
      if (modeClavier) {
        selectionClavier = Math.min(Math.max(selectionClavier + deplacement, 0), briques.length - 1);
      }
      modeClavier = true;
    } else if (e.key == "Enter" && modeClavier) {
      ouvrir(briques[selectionClavier]);
    }
  });

  const v = new THREE.Vector3();
  function placerBulle(b) {
    if (!b) {
      bulle.classList.remove("visible");
      return;
    }
    bulle.querySelector("b").textContent = b.rubrique.titre;
    bulle.querySelector("small").textContent = b.rubrique.sousTitre;

    v.set(0, HAUTEUR / 2 + 0.15, DEVANT);
    b.groupe.localToWorld(v);
    v.project(camera);
    bulle.style.left = ((v.x + 1) / 2) * innerWidth + "px";
    bulle.style.top = ((1 - v.y) / 2) * innerHeight + "px";
    bulle.classList.add("visible");
  }

  const horloge = new THREE.Clock();
  const lerp = THREE.MathUtils.lerp;

  function boucle() {
    requestAnimationFrame(boucle);

    const dt = Math.min(horloge.getDelta(), 0.05);
    const t = horloge.elapsedTime;
    const k = 1 - Math.pow(0.0001, dt);

    if (etat == "grille") {
      if (modeClavier) briqueSurvolee = briques[selectionClavier];
      else if (sourisDansLaPage) briqueSurvolee = briqueSous(souris.x, souris.y);
      else briqueSurvolee = null;

      canvasScene.style.cursor = (briqueSurvolee && !modeClavier) ? "pointer" : "default";
      placerBulle(briqueSurvolee);
    }

    if (anim.versAccueil) anim.arrivee.copy(positionDepart);

    if (anim.t < 1) {
      anim.t = Math.min(1, anim.t + dt / anim.duree);
      const e = lisser(anim.t);
      camera.position.lerpVectors(anim.depart, anim.arrivee, e);
      cible.lerpVectors(anim.regardDepart, anim.regardArrivee, e);
      if (anim.t == 1 && anim.quandFini) {
        const f = anim.quandFini;
        anim.quandFini = null;
        f();
      }
    }
    if (isNaN(camera.position.x + camera.position.y + camera.position.z)) {
      camera.position.copy(positionDepart);
      cible.set(0, 0, 0);
    }
    camera.lookAt(cible);

    const suitSouris = etat == "grille" && sourisDansLaPage;
    grille.rotation.y = lerp(grille.rotation.y, suitSouris ? souris.x * 0.1 : 0, k * 0.4);
    grille.rotation.x = lerp(grille.rotation.x, suitSouris ? -souris.y * 0.07 : 0, k * 0.4);

    lumiereSouris.intensity = lerp(lumiereSouris.intensity, briqueSurvolee ? 1.4 : 0, k);
    lumiereSouris.position.x = lerp(lumiereSouris.position.x, souris.x * 7, k);
    lumiereSouris.position.y = lerp(lumiereSouris.position.y, souris.y * 4, k);

    for (const b of briques) {
      const estSurvolee = b == briqueSurvolee;
      const estOuverte = b == briqueOuverte;

      if (b.retard > 0) {
        b.retard -= dt;
      } else if (b.apparition < 1) {
        b.apparition = Math.min(1, b.apparition + dt * 2.2);
      }
      const app = rebond(b.apparition);

      b.survol = lerp(b.survol, (estSurvolee || estOuverte) ? 1 : 0, k * 1.2);

      const reculVoulu = (briqueOuverte && !estOuverte) ? 1 : 0;
      b.recul = lerp(b.recul, reculVoulu, k * 0.8);

      b.tour = lerp(b.tour, 0, k * 0.55);

      if (!estSurvolee) b.inclVoulue.multiplyScalar(0.9);
      b.incl.lerp(b.inclVoulue, k);

      const flotte = Math.sin(t * 1.1 + b.decalage) * 0.06;
      const z = b.survol * 0.55 - b.recul * 2.2 - (1 - b.apparition) * 3;
      b.groupe.position.set(b.position.x, b.position.y + flotte, z);
      b.groupe.scale.setScalar(Math.max(0.001, app * (1 + b.survol * 0.08 - b.recul * 0.1)));

      b.groupe.rotation.x = -b.incl.y * 0.28 * b.survol;
      b.groupe.rotation.y = b.incl.x * 0.28 * b.survol + b.tour + (1 - b.apparition) * 0.8;
      if (estOuverte && etat == "ouverture") {
        b.groupe.rotation.y += lisser(anim.t) * Math.PI * 2;
      }

      b.matBrique.emissiveIntensity = 0.02 + b.survol * 0.1;
      b.matBrique.opacity = (0.9 - b.recul * 0.55) * b.apparition;
      b.matContour.opacity = (0.35 + b.survol * 0.65) * (1 - b.recul * 0.7) * b.apparition;
      b.matHalo.opacity = b.survol * 0.75;

      const balance = Math.sin(t * 0.9 + b.decalage) * 0.4;
      b.supportIcone.rotation.y = balance * (1 - b.survol) + Math.sin(t * 3) * 0.25 * b.survol;
      b.supportIcone.rotation.x = Math.sin(t * 0.7 + b.decalage) * 0.12;
      b.supportIcone.position.z = DEVANT + 0.42 + b.survol * 0.3;
      b.supportIcone.scale.setScalar(1 + b.survol * 0.15);
      b.icone.anim(t, b.survol);
    }

    renderer.render(scene, camera);
  }

  window.addEventListener("resize", redimensionner);
  redimensionner();

  const derniere = lireRubrique();
  if (derniere) retourDepuis(derniere);
  else introGrille();

  boucle();
}

function lancerVideo(cadre) {
  const id = cadre.dataset.youtube;
  const lien = "https://www.youtube.com/watch?v=" + id;

  const video = document.createElement("video");
  video.src = cadre.dataset.fichier;
  video.autoplay = true;
  video.muted = true;
  video.loop = true;
  video.playsInline = true;
  video.controls = true;
  video.preload = "auto";

  video.addEventListener("error", () => {
    if (location.protocol == "file:") {
      cadre.classList.add("hors-ligne");
      cadre.innerHTML =
        '<div class="message-video">' +
          '<p>La vidéo n\'a pas été trouvée dans le dossier du portfolio.</p>' +
          '<a class="bouton plein" href="' + lien + '" target="_blank" rel="noopener">Voir sur YouTube ↗</a>' +
        '</div>';
      return;
    }
    const iframe = document.createElement("iframe");
    iframe.src = "https://www.youtube.com/embed/" + id + "?autoplay=1&mute=1&loop=1&playlist=" + id + "&playsinline=1&rel=0";
    iframe.title = cadre.dataset.titre || "Vidéo";
    iframe.allow = "autoplay; encrypted-media; picture-in-picture; fullscreen";
    iframe.referrerPolicy = "strict-origin-when-cross-origin";
    iframe.allowFullscreen = true;
    cadre.innerHTML = "";
    cadre.appendChild(iframe);
  });

  cadre.innerHTML = "";
  cadre.appendChild(video);
  video.play().catch(() => {});
}
