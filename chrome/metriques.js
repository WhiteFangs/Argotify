 function sansAccents(s) {
    var r = s.toLowerCase();
    r = r.replace(/[àáâãäå]/g, "a");
    r = r.replace(/[èéêë]/g, "e");
    r = r.replace(/[ìíîï]/g, "i");
    r = r.replace(/[òóôõö]/g, "o");
    r = r.replace(/[ùúûü]/g, "u");
    r = r.replace(/[ýÿ]/g, "y");
    return r;
};

// Comptage et découpage d'un mot en syllabes avec les possibilités de diérèses gérées par la variable max
function syllabify(s) {
    if (s.toLowerCase() == "pays") // Exception pour ce mot ingérable autrement
        return ({ syllabes: ["pa", "ys"], nb: 2, max: 2 });
    if (!s.trim().match(/[a-zA-Z]/g))
        return { syllabes: [], nb: 0, max: 0 };
    var consonnes = ['b', 'B', 'c', 'C', 'ç', 'Ç', 'd', 'D', 'f', 'F', 'g', 'G', 'h', 'H', 'j', 'J', 'k', 'K', 'l', 'L', 'm', 'M', 'n', 'N', 'ñ', 'Ñ', 'p', 'P', 'q', 'Q', 'r', 'R', 's', 'S', 't', 'T', 'v', 'V', 'w', 'W', 'x', 'X', 'y', 'Y', 'z', 'Z', '-'],
    voyellesFortes = ['a', 'A', 'á', 'Á', 'à', 'À', 'â', 'Â', 'e', 'E', 'é', 'É', 'è', 'È', 'ê', 'Ê', 'í', 'Í', 'o', 'ó', 'O', 'Ó', 'ô', 'Ô', 'ú', 'Ú'],
    voyellesFaibles = ['i', 'I', 'u', 'U', 'ü', 'Ü', 'ï', 'Ï', 'î', 'Î', 'û', 'Û'],
    voyelles = voyellesFortes.concat(voyellesFaibles, ['y', 'Y']),
    nb, coupure, voy, j = 0, max = 0, n = s.length - 1, i = 0, syllabes = [];
    while (i <= n) {
        coupure = 0; // Ne coupe pas
        if (consonnes.indexOf(s.charAt(i)) > -1) {
            if (voyelles.indexOf(s.charAt(i + 1)) > -1) {
                if (s.toLowerCase().charAt(i) == 'y') // diérèse possible du y utilisé comme consonne
                    max++;
                if (voyelles.indexOf(s.charAt(i - 1)) > -1)
                    coupure = 1;
            } else if ((['s', 'S'].indexOf(s.charAt(i)) > -1) && (['n', 'N'].indexOf(s.charAt(i - 1)) > -1) && (consonnes.indexOf(s.charAt(i + 1)) > -1)) {
                coupure = 2;
            } else if ((consonnes.indexOf(s.charAt(i + 1)) > -1) && (voyelles.indexOf(s.charAt(i - 1)) > -1)) {
                if (['r', 'R'].indexOf(s.charAt(i + 1)) > -1) {
                    coupure = ['b', 'B', 'c', 'C', 'd', 'D', 'f', 'F', 'g', 'G', 'k', 'K', 'p', 'P', 'r', 'R', 't', 'T', 'v', 'V'].indexOf(s.charAt(i)) > -1 ? 1 : 2;
                } else if (['l', 'L'].indexOf(s.charAt(i + 1)) > -1) {
                    coupure = ['b', 'B', 'c', 'C', 'd', 'D', 'f', 'F', 'g', 'G', 'k', 'K', 'l', 'L', 'p', 'P', 't', 'T', 'v', 'V'].indexOf(s.charAt(i)) > -1 ? 1 : 2;
                } else if (['h', 'H'].indexOf(s.charAt(i + 1)) > -1) {
                    coupure = ['c', 'C', 's', 'S', 'p', 'P'].indexOf(s.charAt(i)) > -1 ? 1 : 2;
                } else if ((['t', 'T', 'p', 'P'].indexOf(s.charAt(i + 1)) > -1) && (['s', 'S'].indexOf(s.charAt(i + 2)) > -1)) { // pour des mots comme "verts" ou "corps"
                    coupure = 0;
                } else {
                    coupure = 2;
                }
            }
        } else if (voyellesFortes.indexOf(s.charAt(i)) > -1) {
            if ((voyellesFortes.indexOf(s.charAt(i - 1)) > -1) &&
            (s.substring(i - 2, i).toLowerCase() != 'ge') &&
            (s.substring(i - 1, i + 2).toLowerCase() != 'eau') &&
            (s.substring(i - 1, i + 1).toLowerCase() != 'oe') &&
            ((s.substring(i - 1, i + 2).toLowerCase() != 'ée') && (s.substring(i + 1, i + 2).toLowerCase() != 'ées') && (s.substring(i + 1, i + 4).toLowerCase() != 'éent'))) {
                coupure = 1;
            }
        } else if (voyellesFaibles.indexOf(s.charAt(i)) > -1 && (s.substring(i - 1, i + 1).toLowerCase() != 'qu') && (s.substring(i - 1, i + 1).toLowerCase() != 'gu')) { // Gestion de la diérèse éventuelle, sauf pour les cas avec "qu" / "gu"
            if ((voyelles.indexOf(s.charAt(i + 1)) > -1) &&
            (consonnes.indexOf(s.charAt(i - 1)) > -1) &&
            (consonnes.indexOf(s.charAt(i - 2)) > -1) &&
            (s.substring(i, i + 2).toLowerCase() != 'ui')) { // diérèse obligatoire si deux consonnes avant
                if (s.toLowerCase().charAt(i + 1) == 'y') // diérèse possible du y pour des mots comme "ennuyer" ou "essuyer"
                    max++;
                coupure = 2;
            } else if ((voyelles.indexOf(s.charAt(i + 1)) > -1) &&
                (((s.substring(i + 1, i + 4).toLowerCase() != 'ent') && (s.substring(i + 1, i + 4).toLowerCase() != 'es')) || // Si terminaisons en "-aient" et en "-aie(s)" : pas de diérèse possible
                 (s.substring(i, i + 2).toLowerCase() != 'ui'))) { // Si mot comme "fruit", "bruit", "impuissant", diérèse très rare mais tolérable
                max++;
            }
        }
        if (coupure == 1) {  // Couper ici
            voy = s.substring(j, i);
            syllabes.push(voy);
            j = i;
        } else if (coupure == 2) { // Couper au caractère suivant
            i++;
            voy = s.substring(j, i);
            syllabes.push(voy);
            j = i;
        }
        i++;
    }
    nb = syllabes.length;
    if ((j == n) && (nb > 0) && (consonnes.indexOf(s.charAt(n)) > -1)) { //Dernière lettre
        syllabes[nb - 1] = syllabes[nb - 1] + s.charAt(n);
    } else {
        voy = s.substring(j, n + 1);
        syllabes.push(voy); // Dernière syllabe
        nb++;
    }
    return { syllabes: syllabes, nb: nb, max: nb + max };
};

