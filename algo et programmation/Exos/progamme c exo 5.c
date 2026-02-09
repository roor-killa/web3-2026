#include <stdio.h>

#define N_LIGNES 3
#define M_COLONNES 4

void CalculerMoyennes(float M[][M_COLONNES], int N) {
    float somme_totale = 0.0;
    
    printf("\n--- Exercice 5 (C) ---\n");
    printf("Matrice %dx%d :\n", N, M_COLONNES);

    printf("\n* Moyennes par Ligne :\n");
    for (int i = 0; i < N; i++) {
        float somme_ligne = 0.0;
        for (int j = 0; j < M_COLONNES; j++) {
            somme_ligne += M[i][j];
            somme_totale += M[i][j];
        }
        float moyenne_ligne = somme_ligne / M_COLONNES;
        printf("  - Ligne %d: %.2f\n", i, moyenne_ligne);
    }
    printf("\n* Moyennes par Colonne :\n");
    for (int j = 0; j < M_COLONNES; j++) {
        float somme_colonne = 0.0;
        for (int i = 0; i < N; i++) {
            somme_colonne += M[i][j];
        }
        float moyenne_colonne = somme_colonne / N;
        printf("  - Colonne %d: %.2f\n", j, moyenne_colonne);
    }

    int nombre_elements = N * M_COLONNES;
    float moyenne_generale = somme_totale / nombre_elements;
    printf("\n* Moyenne Générale : %.2f\n", moyenne_generale);
}

void test_exercice5() {
    float matrice[N_LIGNES][M_COLONNES] = {
        {1.0, 2.0, 3.0, 4.0},
        {5.0, 6.0, 7.0, 8.0},
        {9.0, 10.0, 11.0, 12.0}
    };
    
    CalculerMoyennes(matrice, N_LIGNES);
}