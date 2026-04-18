<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('prendas', function (Blueprint $table) {
            $table->id();
            // Claves foráneas (el onDelete('cascade') borra la prenda si se borra el usuario/marca)
            $table->foreignId('usuario_id')->constrained('users')->onDelete('cascade');
            $table->foreignId('marca_id')->constrained('marcas')->onDelete('cascade');
            
            $table->string('foto_url')->nullable(); // Nullable por si suben la prenda sin foto al principio
            $table->string('categoria');
            $table->string('color_principal')->nullable();
            $table->decimal('precio_compra', 8, 2)->nullable();
            $table->boolean('esta_limpia')->default(true);
            $table->integer('contador_usos')->default(0);
            
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('prendas');
    }
};