#include <stdio.h>

int CompterOccurrences(const int T[], int N, int val) {
    int compteur = 0;
    
    for (int i = 0; i < N; i++) {
        if (T[i] == val) {
            compteur++;
        }
    }
    
    return compteur;
}

void test_exercice2() {
    int nombres[] = {10, 25, 10, 8, 42, 25, 10, 10};
    int N = sizeof(nombres) / sizeof(nombres[0]);
    int valeur_cherche = 10;
    
    int result = CompterOccurrences(nombres, N, valeur_cherche);
    
    printf("--- Exercice 2 (C) ---\n");
    printf("Tableau : {10, 25, 10, 8, 42, 25, 10, 10}\n");
    printf("Le nombre d'occurrences de %d est : %d\n", valeur_cherche, result);
}