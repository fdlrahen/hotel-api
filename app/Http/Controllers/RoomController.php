<?php

namespace App\Http\Controllers;

use App\Models\Room;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Validation\Rule;

class RoomController extends Controller
{
    public function index(): JsonResponse
    {
        $rooms = Room::all();
        return response()->json([
            'success' => true,
            'message' => 'Data ruangan berhasil diambil',
            'data' => $rooms
        ]);
    }
    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'room_number' => 'required|string|unique:rooms,room_number',
            'price_per_day' => 'required|numeric|min:0',
            'room_type' => ['required', Rule::in(['Standard', 'Deluxe'])]
        ]);

        $room = Room::create($validated);

        return response()->json([
            'success' => true,
            'message' => 'Ruangan berhasil ditambahkan',
            'data' => $room
        ], 201);
    }
    public function show(string $id): JsonResponse
    {
        $room = Room::find($id);

        if (!$room) {
            return response()->json([
                'success' => false,
                'message' => 'Ruangan tidak ditemukan'
            ], 404);
        }

        return response()->json([
            'success' => true,
            'message' => 'Data ruangan berhasil diambil',
            'data' => $room
        ]);
    }
    public function update(Request $request, string $id): JsonResponse
    {
        $room = Room::find($id);

        if (!$room) {
            return response()->json([
                'success' => false,
                'message' => 'Ruangan tidak ditemukan'
            ], 404);
        }

        $validated = $request->validate([
            'room_number' => ['sometimes', 'string', Rule::unique('rooms', 'room_number')->ignore($id)],
            'price_per_day' => 'sometimes|numeric|min:0',
            'room_type' => ['sometimes', Rule::in(['Standard', 'Deluxe'])]
        ]);

        $room->update($validated);

        return response()->json([
            'success' => true,
            'message' => 'Ruangan berhasil diperbarui',
            'data' => $room->fresh()
        ]);
    }
    public function destroy(string $id): JsonResponse
    {
        $room = Room::find($id);

        if (!$room) {
            return response()->json([
                'success' => false,
                'message' => 'Ruangan tidak ditemukan'
            ], 404);
        }

        $room->delete();

        return response()->json([
            'success' => true,
            'message' => 'Ruangan berhasil dihapus'
        ]);
    }
}
