<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class LeaveType extends Model
{
    protected $fillable = [
        'name',
        'slug',
        'description',
        'is_paid',
        'max_days_per_year',
        'requires_medical_document',
        'is_active',
        'color',
    ];

    protected function casts(): array
    {
        return [
            'is_paid' => 'boolean',
            'requires_medical_document' => 'boolean',
            'is_active' => 'boolean',
            'max_days_per_year' => 'integer',
        ];
    }

    /**
     * Get all leave requests of this type
     */
    public function leaveRequests(): HasMany
    {
        return $this->hasMany(LeaveRequest::class);
    }

    /**
     * Get all leave balances for this type
     */
    public function leaveBalances(): HasMany
    {
        return $this->hasMany(LeaveBalance::class);
    }

    /**
     * Check if this leave type can be deleted
     * Can only be deleted if there are no leave requests associated with it
     */
    public function canBeDeleted(): bool
    {
        return $this->leaveRequests()->count() === 0;
    }

    /**
     * Get the count of leave requests for this type
     */
    public function getLeaveRequestsCountAttribute(): int
    {
        return $this->leaveRequests()->count();
    }
}
