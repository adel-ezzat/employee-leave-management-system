<?php

namespace App\Policies;

use App\Models\LeaveRequest;
use App\Models\User;

class LeaveRequestPolicy
{
    /**
     * Determine whether the user can view any models.
     */
    public function viewAny(User $user): bool
    {
        return true; // All authenticated users can view leave requests
    }

    /**
     * Determine whether the user can view the model.
     */
    public function view(User $user, LeaveRequest $leaveRequest): bool
    {
        // Users can view their own requests, managers can view their team's requests, admins can view all
        return $user->isAdmin() 
            || $leaveRequest->user_id === $user->id
            || ($user->isManager() && $leaveRequest->user->team_id === $user->team_id);
    }

    /**
     * Determine whether the user can create models.
     */
    public function create(User $user): bool
    {
        // Employees, managers, and admins can create leave requests
        return $user->isEmployee() || $user->isManager() || $user->isAdmin();
    }

    /**
     * Determine whether the user can update the model.
     */
    public function update(User $user, LeaveRequest $leaveRequest): bool
    {
        // Only pending requests can be updated, and only by the requester or admin
        return $leaveRequest->isPending() && (
            $user->isAdmin() || $leaveRequest->user_id === $user->id
        );
    }

    /**
     * Determine whether the user can delete the model.
     */
    public function delete(User $user, LeaveRequest $leaveRequest): bool
    {
        // Only pending requests can be deleted, and only by the requester or admin
        return $leaveRequest->isPending() && (
            $user->isAdmin() || $leaveRequest->user_id === $user->id
        );
    }

    /**
     * Determine whether the user can approve the leave request.
     */
    public function approve(User $user, LeaveRequest $leaveRequest): bool
    {
        // Only managers can approve requests for their team, or admins can approve any
        return $leaveRequest->isPending() && (
            $user->isAdmin() || 
            ($user->isManager() && $leaveRequest->user->team_id === $user->team_id && $leaveRequest->user->team->manager_id === $user->id)
        );
    }

    /**
     * Determine whether the user can reject the leave request.
     */
    public function reject(User $user, LeaveRequest $leaveRequest): bool
    {
        // Same as approve
        return $this->approve($user, $leaveRequest);
    }
}
