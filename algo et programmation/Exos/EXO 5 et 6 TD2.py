import os

def liste_fichiers(path, ext):
    fichiers_trouves = []

    for element in os.listdir(path):
        chemin_complet = os.path.join(path, element)

        if os.path.isfile(chemin_complet):
            _, extension = os.path.splitext(element)
            if extension == ext:
                fichiers_trouves.append(chemin_complet)
        else:
            fichiers_trouves.extend(liste_fichiers(chemin_complet, ext))

    return fichiers_trouves
