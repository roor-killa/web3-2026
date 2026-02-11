<?php

namespace App\Providers;

use Illuminate\Support\ServiceProvider;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        //
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        // Register CORS middleware for API routes (allows frontend on localhost:3000)
        if ($this->app->bound('router')) {
            $this->app['router']->pushMiddlewareToGroup('api', \App\Http\Middleware\Cors::class);
        }
    }
}
