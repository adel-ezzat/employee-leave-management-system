<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreLeaveTypeRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return $this->user()->can('create', \App\Models\LeaveType::class);
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'name' => ['required', 'string', 'max:255'],
            'slug' => ['required', 'string', 'max:255', 'unique:leave_types,slug'],
            'description' => ['nullable', 'string', 'max:1000'],
            'is_paid' => ['boolean'],
            'max_days_per_year' => ['nullable', 'integer', 'min:1'],
            'requires_medical_document' => ['boolean'],
            'color' => ['nullable', 'string', 'max:7'],
        ];
    }
}
