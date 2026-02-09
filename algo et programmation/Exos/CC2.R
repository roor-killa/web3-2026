# =========================================================================
# INSTALLATION DES PACKAGES (si nécessaire)
# =========================================================================
# install.packages(c("dplyr", "readr", "shiny", "ggplot2", "DT"))

library(dplyr)
library(readr)
library(shiny)
library(ggplot2)
library(DT)

# =========================================================================
# PARTIE 1 : MANIPULATION DES DONNÉES (DPLYR)
# =========================================================================

# 1. Importer le fichier et convertir au format tibble
# Note : Assurez-vous que le fichier est dans votre dossier de travail RStudio
df <- read_csv("eolien_terrestre_national.csv") %>% as_tibble()

# 2. Enchaînement des opérations avec dplyr
df_final <- df %>%
  # Supprimer les colonnes id_aerogenerateur, nom_commune, code_reg, code_dept
  select(-id_aerogenerateur, -nom_commune, -code_reg, -code_dept) %>%
  
  # Passer en premières colonnes : nom_eolienne, constructeur, reference_modele, type_feu, periode_allumage
  select(nom_eolienne, constructeur, reference_modele, type_feu, periode_allumage, everything()) %>%
  
  # Trier le tableau selon la puissance en mw dans l'ordre décroissant
  # On utilise le nom de colonne standardisé 'puissance_mw'
  arrange(desc(puissance_mw)) %>%
  
  # Recoder la variable periode_allumage en affectant à chaque modalité un chiffre
  mutate(periode_allumage = case_when(
    periode_allumage == "Continue" ~ "1",
    periode_allumage == "Crépusculaire" ~ "2",
    periode_allumage == "Nocturne" ~ "3",
    TRUE ~ "0"
  )) %>%
  
  # Sélectionner les 50 premières lignes
  slice(1:50)

# 3. Utiliser la fonction filter (sélection spécifique)
# Puissance entre 2,1 et 2,8 ET hauteur de nacelle < 150
df_filtre <- df_final %>%
  filter(puissance_mw >= 2.1 & puissance_mw <= 2.8, 
         hauteur_nacelle < 150)


# =========================================================================
# PARTIE 2 : APPLICATION SHINY
# =========================================================================

# --- Interface Utilisateur (UI) ---
ui <- fluidPage(
  titlePanel("Analyse Graphique du Parc Éolien"),
  
  sidebarLayout(
    sidebarPanel(
      # Entrée : Choisir la variable avec un bouton radio
      radioButtons("variable", "Variable à représenter :",
                   choices = c("Puissance (MW)" = "puissance_mw", 
                               "Hauteur Nacelle (m)" = "hauteur_nacelle")),
      
      # Entrée : Ajouter un titre pour l'histogramme
      textInput("titre_graph", "Titre de l'histogramme :", value = "Distribution des données"),
      
      # Entrée : Changer la couleur de l'histogramme
      selectInput("couleur", "Couleur des barres :",
                  choices = c("Bleu" = "skyblue", "Vert" = "seagreen", "Rouge" = "indianred", "Orange" = "orange")),
      
      hr(),
      # Entrée : Bouton pour exporter le graphe
      downloadButton("export_plot", "Exporter le graphique")
    ),
    
    mainPanel(
      tabsetPanel(
        tabPanel("Graphique", 
                 plotOutput("mon_plot"),
                 # Texte sous l'histogramme indiquant le nombre de classes
                 uiOutput("texte_classes")),
        
        tabPanel("Résumé Statistique", 
                 # Sortie : Visualiser le résumé statistique
                 verbatimTextOutput("stats_summary")),
        
        tabPanel("Données", 
                 # Sortie : Visualiser le jeu de données entier
                 DT::dataTableOutput("table_donnees"))
      )
    )
  )
)

# --- Logique Serveur ---
server <- function(input, output) {
  
  # Fonction réactive pour créer le graphique (partagée pour l'affichage et l'export)
  create_plot <- reactive({
    ggplot(df_final, aes_string(x = input$variable)) +
      geom_histogram(fill = input$couleur, color = "white", bins = 20) +
      labs(title = input$titre_graph, x = input$variable, y = "Fréquence") +
      theme_minimal()
  })
  
  # Affichage de l'histogramme
  output$mon_plot <- renderPlot({
    create_plot()
  })
  
  # Affichage du texte indiquant le nombre de classes (fixé ici à 20)
  output$texte_classes <- renderUI({
    tags$p(style = "color: grey; font-style: italic;", 
           "L'histogramme ci-dessus est représenté avec 20 classes.")
  })
  
  # Affichage du résumé statistique
  output$stats_summary <- renderPrint({
    summary(df_final[[input$variable]])
  })
  
  # Affichage du jeu de données entier (via DT pour une meilleure ergonomie)
  output$table_donnees <- DT::renderDataTable({
    df_final
  })
  
  # Gestion de l'exportation du graphique
  output$export_plot <- downloadHandler(
    filename = function() { paste("graphique_eolien_", Sys.Date(), ".png", sep="") },
    content = function(file) {
      ggsave(file, plot = create_plot(), device = "png", width = 8, height = 6)
    }
  )
}

# --- Lancement de l'application ---
shinyApp(ui = ui, server = server)
