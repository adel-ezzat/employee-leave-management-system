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
        $leaveType = \App\Models\LeaveType::find($this->leave_type_id);
        $requiresDocument = $leaveType && $leaveType->requires_medical_document;

        $user = $this->user();
        $rules = [
            'leave_type_id' => ['required', 'exists:leave_types,id'],
            'start_date' => ['required', 'date', 'after_or_equal:today'],
            'end_date' => ['required', 'date', 'after_or_equal:start_date'],
            'reason' => ['nullable', 'string', 'max:1000'],
            'document' => $requiresDocument 
                ? ['required', 'file', 'mimes:pdf,jpg,jpeg,png', 'max:10240'] 
                : ['nullable', 'file', 'mimes:pdf,jpg,jpeg,png', 'max:10240'],
        ];

        // Admin and manager can select a user
        if ($user->isAdmin() || $user->isManager()) {
            $rules['user_id'] = ['nullable', 'exists:users,id'];
        }

        return $rules;
    }

    /**
     * Get custom messages for validator errors.
     */
    public function messages(): array
    {
        return [
            'document.required' => 'A medical document is required for this leave type.',
            'document.file' => 'The document must be a valid file.',
            'document.mimes' => 'The document must be a PDF, JPG, JPEG, or PNG file.',
            'document.max' => 'The document must not be larger than 10MB.',
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

            // Determine target user (selected user for admin/manager, or current user)
            $currentUser = $this->user();
            $targetUserId = $this->user_id ?? $currentUser->id;
            
            // Verify manager can only create requests for their team
            if ($currentUser->isManager() && $this->user_id) {
                $targetUser = \App\Models\User::find($this->user_id);
                if ($targetUser && $targetUser->team_id !== $currentUser->team_id) {
                    $validator->errors()->add('user_id', 'You can only create leave requests for members of your team.');
                }
            }

            // Check available balance (only for paid leave types)
            $year = now()->year;
            $balance = \App\Models\LeaveBalance::where('user_id', $targetUserId)
                ->where('leave_type_id', $this->leave_type_id)
                ->where('year', $year)
                ->first();

            if ($balance && $leaveType && $leaveType->is_paid) {
                $available = $balance->available_days;
                if ($totalDays > $available) {
                    $targetUser = \App\Models\User::find($targetUserId);
                    $userName = $targetUser ? $targetUser->name : 'User';
                    $validator->errors()->add('end_date', "{$userName} only has {$available} days available for this leave type.");
                }
            }

            // Check for overlapping leaves
            $overlapping = \App\Models\LeaveRequest::where('user_id', $targetUserId)
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
                $targetUser = \App\Models\User::find($targetUserId);
                $userName = $targetUser ? $targetUser->name : 'User';
                $validator->errors()->add('start_date', "{$userName} has an overlapping approved leave request.");
            }
        });
    }
}
