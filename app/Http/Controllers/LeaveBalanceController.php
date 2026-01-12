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

        $balances = LeaveBalance::with('leaveType')
            ->where('user_id', $userId)
            ->where('year', $year)
            ->get();

        return Inertia::render('LeaveBalances/Index', [
            'balances' => $balances,
            'userId' => $userId,
            'year' => $year,
        ]);
    }

    /**
     * Update leave balance (admin only)
     */
    public function update(Request $request, LeaveBalance $leaveBalance)
    {
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

        // Update all users' balances for this leave type
        $users = User::where('role', 'employee')->get();
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
