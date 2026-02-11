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
        Schema::create('products', function (Blueprint $table) {
            $table->id(); // Automatically creates 'id'
            $table->string('titre'); // For the title
            $table->text('description')->nullable(); // Text area, allows empty
            $table->decimal('prix', 8, 2); // Decimal for prices (e.g., 99.99)
            
            // Option A: Laravel Standard (Recommended)
            $table->timestamps(); // Creates created_at and updated_at
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        //
    }
};
