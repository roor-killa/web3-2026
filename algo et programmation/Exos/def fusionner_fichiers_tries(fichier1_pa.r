def fusionner_fichiers_tries(fichier1_path, fichier2_path, fichier_sortie_path):
    with open(fichier1_path, 'r') as f1, \
         open(fichier2_path, 'r') as f2, \
         open(fichier_sortie_path, 'w') as fs:

        # Lire la première ligne de chaque fichier
        ligne1 = f1.readline()
        ligne2 = f2.readline()

        # Boucler tant qu'il y a des lignes dans les deux fichiers
        while ligne1 and ligne2:
            # Convertir les lignes en entiers pour la comparaison
            val1 = int(ligne1.strip())
            val2 = int(ligne2.strip())

            if val1 <= val2:
                # Écrire la valeur du premier fichier
                fs.write(ligne1)
                # Lire la prochaine ligne du premier fichier
                ligne1 = f1.readline()
            else:
                # Écrire la valeur du second fichier
                fs.write(ligne2)
                # Lire la prochaine ligne du second fichier
                ligne2 = f2.readline()

        # Écrire les lignes restantes du premier fichier (s'il y en a)
        while ligne1:
            fs.write(ligne1)
            ligne1 = f1.readline()

        # Écrire les lignes restantes du second fichier (s'il y en a)
        while ligne2:
            fs.write(ligne2)
            ligne2 = f2.readline()

# Pour utiliser cette fonction, vous auriez besoin de créer deux fichiers texte
# par exemple, 'entree1.txt' et 'entree2.txt', contenant des nombres triés,
# un par ligne. Ensuite, appelez la fonction comme suit :
# fusionner_fichiers_tries('entree1.txt', 'entree2.txt', 'sortie_fusionnee.txt')
