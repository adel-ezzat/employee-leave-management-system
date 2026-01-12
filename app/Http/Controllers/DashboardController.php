<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;
use App\Models\LeaveRequest;
use App\Models\LeaveBalance;
use App\Models\Team;
use Carbon\Carbon;

class DashboardController extends Controller
{
    /**
     * Display the dashboard based on user role
     */
    public function index(Request $request): Response
    {
        $user = $request->user();

        if ($user->isAdmin()) {
            return $this->adminDashboard($user);
        } elseif ($user->isManager()) {
            return $this->managerDashboard($user);
        } else {
            return $this->employeeDashboard($user);
        }
    }

    /**
     * Admin dashboard
     */
    private function adminDashboard($user): Response
    {
        $stats = [
            'total_teams' => Team::count(),
            'total_employees' => \App\Models\User::where('role', 'employee')->count(),
            'pending_requests' => LeaveRequest::where('status', 'pending')->count(),
            'approved_requests' => LeaveRequest::where('status', 'approved')->count(),
        ];

        $recentRequests = LeaveRequest::with(['user.team', 'leaveType'])
            ->latest()
            ->limit(10)
            ->get();

        return Inertia::render('Dashboard/Admin', [
            'stats' => $stats,
            'recentRequests' => $recentRequests,
        ]);
    }

    /**
     * Manager dashboard
     */
    private function managerDashboard($user): Response
    {
        $team = $user->team;
        $teamId = $team?->id;

        // Get team leave requests
        $leaveRequests = LeaveRequest::with(['user', 'leaveType'])
            ->whereHas('user', function ($q) use ($teamId) {
                $q->where('team_id', $teamId);
            })
            ->latest()
            ->get();

        // Filter by status
        $pendingRequests = $leaveRequests->where('status', 'pending')->values();
        $approvedRequests = $leaveRequests->where('status', 'approved')->values();
        $rejectedRequests = $leaveRequests->where('status', 'rejected')->values();

        // Who is on leave today
        $onLeaveToday = LeaveRequest::with(['user', 'leaveType'])
            ->whereHas('user', function ($q) use ($teamId) {
                $q->where('team_id', $teamId);
            })
            ->where('status', 'approved')
            ->whereDate('start_date', '<=', today())
            ->whereDate('end_date', '>=', today())
            ->get();

        // Who will be on leave next week
        $nextWeekStart = Carbon::now()->addWeek()->startOfWeek();
        $nextWeekEnd = Carbon::now()->addWeek()->endOfWeek();
        $onLeaveNextWeek = LeaveRequest::with(['user', 'leaveType'])
            ->whereHas('user', function ($q) use ($teamId) {
                $q->where('team_id', $teamId);
            })
            ->where('status', 'approved')
            ->whereBetween('start_date', [$nextWeekStart, $nextWeekEnd])
            ->orWhereBetween('end_date', [$nextWeekStart, $nextWeekEnd])
            ->get();

        // Get manager's leave balances
        $leaveBalances = LeaveBalance::with('leaveType')
            ->where('user_id', $user->id)
            ->where('year', now()->year)
            ->get()
            ->map(function ($balance) {
                return [
                    'id' => $balance->id,
                    'leave_type' => $balance->leaveType->name,
                    'total_days' => $balance->total_days,
                    'used_days' => $balance->used_days,
                    'pending_days' => $balance->pending_days,
                    'available_days' => $balance->available_days,
                ];
            });

        return Inertia::render('Dashboard/Manager', [
            'team' => $team,
            'pendingRequests' => $pendingRequests,
            'approvedRequests' => $approvedRequests,
            'rejectedRequests' => $rejectedRequests,
            'onLeaveToday' => $onLeaveToday,
            'onLeaveNextWeek' => $onLeaveNextWeek,
            'leaveBalances' => $leaveBalances,
        ]);
    }

    /**
     * Employee dashboard
     */
    private function employeeDashboard($user): Response
    {
        // Get user's leave requests
        $leaveRequests = LeaveRequest::with(['leaveType', 'user.team'])
            ->where('user_id', $user->id)
            ->latest()
            ->get();

        // Get leave balances
        $leaveBalances = LeaveBalance::with('leaveType')
            ->where('user_id', $user->id)
            ->where('year', now()->year)
            ->get()
            ->map(function ($balance) {
                return [
                    'id' => $balance->id,
                    'leave_type' => $balance->leaveType->name,
                    'total_days' => $balance->total_days,
                    'used_days' => $balance->used_days,
                    'pending_days' => $balance->pending_days,
                    'available_days' => $balance->available_days,
                ];
            });

        return Inertia::render('Dashboard/Employee', [
            'leaveRequests' => $leaveRequests,
            'leaveBalances' => $leaveBalances,
        ]);
    }
}
