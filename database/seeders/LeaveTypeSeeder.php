<?php

namespace Database\Seeders;

use App\Models\LeaveType;
use Illuminate\Database\Seeder;

class LeaveTypeSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $leaveTypes = [
            [
                'name' => 'Regular Leave',
                'slug' => 'regular-leave',
                'description' => 'Standard Leave – 15 days per year. Requires 48 hours advance notice.',
                'is_paid' => true,
                'max_days_per_year' => 15,
                'requires_medical_document' => false,
                'has_balance' => true,
                'visible_to_employees' => true,
                'is_active' => true,
                'color' => '#1677FF',
            ],
            [
                'name' => 'Casual Leave',
                'slug' => 'casual-leave',
                'description' => 'Occasional Leave – 6 days per year. Can notify same day.',
                'is_paid' => true,
                'max_days_per_year' => 6,
                'requires_medical_document' => false,
                'has_balance' => true,
                'visible_to_employees' => true,
                'is_active' => true,
                'color' => '#52C41A',
            ],
            [
                'name' => 'Sick Leave',
                'slug' => 'sick-leave',
                'description' => 'Medical leave for illness – 30 days per year',
                'is_paid' => true,
                'max_days_per_year' => 30,
                'requires_medical_document' => true,
                'has_balance' => true,
                'visible_to_employees' => true,
                'is_active' => true,
                'color' => '#FA8C16',
            ],
            [
                'name' => 'Unpaid Leave',
                'slug' => 'unpaid-leave',
                'description' => 'Unpaid leave without salary',
                'is_paid' => false,
                'max_days_per_year' => null,
                'requires_medical_document' => false,
                'has_balance' => false,
                'visible_to_employees' => true,
                'is_active' => true,
                'color' => '#8C8C8C',
            ],
            [
                'name' => 'Special Leave',
                'slug' => 'special-leave',
                'description' => 'Special paid leave for official holidays and special occasions',
                'is_paid' => true,
                'max_days_per_year' => null,
                'requires_medical_document' => false,
                'has_balance' => false,
                'visible_to_employees' => false,
                'is_active' => true,
                'color' => '#722ED1',
            ],
        ];

        $newSlugs = array_column($leaveTypes, 'slug');

        // Create or update the new leave types
        foreach ($leaveTypes as $leaveType) {
            LeaveType::updateOrCreate(
                ['slug' => $leaveType['slug']],
                $leaveType
            );
        }

        // Delete old leave types that are not in the new list (only if they have no leave requests)
        $oldLeaveTypes = LeaveType::whereNotIn('slug', $newSlugs)->get();
        foreach ($oldLeaveTypes as $oldLeaveType) {
            if ($oldLeaveType->leaveRequests()->count() === 0) {
                $oldLeaveType->delete();
            }
        }
    }
}
