<?php

namespace App\Http\Controllers;

use Illuminate\Foundation\Application;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use Inertia\Response;

class HomeController extends Controller
{
    /**
     * Handle the home route
     */
    public function index(Request $request)
    {
        if (auth()->check()) {
            return redirect('/dashboard');
        }
        
        return redirect()->route('login');
    }
}

