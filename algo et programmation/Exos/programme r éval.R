# exo 1
programmer <- read.csv("programmer.csv", sep = ",", header = TRUE, encoding = "UTF-8")

#exo 2
datanet <- na.omit(eolien)

# exo 3
datanet <- datanet[, c("id_aerogenerateur", "nom_eolienne", "code_reg", "puissance_mw", 
                       "hauteur_totale", "hauteur_mat_nacelle", "diametre_rotor", 
                       "periode_allumage", "type_feu", "constructeur", 
                       "reference_modele", "etat_parc", "statut_parc")]

# exo 4
colnames(datanet) <- c("Identification", "Nom", "Code_region", "Puissance", 
                       "Hauteur", "Hauteur_nacelle", "Diametre_rotor", 
                       "Periode_allumage", "Type_feu", "Constructeur", 
                       "Modele", "Etat", "Statut")

# exo 5
datanet[sapply(datanet, is.character)] <- lapply(datanet[sapply(datanet, is.character)], as.factor)

# exo 6
datanet$Code_region <- as.factor(datanet$Code_region)

# exo 7
datanet <- datanet[!(tolower(datanet$Constructeur) %in% c("inconnu", "non déterminé", "non choisi")), ]

# exo 8
datanet$Constructeur <- as.factor(tolower(as.character(datanet$Constructeur)))

# exo 9
summary(datanet)

# exo 10
par(mfrow=c(2,2)) # Pour voir plusieurs graphiques en même temps
hist(datanet$Puissance, main="Puissance", col="lightblue")
hist(datanet$Hauteur, main="Hauteur Totale", col="lightgreen")
hist(datanet$Hauteur_nacelle, main="Hauteur Nacelle", col="salmon")

# exo 11
par(mfrow=c(1,1))
boxplot(datanet$Puissance, datanet$Hauteur, datanet$Hauteur_nacelle, 
        names=c("Puissance", "Hauteur", "H. Nacelle"), 
        main="Boxplot des dimensions", col="orange")

# exo 12
table(datanet$Code_region)

# exo 13
table(datanet$Constructeur, datanet$Periode_allumage)

#exo 14
table(datanet$Constructeur, datanet$Type_feu)

# exo 15
View(datanet)
