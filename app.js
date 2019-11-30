// Khaled Tetbirt - 20161653
// Ce programme sert a justifier un texte
// selon le nombre de colonnes desirees.

var fs = require("fs");

var readFile = function (path) {
 return fs.readFileSync(path).toString();
};

var writeFile = function (path, texte) {
 fs.writeFileSync(path, texte);
};

// La fonction ligne sert a lineariser
// un texte s'il est separer en plusieurs
// lignes.

var ligne = function(path) {
    var leTexte = readFile(path);
    return( leTexte.replace(/(\r\n|\n|\r)/gm, "") );
};

var print = function (x) {
 console.log(x);
};

// La fonction writeOnFile sert a ecrire
// sur un fichier qui existe deja.

var writeOnFile = function (existingPath, texte) {
	writeFile(existingPath, readFile(existingPath) + texte)
};

// La fonction espace sert a compter
// le nombre d'espaces dans un texte.

var espace = function(texte) {
    var compte = 0;
    for(var i = 0; i<texte.length; i++){
        if(texte.charAt(i) == " "){
            compte = compte + 1;
        }
    }
    return(compte);
};

var creerMatrice = function(nbRangees) {
    var resultat = Array(nbRangees);
    for (var i=0; i<nbRangees; i++) {
        resultat[i] = "";
    }
    return resultat;
};

// La fonction rendreMatrice sert a transformer un
// texte en une matrice de plusieurs mots.

var rendreMatrice = function (texte) {
    var a = creerMatrice(espace(texte) + 1);
    var p = 0;
    for(var i = 0; i < texte.length; i++){
        if(i == 0){
            for(var n = i; texte.charAt(n) !== " " && n < texte.length; n++){
                a[p] = a[p] + texte.charAt(n);
            }
            p++;
        }
        else {
            if(texte.charAt(i) == " "){
            	for(var n = i+1; texte.charAt(n) !== " " && n < texte.length; n++){
                	a[p] = a[p] + texte.charAt(n);
            	}
            	p++;
            }
        }
    }
    return(a);
};

// La fonction justifierPre sert uniquement a preparer le
// terrain, elle divise le texte en plusieurs lignes
// contenant le maximum de mots possible selon le nombre
// de colonnes.

var justifierPre = function (path, newPath, nbColonnes) {
	var nouveauTexte = writeFile(newPath, "");
    var mots = rendreMatrice(ligne(path));
    var tempo = "";
    for(var i = 0; i < mots.length + 1; i++) {
        if(i == (mots.length)) {
            writeOnFile(newPath, tempo);
        }
        else {
            if(tempo == ""){
                tempo = tempo + mots[i];
            }
            else{
                if( (tempo + " " + mots[i]).length <= nbColonnes ){
                    tempo = tempo + " " + mots[i];
                }
                else {
                    tempo = tempo + "\n";
                    writeOnFile(newPath, tempo);
                    tempo = "";
                    i--;
                }
            }
        }
    }
};

// La fonction creerEspaces cree des chaines d'espaces
// sous forme de texte, selon le nombre d'espaces voulus.

var creerEspaces = function (nbEspaces) {
    var mat = creerMatrice(nbEspaces);
    for(var i = 0; i < mat.length; i++) {
        mat[i] = " ";
    }
    return(mat.join(""));
};

// La fonction espacesSupp indique le nombre d'espaces 
// que l'on doit rajouter a une ligne afin qu'elle soit
// justifiee.

var espacesSupp = function (ligneTexte, nbColonnes) {
    
    // infoEspaces est une variables qui donne les espaces entre
    // chaque mots d'une ligne. Ex.: [4,4,5] sont les valeurs des 
    // espaces entre 4 mots d'une certaine ligne.
    
    var infoEspaces = creerMatrice(espace(ligneTexte));
    var nbEspacesTot = (nbColonnes - (ligneTexte.length - espace(ligneTexte)))
    for(var i = 0; i < infoEspaces.length; i++) {
        if(i < infoEspaces.length - 1) {
            infoEspaces[i] = Math.floor(nbEspacesTot/espace(ligneTexte));
        }
        else {
            infoEspaces[i] = nbEspacesTot - (espace(ligneTexte) - 1)*(Math.floor(nbEspacesTot/espace(ligneTexte)));
        }
    }
    return(infoEspaces);
}

// La fonction principale est justifierFichier, elle s'occupe 
// d'ecrire le fichier final (newPath2) en ajoutant les espaces
// entre les mots des lignes du fichier texte (newPath1).

var justifierFichier = function(path, newPath1, newPath2, nbColonnes) {
    justifierPre(path, newPath1, nbColonnes);
    writeFile(newPath2, "");
    var arrayOfLines = readFile(newPath1).split("\n");
    for(var m = 0; m < arrayOfLines.length; m ++) {
        arrayOfLines[m] = arrayOfLines[m].split(" ")
    }
    for(var i = 0; i < arrayOfLines.length; i++) {
        if(arrayOfLines[i].join(" ") == nbColonnes) {
            writeOnFile(newPath2, arrayOfLines[i] + "\n")
        } 
        else{
            for(var n = 0; n < arrayOfLines[i].length; n++) {
                if(n==0) {
                    writeOnFile(newPath2, arrayOfLines[i][n]);
                }
                else {
                    writeOnFile(newPath2,(creerEspaces((espacesSupp(arrayOfLines[i].join(" "), nbColonnes)[n-1])) + arrayOfLines[i][n]));
                }
            }
            writeOnFile(newPath2, "\n")
        }
    }
};

var assert = require('assert');

var testsUnitaires = function() {
    
    assert(espace("Bonjour mes amis.") == 2);
    assert(espace("Bonjour") == 0);
    assert(espace("Bonjour-mes9amis") == 0);
    
    assert(rendreMatrice("Bonjour mes amis.")[0] == "Bonjour");
    assert(rendreMatrice("Bonjour mes amis.")[1] == "mes");
    assert(rendreMatrice("Bonjour mes amis.")[2] == "amis.");
    assert(rendreMatrice("Bonjourmesamis.") == 'Bonjourmesamis.');
    assert(rendreMatrice("Bonjou-mes9amis.") == 'Bonjou-mes9amis.');
    
    assert(creerEspaces(1) ==" " );
    assert(creerEspaces(10) == "          " );
    assert(creerEspaces(0) == "");
    
    assert(justifierPre("texte.txt") == "texte2.txt");
    assert(justifierFichier("texte2.txt") == "texteFinale.txt")
};

testsUnitaires();