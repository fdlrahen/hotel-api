<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use App\Models\VenueReservation;
use App\Models\Venue;
use Carbon\Carbon;

class VenueReservationController extends Controller
{
    public function index(): JsonResponse
    {
        $venueReservations = VenueReservation::with('venue')->get();
        
        return response()->json([
            'success' => true,
            'message' => 'Data reservasi venue berhasil diambil',
            'data' => $venueReservations
        ]);
    }

    public function store(Request $request): JsonResponse
    {
        $request->validate([
            'guest_name' => 'required|string|max:255',
            'guest_phone' => 'required|string|max:20',
            'venue_id' => 'required|exists:venues,id',
            'start_date' => 'required|date|after_or_equal:today',
            'end_date' => 'required|date|after_or_equal:start_date',
            'status' => 'required|in:paid,unpaid'
        ]);

        // Get venue data
        $venue = Venue::findOrFail($request->venue_id);
        
        // Check availability
        $conflicts = VenueReservation::where('venue_id', $request->venue_id)
            ->where(function($query) use ($request) {
                $query->where('start_date', '<', $request->end_date)
                      ->where('end_date', '>', $request->start_date);
            })
            ->exists();

        if ($conflicts) {
            return response()->json([
                'success' => false,
                'message' => 'Venue tidak tersedia pada tanggal tersebut'
            ], 422);
        }

        // Calculate total price
        $startDate = Carbon::parse($request->start_date);
        $endDate = Carbon::parse($request->end_date);
        $daysCount = $startDate->diffInDays($endDate) + 1; // +1 include start_date
        $totalPrice = $daysCount * $venue->price_per_day;

        $venueReservation = VenueReservation::create([
            'guest_name' => $request->guest_name,
            'guest_phone' => $request->guest_phone,
            'venue_id' => $request->venue_id,
            'start_date' => $request->start_date,
            'end_date' => $request->end_date,
            'total_price' => $totalPrice,
            'status' => $request->status
        ]);

        $venueReservation->load('venue');
        $venueReservation->days_count = $daysCount;

        return response()->json([
            'success' => true,
            'message' => 'Reservasi venue berhasil dibuat',
            'data' => $venueReservation
        ], 201);
    }

    public function show($id): JsonResponse
    {
        $venueReservation = VenueReservation::with('venue')->find($id);

        if (!$venueReservation) {
            return response()->json([
                'success' => false,
                'message' => 'Reservasi venue tidak ditemukan'
            ], 404);
        }

        // Add days count to response
        $startDate = Carbon::parse($venueReservation->start_date);
        $endDate = Carbon::parse($venueReservation->end_date);
        $venueReservation->days_count = $startDate->diffInDays($endDate) + 1;

        return response()->json([
            'success' => true,
            'message' => 'Data reservasi venue berhasil diambil',
            'data' => $venueReservation
        ]);
    }

    public function update(Request $request, $id): JsonResponse
    {
        $venueReservation = VenueReservation::find($id);

        if (!$venueReservation) {
            return response()->json([
                'success' => false,
                'message' => 'Reservasi venue tidak ditemukan'
            ], 404);
        }

        $request->validate([
            'guest_name' => 'sometimes|required|string|max:255',
            'guest_phone' => 'sometimes|required|string|max:20',
            'venue_id' => 'sometimes|required|exists:venues,id',
            'start_date' => 'sometimes|required|date|after_or_equal:today',
            'end_date' => 'sometimes|required|date|after_or_equal:start_date',
            'status' => 'sometimes|required|in:paid,unpaid'
        ]);

        // If dates or venue changed, check availability and recalculate price
        if ($request->has(['start_date', 'end_date', 'venue_id'])) {
            $venueId = $request->venue_id ?? $venueReservation->venue_id;
            $startDate = $request->start_date ?? $venueReservation->start_date;
            $endDate = $request->end_date ?? $venueReservation->end_date;

            // Check availability (exclude current reservation)
            $conflicts = VenueReservation::where('venue_id', $venueId)
                ->where('id', '!=', $id)
                ->where(function($query) use ($startDate, $endDate) {
                    $query->where('start_date', '<', $endDate)
                          ->where('end_date', '>', $startDate);
                })
                ->exists();

            if ($conflicts) {
                return response()->json([
                    'success' => false,
                    'message' => 'Venue tidak tersedia pada tanggal tersebut'
                ], 422);
            }

            // Recalculate total price if needed
            if ($request->has(['start_date', 'end_date']) || $request->has('venue_id')) {
                $venue = Venue::findOrFail($venueId);
                $startDateCarbon = Carbon::parse($startDate);
                $endDateCarbon = Carbon::parse($endDate);
                $daysCount = $startDateCarbon->diffInDays($endDateCarbon) + 1;
                $request->merge(['total_price' => $daysCount * $venue->price_per_day]);
            }
        }

        $venueReservation->update($request->only([
            'guest_name', 'guest_phone', 'venue_id', 
            'start_date', 'end_date', 'total_price', 'status'
        ]));

        $venueReservation->load('venue');
        
        // Add days count to response
        $startDate = Carbon::parse($venueReservation->start_date);
        $endDate = Carbon::parse($venueReservation->end_date);
        $venueReservation->days_count = $startDate->diffInDays($endDate) + 1;

        return response()->json([
            'success' => true,
            'message' => 'Reservasi venue berhasil diupdate',
            'data' => $venueReservation
        ]);
    }

    public function destroy($id): JsonResponse
    {
        $venueReservation = VenueReservation::find($id);

        if (!$venueReservation) {
            return response()->json([
                'success' => false,
                'message' => 'Reservasi venue tidak ditemukan'
            ], 404);
        }

        $venueReservation->delete();

        return response()->json([
            'success' => true,
            'message' => 'Reservasi venue berhasil dihapus'
        ]);
    }

    // Check venue availability
    public function checkAvailability($venueId, Request $request): JsonResponse
    {
        $request->validate([
            'start_date' => 'required|date',
            'end_date' => 'required|date|after_or_equal:start_date'
        ]);

        $venue = Venue::find($venueId);
        if (!$venue) {
            return response()->json([
                'success' => false,
                'message' => 'Venue tidak ditemukan'
            ], 404);
        }

        $conflicts = VenueReservation::where('venue_id', $venueId)
            ->where(function($query) use ($request) {
                $query->where('start_date', '<', $request->end_date)
                      ->where('end_date', '>', $request->start_date);
            })
            ->with('venue')
            ->get();

        $available = $conflicts->isEmpty();

        return response()->json([
            'success' => true,
            'available' => $available,
            'message' => $available ? 'Venue tersedia' : 'Venue tidak tersedia',
            'conflicts' => $conflicts
        ]);
    }

    // Update payment status
    public function updatePaymentStatus(Request $request, $id): JsonResponse
    {
        $venueReservation = VenueReservation::find($id);

        if (!$venueReservation) {
            return response()->json([
                'success' => false,
                'message' => 'Reservasi venue tidak ditemukan'
            ], 404);
        }

        $request->validate([
            'status' => 'required|in:paid,unpaid'
        ]);

        $venueReservation->update(['status' => $request->status]);

        return response()->json([
            'success' => true,
            'message' => 'Status pembayaran berhasil diupdate',
            'data' => [
                'id' => $venueReservation->id,
                'status' => $venueReservation->status,
                'updated_at' => $venueReservation->updated_at
            ]
        ]);
    }
}
