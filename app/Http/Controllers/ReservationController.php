<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use App\Models\Reservation;
use App\Models\Room;
use Carbon\Carbon;

class ReservationController extends Controller
{
    public function index(): JsonResponse
    {
        $reservations = Reservation::with('room')->get();
        
        return response()->json([
            'success' => true,
            'message' => 'Data reservasi berhasil diambil',
            'data' => $reservations
        ]);
    }

    public function store(Request $request): JsonResponse
    {
        $request->validate([
            'guest_name' => 'required|string|max:255',
            'guest_phone' => 'required|string|max:20',
            'room_id' => 'required|exists:rooms,id',
            'check_in_date' => 'required|date|after_or_equal:today',
            'check_out_date' => 'required|date|after:check_in_date',
            'status' => 'required|in:paid,unpaid'
        ]);

        // Get room data
        $room = Room::findOrFail($request->room_id);
        
        // Check availability
        $conflicts = Reservation::where('room_id', $request->room_id)
            ->where(function($query) use ($request) {
                $query->where('check_in_date', '<', $request->check_out_date)
                      ->where('check_out_date', '>', $request->check_in_date);
            })
            ->exists();

        if ($conflicts) {
            return response()->json([
                'success' => false,
                'message' => 'Room tidak tersedia pada tanggal tersebut'
            ], 422);
        }

        $checkIn = Carbon::parse($request->check_in_date);
        $checkOut = Carbon::parse($request->check_out_date);
        $daysCount = $checkIn->diffInDays($checkOut);
        $totalPrice = $daysCount * $room->price_per_day;

        $reservation = Reservation::create([
            'guest_name' => $request->guest_name,
            'guest_phone' => $request->guest_phone,
            'room_id' => $request->room_id,
            'check_in_date' => $request->check_in_date,
            'check_out_date' => $request->check_out_date,
            'total_price' => $totalPrice,
            'status' => $request->status
        ]);

        $reservation->load('room');
        $reservation->days_count = $daysCount;

        return response()->json([
            'success' => true,
            'message' => 'Reservasi berhasil dibuat',
            'data' => $reservation
        ], 201);
    }

    public function show($id): JsonResponse
    {
        $reservation = Reservation::with('room')->find($id);

        if (!$reservation) {
            return response()->json([
                'success' => false,
                'message' => 'Reservasi tidak ditemukan'
            ], 404);
        }

        $checkIn = Carbon::parse($reservation->check_in_date);
        $checkOut = Carbon::parse($reservation->check_out_date);
        $reservation->days_count = $checkIn->diffInDays($checkOut);

        return response()->json([
            'success' => true,
            'message' => 'Data reservasi berhasil diambil',
            'data' => $reservation
        ]);
    }

    public function update(Request $request, $id): JsonResponse
    {
        $reservation = Reservation::find($id);

        if (!$reservation) {
            return response()->json([
                'success' => false,
                'message' => 'Reservasi tidak ditemukan'
            ], 404);
        }

        $request->validate([
            'guest_name' => 'sometimes|required|string|max:255',
            'guest_phone' => 'sometimes|required|string|max:20',
            'room_id' => 'sometimes|required|exists:rooms,id',
            'check_in_date' => 'sometimes|required|date|after_or_equal:today',
            'check_out_date' => 'sometimes|required|date|after:check_in_date',
            'status' => 'sometimes|required|in:paid,unpaid'
        ]);

        if ($request->has(['check_in_date', 'check_out_date', 'room_id'])) {
            $roomId = $request->room_id ?? $reservation->room_id;
            $checkInDate = $request->check_in_date ?? $reservation->check_in_date;
            $checkOutDate = $request->check_out_date ?? $reservation->check_out_date;

            $conflicts = Reservation::where('room_id', $roomId)
                ->where('id', '!=', $id)
                ->where(function($query) use ($checkInDate, $checkOutDate) {
                    $query->where('check_in_date', '<', $checkOutDate)
                          ->where('check_out_date', '>', $checkInDate);
                })
                ->exists();

            if ($conflicts) {
                return response()->json([
                    'success' => false,
                    'message' => 'Room tidak tersedia pada tanggal tersebut'
                ], 422);
            }

            if ($request->has(['check_in_date', 'check_out_date']) || $request->has('room_id')) {
                $room = Room::findOrFail($roomId);
                $checkIn = Carbon::parse($checkInDate);
                $checkOut = Carbon::parse($checkOutDate);
                $daysCount = $checkIn->diffInDays($checkOut);
                $request->merge(['total_price' => $daysCount * $room->price_per_day]);
            }
        }

        $reservation->update($request->only([
            'guest_name', 'guest_phone', 'room_id', 
            'check_in_date', 'check_out_date', 'total_price', 'status'
        ]));

        $reservation->load('room');
        
        $checkIn = Carbon::parse($reservation->check_in_date);
        $checkOut = Carbon::parse($reservation->check_out_date);
        $reservation->days_count = $checkIn->diffInDays($checkOut);

        return response()->json([
            'success' => true,
            'message' => 'Reservasi berhasil diupdate',
            'data' => $reservation
        ]);
    }

    public function destroy($id): JsonResponse
    {
        $reservation = Reservation::find($id);

        if (!$reservation) {
            return response()->json([
                'success' => false,
                'message' => 'Reservasi tidak ditemukan'
            ], 404);
        }

        $reservation->delete();

        return response()->json([
            'success' => true,
            'message' => 'Reservasi berhasil dihapus'
        ]);
    }

    public function checkAvailability($roomId, Request $request): JsonResponse
    {
        $request->validate([
            'check_in_date' => 'required|date',
            'check_out_date' => 'required|date|after:check_in_date'
        ]);

        $room = Room::find($roomId);
        if (!$room) {
            return response()->json([
                'success' => false,
                'message' => 'Room tidak ditemukan'
            ], 404);
        }

        $conflicts = Reservation::where('room_id', $roomId)
            ->where(function($query) use ($request) {
                $query->where('check_in_date', '<', $request->check_out_date)
                      ->where('check_out_date', '>', $request->check_in_date);
            })
            ->with('room')
            ->get();

        $available = $conflicts->isEmpty();

        return response()->json([
            'success' => true,
            'available' => $available,
            'message' => $available ? 'Room tersedia' : 'Room tidak tersedia',
            'conflicts' => $conflicts
        ]);
    }

    public function updatePaymentStatus(Request $request, $id): JsonResponse
    {
        $reservation = Reservation::find($id);

        if (!$reservation) {
            return response()->json([
                'success' => false,
                'message' => 'Reservasi tidak ditemukan'
            ], 404);
        }

        $request->validate([
            'status' => 'required|in:paid,unpaid'
        ]);

        $reservation->update(['status' => $request->status]);

        return response()->json([
            'success' => true,
            'message' => 'Status pembayaran berhasil diupdate',
            'data' => [
                'id' => $reservation->id,
                'status' => $reservation->status,
                'updated_at' => $reservation->updated_at
            ]
        ]);
    }
}
