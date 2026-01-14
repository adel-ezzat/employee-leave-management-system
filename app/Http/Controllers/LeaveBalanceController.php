<?php

namespace App\Http\Controllers;

use App\Models\LeaveBalance;
use App\Models\LeaveType;
use App\Models\User;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class LeaveBalanceController extends Controller
{
    /**
     * Display leave balances for a user
     */
    public function index(Request $request): Response
    {
        $userId = $request->get('user_id', $request->user()->id);
        $year = $request->get('year', now()->year);

        // Only admins can view other users' balances
        if ($userId !== $request->user()->id && !$request->user()->isAdmin()) {
            abort(403);
        }

        $user = User::findOrFail($userId);
        $balances = LeaveBalance::with('leaveType')
            ->where('user_id', $userId)
            ->where('year', $year)
            ->get()
            ->map(function ($balance) {
                return [
                    'id' => $balance->id,
                    'user_id' => $balance->user_id,
                    'leave_type_id' => $balance->leave_type_id,
                    'total_days' => $balance->total_days,
                    'used_days' => $balance->used_days,
                    'pending_days' => $balance->pending_days,
                    'year' => $balance->year,
                    'available_days' => $balance->available_days,
                    'leave_type' => $balance->leaveType ? [
                        'id' => $balance->leaveType->id,
                        'name' => $balance->leaveType->name,
                        'color' => $balance->leaveType->color,
                    ] : null,
                ];
            });

        // Get leave types that don't have balances yet
        $existingLeaveTypeIds = $balances->pluck('leave_type_id')->filter()->toArray();
        $availableLeaveTypes = LeaveType::where('is_active', true)
            ->whereNotIn('id', $existingLeaveTypeIds)
            ->get()
            ->map(function ($leaveType) {
                return [
                    'id' => $leaveType->id,
                    'name' => $leaveType->name,
                    'color' => $leaveType->color,
                    'max_days_per_year' => $leaveType->max_days_per_year,
                ];
            });

        return Inertia::render('LeaveBalances/Index', [
            'balances' => $balances,
            'user' => $user,
            'year' => $year,
            'canEdit' => $request->user()->isAdmin() && $userId !== $request->user()->id,
            'availableLeaveTypes' => $availableLeaveTypes,
        ]);
    }

    /**
     * Store a newly created leave balance
     */
    public function store(Request $request)
    {
        // Only admins can create leave balances for other users
        if (!$request->user()->isAdmin()) {
            abort(403);
        }

        $request->validate([
            'user_id' => 'required|exists:users,id',
            'leave_type_id' => 'required|exists:leave_types,id',
            'total_days' => 'required|integer|min:0',
            'year' => 'required|integer',
        ]);

        // Check if balance already exists
        $existingBalance = LeaveBalance::where('user_id', $request->user_id)
            ->where('leave_type_id', $request->leave_type_id)
            ->where('year', $request->year)
            ->first();

        if ($existingBalance) {
            return redirect()->back()->with('error', 'Leave balance already exists for this leave type and year.');
        }

        LeaveBalance::create([
            'user_id' => $request->user_id,
            'leave_type_id' => $request->leave_type_id,
            'total_days' => $request->total_days,
            'used_days' => 0,
            'pending_days' => 0,
            'year' => $request->year,
        ]);

        return redirect()->back()->with('success', 'Leave balance created successfully.');
    }

    /**
     * Update leave balance (admin only)
     */
    public function update(Request $request, LeaveBalance $leaveBalance)
    {
        // Only admins can update leave balances
        if (!$request->user()->isAdmin()) {
            abort(403);
        }

        $request->validate([
            'total_days' => 'required|integer|min:0',
        ]);

        $leaveBalance->update([
            'total_days' => $request->total_days,
        ]);

        return redirect()->back()->with('success', 'Leave balance updated successfully.');
    }

    /**
     * Set global leave limits
     */
    public function setGlobalLimits(Request $request)
    {
        $request->validate([
            'leave_type_id' => 'required|exists:leave_types,id',
            'total_days' => 'required|integer|min:0',
        ]);

        // Update all users' balances for this leave type (employees, managers, and admins)
        $users = User::whereIn('role', ['employee', 'manager', 'admin'])->get();
        $year = now()->year;

        foreach ($users as $user) {
            LeaveBalance::updateOrCreate(
                [
                    'user_id' => $user->id,
                    'leave_type_id' => $request->leave_type_id,
                    'year' => $year,
                ],
                [
                    'total_days' => $request->total_days,
                ]
            );
        }

        return redirect()->back()->with('success', 'Global leave limits updated successfully.');
    }
}
