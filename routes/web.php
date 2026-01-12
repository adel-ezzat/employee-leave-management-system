<?php

use App\Http\Controllers\ProfileController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    if (Auth::check()) {
        return redirect()->route('dashboard');
    }
    
    return Inertia::render('Welcome', [
        'canLogin' => Route::has('login'),
        'canRegister' => Route::has('register'),
        'laravelVersion' => Application::VERSION,
        'phpVersion' => PHP_VERSION,
    ]);
});

Route::get('/dashboard', [App\Http\Controllers\DashboardController::class, 'index'])
    ->middleware(['auth', 'verified'])
    ->name('dashboard');

Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');

    // Leave Requests
    Route::resource('leave-requests', App\Http\Controllers\LeaveRequestController::class);
    Route::post('leave-requests/{leaveRequest}/approve', [App\Http\Controllers\LeaveRequestController::class, 'approve'])
        ->name('leave-requests.approve');

    // Teams (Admin only)
    Route::resource('teams', App\Http\Controllers\TeamController::class)
        ->middleware('can:viewAny,App\Models\Team');

    // Leave Types (Admin only)
    Route::resource('leave-types', App\Http\Controllers\LeaveTypeController::class)
        ->middleware('can:viewAny,App\Models\LeaveType');

    // Users (Admin only)
    Route::resource('users', App\Http\Controllers\UserController::class)
        ->middleware('can:viewAny,App\Models\User');

    // Leave Balances
    Route::get('leave-balances', [App\Http\Controllers\LeaveBalanceController::class, 'index'])
        ->name('leave-balances.index');
    Route::post('leave-balances', [App\Http\Controllers\LeaveBalanceController::class, 'store'])
        ->name('leave-balances.store');
    Route::patch('leave-balances/{leaveBalance}', [App\Http\Controllers\LeaveBalanceController::class, 'update'])
        ->name('leave-balances.update');
    Route::post('leave-balances/set-global-limits', [App\Http\Controllers\LeaveBalanceController::class, 'setGlobalLimits'])
        ->name('leave-balances.set-global-limits');
});

require __DIR__.'/auth.php';
