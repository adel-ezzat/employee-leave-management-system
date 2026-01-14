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
        Schema::table('leave_types', function (Blueprint $table) {
            $table->boolean('does_not_deduct_balance')->default(false)->after('requires_medical_document');
            $table->boolean('has_balance')->default(true)->after('does_not_deduct_balance');
            $table->boolean('visible_to_employees')->default(true)->after('has_balance');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('leave_types', function (Blueprint $table) {
            $table->dropColumn(['does_not_deduct_balance', 'has_balance', 'visible_to_employees']);
        });
    }
};
