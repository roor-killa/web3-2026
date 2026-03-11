<?php

namespace App\Providers;

// Provider principal de l'application. Sert à enregistrer et démarrer
// des services partagés pour l'application (bindings, observers, etc.).


use Illuminate\Support\ServiceProvider;

class AppServiceProvider extends ServiceProvider
{
    
    public function register(): void
    {
    }

    
    public function boot(): void
    {
    }
}


