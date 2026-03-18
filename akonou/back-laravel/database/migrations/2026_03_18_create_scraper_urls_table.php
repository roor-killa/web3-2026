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
        Schema::create('scraper_urls', function (Blueprint $table) {
            $table->id();
            $table->string('url')->unique();
            $table->enum('territory', ['gp', 'mq', 're', 'gf']);
            $table->integer('max_pages')->default(10);
            $table->string('custom_name')->nullable();
            $table->boolean('active')->default(true);
            
            // Cron & planification
            $table->string('cron_expression')->default('0 2 * * *'); // 2h du matin chaque jour
            $table->timestamp('last_scraped_at')->nullable();
            $table->timestamp('next_scrape_at')->nullable();
            
            // Status
            $table->enum('status', ['pending', 'running', 'success', 'failed'])->default('pending');
            
            $table->timestamps();
            $table->index(['territory', 'active']);
            $table->index('next_scrape_at');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('scraper_urls');
    }
};