// Prend un tableau de mots en entrée. Pour chaque mot dans le tableau (vers), applique syllabify avec les règles d'élision du e
function elisioner(mots) {
    var voyelles = ['a', 'A', 'á', 'Á', 'à', 'À', 'â', 'Â', 'e', 'E', 'é', 'É', 'è', 'È', 'ê', 'Ê', 'í', 'Í', 'o', 'ó', 'O', 'Ó', 'ô', 'Ô', 'ú', 'Ú', 'i', 'I', 'u', 'U', 'ü', 'Ü', 'û', 'Û', 'ï', 'Ï', 'î', 'Î'],
    elision = voyelles.concat(['h', 'H']),
    syllabes, nb = 0, max = 0;
    for (var i = 0; i < mots.length; i++) {
        syllabes = syllabify(mots[i]);
        nb += syllabes.nb;
        max += syllabes.max;
        if ((i > 0) &&
        (mots[i - 1].toLowerCase().slice(-1) == 'e') &&
        (elision.indexOf(mots[i].charAt(0)) > -1) &&
        (sansAccents(mots[i - 1].toLowerCase().slice(-2, -1)) != sansAccents(mots[i].charAt(0)))) { // élision du e de fin dans le mot précédent si liaison (MAIS élision interdite si même son, ex: "Thésée excusable")
            nb--;
            if (['h', 'H'].indexOf(mots[i].charAt(0)) < 0)
                max--;
        }
        if ((i == mots.length - 1) &&
        (mots[i].toLowerCase().slice(-1) == 'e' || mots[i].toLowerCase().slice(-2) == 'es' || mots[i].toLowerCase().slice(-3) == 'ent')) { // élision du e en fin de vers
            nb--;
            if (!((voyelles.indexOf(mots[i].toLowerCase().slice(-2, -1)) > -1) && (mots[i].toLowerCase().slice(-1) == 'e')) && // Si finit par une voyelle + "e" : l'élision peut-être évitée en appuyant le e (ex: "patrie")
            !((voyelles.indexOf(mots[i].toLowerCase().slice(-3, -2)) > -1) && (mots[i].toLowerCase().slice(-2) == 'es')) &&
            !((voyelles.indexOf(mots[i].toLowerCase().slice(-4, -3)) > -1) && (mots[i].toLowerCase().slice(-3) == 'ent')) &&
            (mots[i].toLowerCase().slice(-4) != 'ment')) { // Si c'est un adverbe, la syllabe finale est obligatoire donc on ne diminue pas max pour prévenir ces cas
                max--;
            }
        }
    }
    return { nb: nb, max: max };
};

// Compte le nombre de syllabes des vers d'un poème en suivant les règles classiques d'élision
function metrify(s) {
    var s = s.replace(/[\.,…\/#!$%\^&\*;\?:{}=\_`~()]/g, "").replace(/[0-9]/g, '').replace(/\s{2,}/g, " ").replace(/œ/g, "oe").replace(/æ/g, "ae").replace(/\r\n|\r|\n/g, "<br>"),
    vers = s.split("<br>").filter(function (v) { return v !== ''; }),
    mots = [],
    nbsyllabes = [];

    for (var i = 0; i < vers.length; i++) {
        var lesmots = vers[i].split(" ");
        lesmots = lesmots.filter(function (v) { return v !== ''; });
        mots[i] = lesmots; // range les mots dans un tableau différent pour chaque vers
    }
    // Appliquer elisioner au tableau de mots de chaque vers
    for (var k = 0; k < mots.length; k++)
        nbsyllabes[k] = elisioner(mots[k]);
    return { vers: vers, mots: mots, nbsyllabes: nbsyllabes };
};