<?php

use App\Http\Controllers\RoomController;
use App\Http\Controllers\VenueController;
use App\Http\Controllers\ReservationController;
use App\Http\Controllers\VenueReservationController;
use App\Http\Controllers\ReportController;
use App\Http\Controllers\AuthController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

Route::post('login', [AuthController::class, 'login']);
Route::post('/register', [AuthController::class, 'register']);

Route::middleware('auth:sanctum')->group(function () {
    // Auth routes
    Route::post('logout', [AuthController::class, 'logout']);
    Route::get('me', [AuthController::class, 'me']);
    
    // Admin routes
    Route::middleware('role:admin')->group(function () {
        Route::post('register', [AuthController::class, 'register']);
        
        // Room management (admin only)
        Route::apiResource('rooms', RoomController::class);
        
        // Venue management (admin only)
        Route::apiResource('venues', VenueController::class);
    });
    
    Route::middleware('role:admin,resepsionis')->group(function () {
        // Dashboard/Reports
        Route::get('reports', [ReportController::class, 'summaryReport']);
        
        // Room reservations
        Route::apiResource('reservations', ReservationController::class);
        Route::get('rooms/{room}/availability', [ReservationController::class, 'checkAvailability']);
        Route::patch('reservations/{reservation}/payment-status', [ReservationController::class, 'updatePaymentStatus']);
        
        // Venue reservations
        Route::apiResource('venue-reservations', VenueReservationController::class);
        Route::get('venues/{venue}/availability', [VenueReservationController::class, 'checkAvailability']);
        Route::patch('venue-reservations/{venue_reservation}/payment-status', [VenueReservationController::class, 'updatePaymentStatus']);
        
        Route::get('rooms', [RoomController::class, 'index']);
        Route::get('venues', [VenueController::class, 'index']);
    });
});
