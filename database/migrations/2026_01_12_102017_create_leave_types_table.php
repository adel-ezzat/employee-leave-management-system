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
        Schema::create('leave_types', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('slug')->unique();
            $table->text('description')->nullable();
            $table->boolean('is_paid')->default(true);
            $table->integer('max_days_per_year')->nullable();
            $table->boolean('requires_medical_document')->default(false);
            $table->boolean('has_balance')->default(true);
            $table->boolean('visible_to_employees')->default(true);
            $table->boolean('is_active')->default(true);
            $table->string('color')->default('#1677FF');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('leave_types');
    }
};
