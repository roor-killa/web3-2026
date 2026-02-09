import csv

with open ("etudiant.csv") , newline="", encoding="utf-8") as fichier:
    lecteur = csv.DictReader(fichier)
    for ligne in lecteur:
        print(ligne["nom"], ligne ["prenom"], ligne ["age"])
        