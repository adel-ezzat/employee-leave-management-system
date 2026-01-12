<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class LeaveBalance extends Model
{
    protected $fillable = [
        'user_id',
        'leave_type_id',
        'total_days',
        'used_days',
        'pending_days',
        'year',
    ];

    protected function casts(): array
    {
        return [
            'total_days' => 'integer',
            'used_days' => 'integer',
            'pending_days' => 'integer',
            'year' => 'integer',
        ];
    }

    /**
     * Get the user
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    /**
     * Get the leave type
     */
    public function leaveType(): BelongsTo
    {
        return $this->belongsTo(LeaveType::class);
    }

    /**
     * Get available days (total - used - pending)
     */
    public function getAvailableDaysAttribute(): int
    {
        return max(0, $this->total_days - $this->used_days - $this->pending_days);
    }
}
