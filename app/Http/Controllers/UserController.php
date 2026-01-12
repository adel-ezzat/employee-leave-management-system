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
    public function index(): Response
    {
        $this->authorize('viewAny', User::class);
        
        $users = User::with(['team', 'managedTeams'])
            ->latest()
            ->get();

        return Inertia::render('Users/Index', [
            'users' => $users,
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

        // Create leave balances for employees
        if ($user->isEmployee()) {
            $year = now()->year;
            $leaveTypes = LeaveType::where('is_active', true)->get();
            
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

        // If role changed to employee and no leave balances exist, create them
        if ($user->isEmployee() && $user->leaveBalances()->count() === 0) {
            $year = now()->year;
            $leaveTypes = LeaveType::where('is_active', true)->get();
            
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
