import os

def copier_fichier_simple(datatxt):
    try:
        with open(datatxt, 'r', encoding='utf-8') as f_in, open(datatxt, 'w', encoding='utf-8') as f_out:
            contenu = f_in.read()
            # Remplace une ou plusieurs espaces par un seul antislash
            contenu_modifie = re.sub(r'\s+', r'\\', contenu)
            f_out.write(contenu_modifie)
        print(f"Fichier copié et modifié avec succès : '{datatxt}'")
    except FileNotFoundError:
        print(f"Erreur : Le fichier '{datatxt}' n'a pas été trouvé.")
    except Exception as e:
        print(f"Une erreur est survenue : {e}")

# Exemple d'utilisation :
# Créez un fichier 'original.txt' avec du texte et des espaces multiples.
# Par exemple: 'Bonjour  le   monde !'

copier_fichier_simple('original.txt', 'modifie.txt')

