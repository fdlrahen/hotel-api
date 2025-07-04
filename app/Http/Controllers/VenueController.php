<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use App\Models\Venue;
use Illuminate\Validation\Rule;

class VenueController extends Controller
{
    public function index(): JsonResponse
    {
        $venues = Venue::all();
        return response()->json([
            'success' => true,
            'message' => 'Data venue berhasil diambil',
            'data' => $venues
        ]);
    }

    public function store(Request $request): JsonResponse
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'capacity' => 'required|integer|min:1',
            'price_per_day' => 'required|numeric|min:0'
        ]);

        $venue = Venue::create([
            'name' => $request->name,
            'capacity' => $request->capacity,
            'price_per_day' => $request->price_per_day
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Venue berhasil dibuat',
            'data' => $venue
        ], 201);
    }

    public function show($id): JsonResponse
    {
        $venue = Venue::find($id);

        if (!$venue) {
            return response()->json([
                'success' => false,
                'message' => 'Venue tidak ditemukan'
            ], 404);
        }

        return response()->json([
            'success' => true,
            'message' => 'Data venue berhasil diambil',
            'data' => $venue
        ]);
    }

    public function update(Request $request, $id): JsonResponse
    {
        $venue = Venue::find($id);

        if (!$venue) {
            return response()->json([
                'success' => false,
                'message' => 'Venue tidak ditemukan'
            ], 404);
        }

        $request->validate([
            'name' => 'sometimes|required|string|max:255',
            'capacity' => 'sometimes|required|integer|min:1',
            'price_per_day' => 'sometimes|required|numeric|min:0'
        ]);

        $venue->update($request->only(['name', 'capacity', 'price_per_day']));

        return response()->json([
            'success' => true,
            'message' => 'Venue berhasil diupdate',
            'data' => $venue
        ]);
    }

    public function destroy($id): JsonResponse
    {
        $venue = Venue::find($id);

        if (!$venue) {
            return response()->json([
                'success' => false,
                'message' => 'Venue tidak ditemukan'
            ], 404);
        }

        $venue->delete();

        return response()->json([
            'success' => true,
            'message' => 'Venue berhasil dihapus'
        ]);
    }
}
