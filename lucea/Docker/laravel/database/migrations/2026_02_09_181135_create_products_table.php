<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
    Schema::create('products', function (Blueprint $table) {
        $table->id();
        $table->string('titre');
        $table->text('description')->nullable();
        $table->decimal('prix', 8, 2);
        $table->timestamp('date_create')->nullable();
        $table->timestamp('date_update')->nullable();
    });
}
    public function down(): void
    {
        Schema::dropIfExists('products');
    }
};