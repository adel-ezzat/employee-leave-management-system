<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateLeaveTypeRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        $leaveType = $this->route('leave_type');
        return $this->user()->can('update', $leaveType);
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        $leaveType = $this->route('leave_type');
        
        return [
            'name' => ['sometimes', 'required', 'string', 'max:255'],
            'slug' => ['sometimes', 'required', 'string', 'max:255', Rule::unique('leave_types', 'slug')->ignore($leaveType->id)],
            'description' => ['nullable', 'string', 'max:1000'],
            'is_paid' => ['sometimes', 'boolean'],
            'max_days_per_year' => ['nullable', 'integer', 'min:1'],
            'requires_medical_document' => ['sometimes', 'boolean'],
            'has_balance' => ['sometimes', 'boolean'],
            'visible_to_employees' => ['sometimes', 'boolean'],
            'color' => ['nullable', 'string', 'max:7'],
            'is_active' => ['sometimes', 'boolean'],
        ];
    }
}
