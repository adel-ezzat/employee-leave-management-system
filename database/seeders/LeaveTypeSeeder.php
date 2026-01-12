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
                'name' => 'Annual Leave',
                'slug' => 'annual-leave',
                'description' => 'Annual vacation leave',
                'is_paid' => true,
                'max_days_per_year' => 21,
                'requires_medical_document' => false,
                'is_active' => true,
                'color' => '#1677FF',
            ],
            [
                'name' => 'Casual Leave',
                'slug' => 'casual-leave',
                'description' => 'Casual leave for personal matters',
                'is_paid' => true,
                'max_days_per_year' => 7,
                'requires_medical_document' => false,
                'is_active' => true,
                'color' => '#52C41A',
            ],
            [
                'name' => 'Sick Leave',
                'slug' => 'sick-leave',
                'description' => 'Medical leave for illness',
                'is_paid' => true,
                'max_days_per_year' => 30,
                'requires_medical_document' => true,
                'is_active' => true,
                'color' => '#FA8C16',
            ],
            [
                'name' => 'Official Holidays',
                'slug' => 'official-holidays',
                'description' => 'Public and official holidays',
                'is_paid' => true,
                'max_days_per_year' => null,
                'requires_medical_document' => false,
                'is_active' => true,
                'color' => '#722ED1',
            ],
            [
                'name' => 'Emergency Leave',
                'slug' => 'emergency-leave',
                'description' => 'Emergency leave for urgent matters',
                'is_paid' => true,
                'max_days_per_year' => 5,
                'requires_medical_document' => false,
                'is_active' => true,
                'color' => '#F5222D',
            ],
            [
                'name' => 'Maternity Leave',
                'slug' => 'maternity-leave',
                'description' => 'Maternity leave for female employees',
                'is_paid' => true,
                'max_days_per_year' => 90,
                'requires_medical_document' => true,
                'is_active' => true,
                'color' => '#EB2F96',
            ],
            [
                'name' => 'Paternity Leave',
                'slug' => 'paternity-leave',
                'description' => 'Paternity leave for male employees',
                'is_paid' => true,
                'max_days_per_year' => 7,
                'requires_medical_document' => false,
                'is_active' => true,
                'color' => '#13C2C2',
            ],
            [
                'name' => 'Unpaid Leave',
                'slug' => 'unpaid-leave',
                'description' => 'Unpaid leave without salary',
                'is_paid' => false,
                'max_days_per_year' => null,
                'requires_medical_document' => false,
                'is_active' => true,
                'color' => '#8C8C8C',
            ],
        ];

        foreach ($leaveTypes as $leaveType) {
            LeaveType::create($leaveType);
        }
    }
}
