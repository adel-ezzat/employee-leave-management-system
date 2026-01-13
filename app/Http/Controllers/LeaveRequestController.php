<?php

namespace App\Http\Controllers;

use App\Http\Requests\ApproveLeaveRequestRequest;
use App\Http\Requests\StoreLeaveRequestRequest;
use App\Http\Requests\UpdateLeaveRequestRequest;
use App\Models\LeaveBalance;
use App\Models\LeaveRequest;
use Carbon\Carbon;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;
use Inertia\Response;

class LeaveRequestController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request): Response
    {
        $user = $request->user();
        $query = LeaveRequest::with(['user.team', 'leaveType', 'approver']);

        // Filter based on user role
        if ($user->isEmployee()) {
            $query->where('user_id', $user->id);
        } elseif ($user->isManager()) {
            $query->whereHas('user', function ($q) use ($user) {
                $q->where('team_id', $user->team_id);
            });
        }
        // Admin can see all

        // Apply filters
        if ($request->has('status')) {
            $query->where('status', $request->status);
        }

        if ($request->has('leave_type_id')) {
            $query->where('leave_type_id', $request->leave_type_id);
        }

        if ($request->has('user_id')) {
            $query->where('user_id', $request->user_id);
        }

        if ($request->has('date_from')) {
            $query->where('start_date', '>=', $request->date_from);
        }

        if ($request->has('date_to')) {
            $query->where('end_date', '<=', $request->date_to);
        }

        $leaveRequests = $query->latest()->paginate(15);

        // Get users list for filter (only for admins and managers)
        $users = null;
        if ($user->isAdmin()) {
            $users = \App\Models\User::whereIn('role', ['employee', 'manager'])
                ->orderBy('name')
                ->get(['id', 'name', 'email']);
        } elseif ($user->isManager()) {
            $users = \App\Models\User::where('team_id', $user->team_id)
                ->where('role', 'employee')
                ->orderBy('name')
                ->get(['id', 'name', 'email']);
        }

        return Inertia::render('LeaveRequests/Index', [
            'leaveRequests' => $leaveRequests,
            'filters' => $request->only(['status', 'leave_type_id', 'user_id', 'date_from', 'date_to']),
            'users' => $users,
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create(Request $request): Response
    {
        $user = $request->user();
        $year = now()->year;

        $leaveTypes = \App\Models\LeaveType::where('is_active', true)->get()
            ->map(function ($type) {
                return [
                    'id' => $type->id,
                    'name' => $type->name,
                    'requires_medical_document' => $type->requires_medical_document,
                    'max_days_per_year' => $type->max_days_per_year,
                ];
            });

        // Get user's leave balances
        $leaveBalances = \App\Models\LeaveBalance::where('user_id', $user->id)
            ->where('year', $year)
            ->get()
            ->keyBy('leave_type_id');

        // Map leave types with balance information
        $leaveTypesWithBalance = $leaveTypes->map(function ($type) use ($leaveBalances) {
            $balance = $leaveBalances->get($type['id']);
            
            if ($balance) {
                return [
                    ...$type,
                    'used_days' => $balance->used_days,
                    'remaining_days' => $balance->available_days,
                    'total_days' => $balance->total_days,
                ];
            } else {
                // No balance record exists, show default values
                $defaultTotalDays = $type['max_days_per_year'] ?? 0;
                return [
                    ...$type,
                    'used_days' => 0,
                    'remaining_days' => $defaultTotalDays,
                    'total_days' => $defaultTotalDays,
                ];
            }
        });

        return Inertia::render('LeaveRequests/Create', [
            'leaveTypes' => $leaveTypesWithBalance,
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreLeaveRequestRequest $request): RedirectResponse
    {
        $validated = $request->validated();
        $user = $request->user();

        $startDate = Carbon::parse($validated['start_date']);
        $endDate = Carbon::parse($validated['end_date']);
        $totalDays = LeaveRequest::calculateDays($startDate, $endDate);

        DB::transaction(function () use ($validated, $user, $totalDays, $request) {
            // Handle document upload
            $documentPath = null;
            if ($request->hasFile('document')) {
                $documentPath = $request->file('document')->store('leave-documents', 'public');
            }

            // Create leave request
            $leaveRequest = LeaveRequest::create([
                'user_id' => $user->id,
                'leave_type_id' => $validated['leave_type_id'],
                'start_date' => $validated['start_date'],
                'end_date' => $validated['end_date'],
                'total_days' => $totalDays,
                'reason' => $validated['reason'] ?? null,
                'document' => $documentPath,
                'status' => 'pending',
            ]);

            // Update pending days in leave balance
            $year = now()->year;
            $leaveType = \App\Models\LeaveType::find($validated['leave_type_id']);
            $defaultTotalDays = $leaveType ? ($leaveType->max_days_per_year ?? 0) : 0;

            $balance = LeaveBalance::firstOrCreate(
                [
                    'user_id' => $user->id,
                    'leave_type_id' => $validated['leave_type_id'],
                    'year' => $year,
                ],
                ['total_days' => $defaultTotalDays, 'used_days' => 0, 'pending_days' => 0]
            );

            $balance->increment('pending_days', $totalDays);
        });

        return redirect()->route('leave-requests.index')
            ->with('success', 'Leave request submitted successfully.');
    }

    /**
     * Display the specified resource.
     */
    public function show(LeaveRequest $leaveRequest): Response
    {
        $this->authorize('view', $leaveRequest);

        $leaveRequest->load(['user.team', 'leaveType', 'approver']);

        return Inertia::render('LeaveRequests/Show', [
            'leaveRequest' => $leaveRequest,
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(LeaveRequest $leaveRequest): Response
    {
        $this->authorize('update', $leaveRequest);

        $leaveTypes = \App\Models\LeaveType::where('is_active', true)->get();

        return Inertia::render('LeaveRequests/Edit', [
            'leaveRequest' => $leaveRequest,
            'leaveTypes' => $leaveTypes,
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateLeaveRequestRequest $request, LeaveRequest $leaveRequest): RedirectResponse
    {
        $this->authorize('update', $leaveRequest);

        $validated = $request->validated();

        if (isset($validated['start_date']) && isset($validated['end_date'])) {
            $startDate = Carbon::parse($validated['start_date']);
            $endDate = Carbon::parse($validated['end_date']);
            $validated['total_days'] = LeaveRequest::calculateDays($startDate, $endDate);
        }

        $leaveRequest->update($validated);

        return redirect()->route('leave-requests.index')
            ->with('success', 'Leave request updated successfully.');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(LeaveRequest $leaveRequest): RedirectResponse
    {
        $this->authorize('delete', $leaveRequest);

        DB::transaction(function () use ($leaveRequest) {
            // Decrement pending days
            $balance = LeaveBalance::where('user_id', $leaveRequest->user_id)
                ->where('leave_type_id', $leaveRequest->leave_type_id)
                ->where('year', now()->year)
                ->first();

            if ($balance) {
                $balance->decrement('pending_days', $leaveRequest->total_days);
            }

            $leaveRequest->delete();
        });

        return redirect()->route('leave-requests.index')
            ->with('success', 'Leave request deleted successfully.');
    }

    /**
     * Approve or reject a leave request
     */
    public function approve(ApproveLeaveRequestRequest $request, LeaveRequest $leaveRequest): RedirectResponse
    {
        $this->authorize('approve', $leaveRequest);

        $validated = $request->validated();

        DB::transaction(function () use ($leaveRequest, $validated, $request) {
            $leaveRequest->update([
                'status' => $validated['status'],
                'approved_by' => $request->user()->id,
                'approved_at' => now(),
                'rejection_reason' => $validated['rejection_reason'] ?? null,
            ]);

            $balance = LeaveBalance::where('user_id', $leaveRequest->user_id)
                ->where('leave_type_id', $leaveRequest->leave_type_id)
                ->where('year', now()->year)
                ->first();

            if ($balance) {
                // Decrement pending days
                $balance->decrement('pending_days', $leaveRequest->total_days);

                // If approved, increment used days
                if ($validated['status'] === 'approved') {
                    $balance->increment('used_days', $leaveRequest->total_days);
                }
            }
        });

        $message = $validated['status'] === 'approved'
            ? 'Leave request approved successfully.'
            : 'Leave request rejected.';

        return redirect()->back()->with('success', $message);
    }
}
