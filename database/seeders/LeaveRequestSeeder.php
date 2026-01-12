<?php

namespace Database\Seeders;

use App\Models\LeaveRequest;
use App\Models\User;
use App\Models\LeaveType;
use Illuminate\Database\Seeder;
use Carbon\Carbon;

class LeaveRequestSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $employees = User::where('role', 'employee')->get();
        $leaveTypes = LeaveType::where('is_active', true)->get();
        $managers = User::where('role', 'manager')->get();

        if ($employees->isEmpty() || $leaveTypes->isEmpty()) {
            return;
        }

        // Create some sample leave requests
        $statuses = ['pending', 'approved', 'rejected'];
        
        foreach ($employees->take(3) as $employee) {
            $leaveType = $leaveTypes->random();
            $status = $statuses[array_rand($statuses)];
            
            $startDate = Carbon::now()->addDays(rand(1, 30));
            $endDate = $startDate->copy()->addDays(rand(1, 5));
            $totalDays = $startDate->diffInDays($endDate) + 1;

            $leaveRequest = LeaveRequest::create([
                'user_id' => $employee->id,
                'leave_type_id' => $leaveType->id,
                'start_date' => $startDate,
                'end_date' => $endDate,
                'total_days' => $totalDays,
                'reason' => 'Sample leave request for testing purposes',
                'status' => $status,
                'approved_by' => $status !== 'pending' ? $managers->random()->id : null,
                'approved_at' => $status !== 'pending' ? Carbon::now()->subDays(rand(1, 10)) : null,
            ]);
        }
    }
}
