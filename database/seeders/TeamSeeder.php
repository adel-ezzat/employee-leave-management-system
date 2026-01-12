<?php

namespace Database\Seeders;

use App\Models\Team;
use Illuminate\Database\Seeder;

class TeamSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $teams = [
            [
                'name' => 'Development Team',
                'description' => 'Software development and engineering team',
                'is_active' => true,
            ],
            [
                'name' => 'Marketing Team',
                'description' => 'Marketing and communications team',
                'is_active' => true,
            ],
            [
                'name' => 'Sales Team',
                'description' => 'Sales and business development team',
                'is_active' => true,
            ],
        ];

        foreach ($teams as $team) {
            Team::create($team);
        }
    }
}
