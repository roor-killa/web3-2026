<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('scraper_configurations', function (Blueprint $table) {
            $table->id();
            
            // Paramètres de configuration globale
            $table->string('key')->unique(); // Ex: 'default_max_pages', 'default_delay'
            $table->text('value'); // Stockée en JSON si besoin
            $table->string('type')->default('string'); // string, integer, boolean, json
            $table->text('description')->nullable();
            
            $table->timestamps();
        });

        Schema::create('scraper_schedules', function (Blueprint $table) {
            $table->id();
            
            $table->string('cron_expression'); // Ex: "0 2 * * *"
            $table->string('name')->nullable(); // Ex: "Scraping chaque nuit"
            $table->json('territories'); // ["gp", "mq", "re"]
            $table->integer('max_pages')->default(10);
            $table->boolean('enabled')->default(true);
            $table->timestamp('last_executed_at')->nullable();
            $table->timestamp('next_execution_at')->nullable();
            
            $table->timestamps();
        });

        Schema::create('scraper_execution_logs', function (Blueprint $table) {
            $table->id();
            
            $table->string('task_id')->unique();
            $table->string('status'); // pending, running, completed, failed, cancelled
            $table->string('territory');
            $table->integer('pages_scraped')->default(0);
            $table->integer('total_products')->default(0);
            $table->text('error_message')->nullable();
            
            $table->timestamp('started_at');
            $table->timestamp('completed_at')->nullable();
            $table->float('duration_seconds')->nullable(); // En secondes
            
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('scraper_execution_logs');
        Schema::dropIfExists('scraper_schedules');
        Schema::dropIfExists('scraper_configurations');
    }
};
