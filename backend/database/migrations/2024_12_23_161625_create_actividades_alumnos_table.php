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
        Schema::create('actividades_alumnos', function (Blueprint $table) {
            $table->unsignedBigInteger('id_actividad');
            $table->unsignedBigInteger('id_alumno');
            $table->string('fecha');
            $table->string('estado');
            $table->timestamps();

            $table->foreign('id_alumno')->references('id')->on('alumnos')->onDelete('cascade');
            $table->foreign('id_actividad')->references('id')->on('actividades')->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('actividades_alumnos');
    }
};
