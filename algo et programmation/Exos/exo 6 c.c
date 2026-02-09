#include <stdio.h>
#include <stdlib.h>
#include <string.h>

typedef struct {
    int jour;
    int mois;
    int annee;
} date_naiss;

typedef struct {
    int id;
    char nom_famille[50];
    char nom_marital[50];
    char prenom[50];
    date_naiss date_naissance;
    char sexe;
} ID_patient;

ID_patient init_patient() {
    ID_patient patient;

    printf("Entrez le numero d'identifiant : ");
    scanf("%d", &patient.id);

    printf("Entrez le nom de famille : ");
    scanf("%s", patient.nom_famille);

    printf("Entrez le nom marital : ");
    scanf("%s", patient.nom_marital);

    printf("Entrez le prénom : ");
    scanf("%s", patient.prenom);

    printf("Entrez la date de naissance : ");
    scanf("%d %d %d", &patient.date_naissance.jour, &patient.date_naissance.mois, &patient.date_naissance.annee);

    printf("Entrez le sexe (M/F) : ");
    scanf(" %c", &patient.sexe);

    return patient;
}

int doublon(ID_patient p1, ID_patient p2) {
    if (p1.id == p2.id) {
        return 1;
    }
    return 0; 
}