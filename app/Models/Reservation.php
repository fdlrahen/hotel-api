<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Reservation extends Model
{
    protected $fillable = [
        'guest_name',
        'guest_phone',
        'room_id',
        'check_in_date',
        'check_out_date',
        'total_price',
        'status'
    ];

    protected $casts = [
        'check_in_date' => 'date',
        'check_out_date' => 'date',
        'total_price' => 'decimal:2'
    ];

    public function room(): BelongsTo
    {
        return $this->belongsTo(Room::class);
    }
}
