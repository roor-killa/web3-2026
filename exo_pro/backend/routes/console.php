<?php

// Fichier backend: commentaires simples en francais.
// Définition de commandes Artisan personnalisées (ici `inspire`).
use Illuminate\Foundation\Inspiring;
use Illuminate\Support\Facades\Artisan;

Artisan::command('inspire', function () {
    $this->comment(Inspiring::quote());
})->purpose('Display an inspiring quote');


