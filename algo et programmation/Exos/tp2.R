# ---------------------------------------------------------
# ANALYSE DES ENQUETES DE SATISFACTION
# ---------------------------------------------------------

# 1. Installation et chargement des bibliothèques nécessaires
if(!require(tidyverse)) install.packages("tidyverse")
library(tidyverse)

# 2. Importation des données
# Remplacez "votre_fichier.csv" par le nom de votre fichier réel
# df <- read.csv("votre_fichier.csv", sep = ";", dec = ",")

# Création d'un jeu de données fictif pour l'exercice
set.seed(42)
df <- data.frame(
  Service = rep(c("SAV", "Vente", "Support", "Logistique"), each = 25),
  Note = c(rnorm(25, 6, 1), rnorm(25, 8, 0.5), rnorm(25, 7, 1), rnorm(25, 5, 1.5)),
  Taux_Satisfaction = c(runif(25, 50, 70), runif(25, 80, 95), runif(25, 65, 80), runif(25, 40, 65))
)

# 3. Note moyenne et Taux de satisfaction moyen
moyennes_globales <- df %>%
  summarise(
    Note_Moyenne = mean(Note),
    Taux_Moyen = mean(Taux_Satisfaction)
  )
print(moyennes_globales)

# 4. Tableau croisé dynamique (Regroupement par Service)
tableau_service <- df %>%
  group_by(Service) %>%
  summarise(
    Effectif = n(),
    Note_Moyenne = mean(Note),
    Taux_Moyen = mean(Taux_Satisfaction)
  )
print(tableau_service)

# 5. Visualisation graphique (Nuage de points + Régression + Couleurs)
ggplot(df, aes(x = Note, y = Taux_Satisfaction, color = Service)) +
  geom_point(size = 3, alpha = 0.7) +                  # Nuage de points
  geom_smooth(method = "lm", aes(group = 1),           # Ligne de régression globale
              color = "black", linetype = "dashed") +
  labs(title = "Lien entre Note et Taux de Satisfaction",
       subtitle = "Analyse par type de service",
       x = "Note (sur 10)",
       y = "Taux de Satisfaction (%)") +
  theme_minimal()

# 6. Étude de la régression linéaire
modele <- lm(Taux_Satisfaction ~ Note, data = df)
summary(modele)
