<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Reservation;
use App\Models\VenueReservation;
use App\Models\Room;
use App\Models\Venue;
use Carbon\Carbon;

class ReportController extends Controller
{
    public function summaryReport()
    {
        $today = Carbon::today();
        $thisMonth = Carbon::now()->startOfMonth();
        $thisYear = Carbon::now()->startOfYear();

        // Statistik hari ini
        $todayStats = [
            'room_reservations' => Reservation::whereDate('created_at', $today)->count(),
            'venue_reservations' => VenueReservation::whereDate('created_at', $today)->count(),
            'revenue' => Reservation::whereDate('created_at', $today)->where('status', 'paid')->sum('total_price') +
                        VenueReservation::whereDate('created_at', $today)->where('status', 'paid')->sum('total_price')
        ];

        // Statistik bulan ini
        $monthStats = [
            'room_reservations' => Reservation::where('created_at', '>=', $thisMonth)->count(),
            'venue_reservations' => VenueReservation::where('created_at', '>=', $thisMonth)->count(),
            'revenue' => Reservation::where('created_at', '>=', $thisMonth)->where('status', 'paid')->sum('total_price') +
                        VenueReservation::where('created_at', '>=', $thisMonth)->where('status', 'paid')->sum('total_price')
        ];

        // Statistik tahun ini
        $yearStats = [
            'room_reservations' => Reservation::where('created_at', '>=', $thisYear)->count(),
            'venue_reservations' => VenueReservation::where('created_at', '>=', $thisYear)->count(),
            'revenue' => Reservation::where('created_at', '>=', $thisYear)->where('status', 'paid')->sum('total_price') +
                        VenueReservation::where('created_at', '>=', $thisYear)->where('status', 'paid')->sum('total_price')
        ];

        return response()->json([
            'status' => 'success',
            'data' => [
                'today' => $todayStats,
                'this_month' => $monthStats,
                'this_year' => $yearStats,
                'totals' => [
                    'total_rooms' => Room::count(),
                    'total_venues' => Venue::count(),
                    'total_reservations' => Reservation::count() + VenueReservation::count(),
                    'total_revenue' => Reservation::where('status', 'paid')->sum('total_price') + 
                                      VenueReservation::where('status', 'paid')->sum('total_price')
                ]
            ]
        ]);
    }
}
