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
        Schema::create('scraping_results', function (Blueprint $table) {
            $table->id();
            $table->foreignId('scraper_url_id')->constrained('scraper_urls')->onDelete('cascade');
            $table->string('task_id')->unique();
            
            // Status du scraping
            $table->enum('status', ['pending', 'running', 'completed', 'failed'])->default('pending');
            
            // Résultats
            $table->integer('total_products')->nullable();
            $table->integer('pages_scraped')->nullable();
            $table->string('data_file_path')->nullable();
            $table->text('error_message')->nullable();
            
            // Timestamps
            $table->timestamp('started_at')->nullable();
            $table->timestamp('completed_at')->nullable();
            $table->timestamps();
            
            $table->index(['scraper_url_id', 'status']);
            $table->index(['created_at']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('scraping_results');
    }
};
