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
        Schema::create('actividades_categorias', function (Blueprint $table) {
            $table->unsignedBigInteger('id_actividad');
            $table->unsignedBigInteger('id_categoria');
            $table->timestamps();
            
            $table->unique(['id_actividad', 'id_categoria']);
            $table->foreign('id_actividad')->references('id')->on('actividades')->onDelete('cascade');
            $table->foreign('id_categoria')->references('id')->on('categorias')->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('actividades_categorias');
    }
};
