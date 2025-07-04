<?php

use App\Http\Controllers\RoomController;
use App\Http\Controllers\VenueController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');

// Routes untuk CRUD Room
Route::apiResource('rooms', RoomController::class);

// Routes untuk CRUD Venue
Route::apiResource('venues', VenueController::class);
