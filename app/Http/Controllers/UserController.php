<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreUserRequest;
use App\Http\Requests\UpdateUserRequest;
use App\Models\User;
use App\Models\Team;
use App\Models\LeaveBalance;
use App\Models\LeaveType;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Inertia\Inertia;
use Inertia\Response;

class UserController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request): Response
    {
        $this->authorize('viewAny', User::class);
        
        $year = now()->year;
        $leaveTypes = LeaveType::where('is_active', true)
            ->where('has_balance', true)
            ->get();
        
        // Get teams for filter
        $teamsQuery = Team::where('is_active', true);
        
        // If manager, only show their managed teams
        if (auth()->user()->isManager()) {
            $managedTeamIds = auth()->user()->managedTeams()->pluck('id');
            $teamsQuery->whereIn('id', $managedTeamIds);
        }
        
        $teams = $teamsQuery->orderBy('name')
            ->get(['id', 'name']);
        
        // Build query with team filter
        $usersQuery = User::with(['team', 'managedTeams', 'leaveBalances' => function ($query) use ($year) {
            $query->where('year', $year)->with('leaveType');
        }]);
        
        // If manager, only show users from their managed teams
        if (auth()->user()->isManager()) {
            $managedTeamIds = auth()->user()->managedTeams()->pluck('id');
            $usersQuery->whereIn('team_id', $managedTeamIds);
        }
        
        // Apply team filter if provided
        if ($request->has('team_id') && $request->team_id) {
            $usersQuery->where('team_id', $request->team_id);
        }
        
        $users = $usersQuery->latest()
            ->get()
            ->map(function ($user) use ($leaveTypes, $year) {
                $balances = $user->leaveBalances->keyBy('leave_type_id');
                
                $leaveBalances = $leaveTypes->map(function ($leaveType) use ($balances) {
                    $balance = $balances->get($leaveType->id);
                    
                    if ($balance) {
                        return [
                            'id' => $balance->id,
                            'leave_type_id' => $leaveType->id,
                            'leave_type_name' => $leaveType->name,
                            'leave_type_color' => $leaveType->color,
                            'total_days' => $balance->total_days,
                            'used_days' => $balance->used_days,
                            'pending_days' => $balance->pending_days,
                            'available_days' => $balance->available_days,
                        ];
                    } else {
                        // No balance record exists, show default values
                        $defaultTotalDays = $leaveType->max_days_per_year ?? 0;
                        return [
                            'id' => null,
                            'leave_type_id' => $leaveType->id,
                            'leave_type_name' => $leaveType->name,
                            'leave_type_color' => $leaveType->color,
                            'total_days' => $defaultTotalDays,
                            'used_days' => 0,
                            'pending_days' => 0,
                            'available_days' => $defaultTotalDays,
                        ];
                    }
                });
                
                return [
                    'id' => $user->id,
                    'name' => $user->name,
                    'email' => $user->email,
                    'role' => $user->role,
                    'team' => $user->team ? [
                        'id' => $user->team->id,
                        'name' => $user->team->name,
                    ] : null,
                    'leave_balances' => $leaveBalances,
                ];
            });

        return Inertia::render('Users/Index', [
            'users' => $users,
            'teams' => $teams,
            'filters' => $request->only(['team_id']),
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create(): Response
    {
        $this->authorize('create', User::class);
        
        $teams = Team::where('is_active', true)->get();

        return Inertia::render('Users/Create', [
            'teams' => $teams,
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreUserRequest $request): RedirectResponse
    {
        $validated = $request->validated();
        
        $user = User::create([
            'name' => $validated['name'],
            'email' => $validated['email'],
            'password' => Hash::make($validated['password']),
            'role' => $validated['role'],
            'team_id' => $validated['team_id'] ?? null,
        ]);

        // Create leave balances for employees, managers, and admins (only for leave types that have balance)
        if ($user->isEmployee() || $user->isManager() || $user->isAdmin()) {
            $year = now()->year;
            $leaveTypes = LeaveType::where('is_active', true)
                ->where('has_balance', true)
                ->get();
            
            foreach ($leaveTypes as $leaveType) {
                $totalDays = $leaveType->max_days_per_year ?? 0;
                
                LeaveBalance::create([
                    'user_id' => $user->id,
                    'leave_type_id' => $leaveType->id,
                    'total_days' => $totalDays,
                    'used_days' => 0,
                    'pending_days' => 0,
                    'year' => $year,
                ]);
            }
        }

        return redirect()->route('users.index')
            ->with('success', 'User created successfully.');
    }

    /**
     * Display the specified resource.
     */
    public function show(User $user): Response
    {
        $this->authorize('view', $user);
        
        $user->load(['team', 'leaveRequests', 'leaveBalances']);

        return Inertia::render('Users/Show', [
            'user' => $user,
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(User $user): Response
    {
        $this->authorize('update', $user);
        
        $teams = Team::where('is_active', true)->get();

        return Inertia::render('Users/Edit', [
            'user' => $user,
            'teams' => $teams,
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateUserRequest $request, User $user): RedirectResponse
    {
        $this->authorize('update', $user);
        
        $validated = $request->validated();
        
        // Only update password if provided
        if (isset($validated['password'])) {
            $validated['password'] = Hash::make($validated['password']);
        } else {
            unset($validated['password']);
        }

        $user->update($validated);

        // If role changed to employee, manager, or admin and no leave balances exist, create them (only for leave types that have balance)
        if (($user->isEmployee() || $user->isManager() || $user->isAdmin()) && $user->leaveBalances()->count() === 0) {
            $year = now()->year;
            $leaveTypes = LeaveType::where('is_active', true)
                ->where('has_balance', true)
                ->get();
            
            foreach ($leaveTypes as $leaveType) {
                $totalDays = $leaveType->max_days_per_year ?? 0;
                
                LeaveBalance::create([
                    'user_id' => $user->id,
                    'leave_type_id' => $leaveType->id,
                    'total_days' => $totalDays,
                    'used_days' => 0,
                    'pending_days' => 0,
                    'year' => $year,
                ]);
            }
        }

        return redirect()->route('users.index')
            ->with('success', 'User updated successfully.');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(User $user): RedirectResponse
    {
        $this->authorize('delete', $user);
        
        $user->delete();

        return redirect()->route('users.index')
            ->with('success', 'User deleted successfully.');
    }
}
