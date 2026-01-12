<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreLeaveTypeRequest;
use App\Http\Requests\UpdateLeaveTypeRequest;
use App\Models\LeaveType;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class LeaveTypeController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(): Response
    {
        $leaveTypes = LeaveType::withCount('leaveRequests')
            ->latest()
            ->get();

        return Inertia::render('LeaveTypes/Index', [
            'leaveTypes' => $leaveTypes,
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create(): Response
    {
        $this->authorize('create', LeaveType::class);
        
        return Inertia::render('LeaveTypes/Create');
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreLeaveTypeRequest $request): RedirectResponse
    {
        LeaveType::create($request->validated());

        return redirect()->route('leave-types.index')
            ->with('success', 'Leave type created successfully.');
    }

    /**
     * Display the specified resource.
     */
    public function show(LeaveType $leaveType): Response
    {
        return Inertia::render('LeaveTypes/Show', [
            'leaveType' => $leaveType,
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(LeaveType $leaveType): Response
    {
        $this->authorize('update', $leaveType);
        
        return Inertia::render('LeaveTypes/Edit', [
            'leaveType' => $leaveType,
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateLeaveTypeRequest $request, LeaveType $leaveType): RedirectResponse
    {
        $this->authorize('update', $leaveType);
        
        $leaveType->update($request->validated());

        return redirect()->route('leave-types.index')
            ->with('success', 'Leave type updated successfully.');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(LeaveType $leaveType): RedirectResponse
    {
        $this->authorize('delete', $leaveType);

        // Check if there are any leave requests with this type
        $leaveRequestsCount = $leaveType->leaveRequests()->count();
        if ($leaveRequestsCount > 0) {
            return redirect()->route('leave-types.index')
                ->with('error', 'Cannot delete leave type. There are ' . $leaveRequestsCount . ' leave request(s) associated with this type.');
        }

        $leaveType->delete();

        return redirect()->route('leave-types.index')
            ->with('success', 'Leave type deleted successfully.');
    }
}
