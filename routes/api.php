<?php

use App\Http\Controllers\RoomController;
use App\Http\Controllers\VenueController;
use App\Http\Controllers\ReservationController;
use App\Http\Controllers\VenueReservationController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');

// Routes untuk CRUD Room
Route::apiResource('rooms', RoomController::class);

// Routes untuk CRUD Venue
Route::apiResource('venues', VenueController::class);

// Routes untuk CRUD Reservasi
Route::apiResource('reservations', ReservationController::class);
Route::get('rooms/{room}/availability', [ReservationController::class, 'checkAvailability']);
Route::patch('reservations/{reservation}/payment-status', [ReservationController::class, 'updatePaymentStatus']);

// Routes untuk CRUD Venue Reservasi
Route::apiResource('venue-reservations', VenueReservationController::class);
Route::get('venues/{venue}/availability', [VenueReservationController::class, 'checkAvailability']);
Route::patch('venue-reservations/{venue_reservation}/payment-status', [VenueReservationController::class, 'updatePaymentStatus']);
