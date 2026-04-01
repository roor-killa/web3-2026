<?php

namespace App\Providers;

use Illuminate\Support\ServiceProvider;

class AppServiceProvider extends ServiceProvider
{
    public function register()
    {
        // Enregistrer des services dans le container
        $this->app->bind(PaymentInterface::class, StripePayment::class);
    }
    
    public function boot()
    {
        // Code exécuté quand l'app démarre
        // Ex: partager des données avec toutes les vues
    }
}