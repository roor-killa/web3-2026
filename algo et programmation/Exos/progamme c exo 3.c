#include <stdio.h>
#include <string.h>

int CompterBigrammes(const char *S, const char *bigramme) {
    if (strlen(bigramme) != 2) {
        return 0;
    }
    
    int compteur = 0;
    int N = strlen(S);
    for (int i = 0; i < N - 1; i++) {
        if (S[i] == bigramme[0] && S[i+1] == bigramme[1]) {
            compteur++;
        }
    }
    
    return compteur;
}

void test_exercice3() {
    const char *phrase = "elle m'appelle pour partir avec la folie";
    const char *bigramme_cherche = "le";
    
    int result = CompterBigrammes(phrase, bigramme_cherche);
    
    printf("\n--- Exercice 3 (C) ---\n");
    printf("Phrase : \"%s\"\n", phrase);
    printf("Le nombre de bigrammes \"%s\" est : %d\n", bigramme_cherche, result);
}