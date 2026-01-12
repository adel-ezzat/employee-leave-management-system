<?php

namespace Database\Seeders;

use App\Models\User;
use App\Models\Team;
use App\Models\LeaveBalance;
use App\Models\LeaveType;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class UserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Create Admin
        $admin = User::create([
            'name' => 'Admin User',
            'email' => 'admin@example.com',
            'password' => Hash::make('password'),
            'role' => 'admin',
        ]);

        // Create Managers
        $managers = [
            ['name' => 'Manager One', 'email' => 'manager1@example.com'],
            ['name' => 'Manager Two', 'email' => 'manager2@example.com'],
        ];

        $createdManagers = [];
        foreach ($managers as $managerData) {
            $manager = User::create([
                'name' => $managerData['name'],
                'email' => $managerData['email'],
                'password' => Hash::make('password'),
                'role' => 'manager',
            ]);
            $createdManagers[] = $manager;
        }

        // Create Teams and assign managers
        $teams = Team::all();
        foreach ($teams as $index => $team) {
            if (isset($createdManagers[$index])) {
                $team->update(['manager_id' => $createdManagers[$index]->id]);
                $createdManagers[$index]->update(['team_id' => $team->id]);
            }
        }

        // Create Employees
        $employees = [
            ['name' => 'Employee One', 'email' => 'employee1@example.com', 'team_id' => 1],
            ['name' => 'Employee Two', 'email' => 'employee2@example.com', 'team_id' => 1],
            ['name' => 'Employee Three', 'email' => 'employee3@example.com', 'team_id' => 2],
            ['name' => 'Employee Four', 'email' => 'employee4@example.com', 'team_id' => 2],
            ['name' => 'Employee Five', 'email' => 'employee5@example.com', 'team_id' => 1],
        ];

        $year = now()->year;
        $leaveTypes = LeaveType::where('is_active', true)->get();

        foreach ($employees as $employeeData) {
            $employee = User::create([
                'name' => $employeeData['name'],
                'email' => $employeeData['email'],
                'password' => Hash::make('password'),
                'role' => 'employee',
                'team_id' => $employeeData['team_id'],
            ]);

            // Create leave balances for each employee
            foreach ($leaveTypes as $leaveType) {
                $totalDays = $leaveType->max_days_per_year ?? 0;
                
                LeaveBalance::create([
                    'user_id' => $employee->id,
                    'leave_type_id' => $leaveType->id,
                    'total_days' => $totalDays,
                    'used_days' => 0,
                    'pending_days' => 0,
                    'year' => $year,
                ]);
            }
        }
    }
}
