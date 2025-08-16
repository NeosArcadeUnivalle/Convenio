<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void {
        Schema::create('convenios', function (Blueprint $table) {
            $table->id();
            $table->string('titulo');
            $table->string('entidad_firmante');
            $table->date('fecha_firma');
            $table->date('fecha_vencimiento')->nullable();
            $table->enum('estado', ['vigente', 'vencido', 'en_negociacion'])->default('vigente');
            $table->enum('riesgo', ['alto', 'medio', 'bajo'])->nullable();
            $table->text('descripcion')->nullable();
            $table->string('archivo')->nullable(); // path al PDF/DOCX
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('convenios');
    }
};
