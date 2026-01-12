<?php

namespace App\Http\Requests;

use Carbon\Carbon;
use Illuminate\Foundation\Http\FormRequest;

class StoreLeaveRequestRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return $this->user()->can('create', \App\Models\LeaveRequest::class);
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'leave_type_id' => ['required', 'exists:leave_types,id'],
            'start_date' => ['required', 'date', 'after_or_equal:today'],
            'end_date' => ['required', 'date', 'after_or_equal:start_date'],
            'reason' => ['nullable', 'string', 'max:1000'],
        ];
    }

    /**
     * Configure the validator instance.
     */
    public function withValidator($validator): void
    {
        $validator->after(function ($validator) {
            $startDate = Carbon::parse($this->start_date);
            $endDate = Carbon::parse($this->end_date);
            $totalDays = $startDate->diffInDays($endDate) + 1;

            // Check if leave type exists and is active
            $leaveType = \App\Models\LeaveType::find($this->leave_type_id);
            if ($leaveType && ! $leaveType->is_active) {
                $validator->errors()->add('leave_type_id', 'The selected leave type is not active.');
            }

            // Check max days per year
            if ($leaveType && $leaveType->max_days_per_year && $totalDays > $leaveType->max_days_per_year) {
                $validator->errors()->add('end_date', "Maximum days allowed for this leave type is {$leaveType->max_days_per_year} days.");
            }

            // Check available balance (only for paid leave types)
            $user = $this->user();
            $year = now()->year;
            $balance = \App\Models\LeaveBalance::where('user_id', $user->id)
                ->where('leave_type_id', $this->leave_type_id)
                ->where('year', $year)
                ->first();

            if ($balance && $leaveType && $leaveType->is_paid) {
                $available = $balance->available_days;
                if ($totalDays > $available) {
                    $validator->errors()->add('end_date', "You only have {$available} days available for this leave type.");
                }
            }

            // Check for overlapping leaves
            $overlapping = \App\Models\LeaveRequest::where('user_id', $user->id)
                ->where('status', 'approved')
                ->where(function ($query) use ($startDate, $endDate) {
                    $query->whereBetween('start_date', [$startDate, $endDate])
                        ->orWhereBetween('end_date', [$startDate, $endDate])
                        ->orWhere(function ($q) use ($startDate, $endDate) {
                            $q->where('start_date', '<=', $startDate)
                                ->where('end_date', '>=', $endDate);
                        });
                })
                ->exists();

            if ($overlapping) {
                $validator->errors()->add('start_date', 'You have an overlapping approved leave request.');
            }
        });
    }
}
