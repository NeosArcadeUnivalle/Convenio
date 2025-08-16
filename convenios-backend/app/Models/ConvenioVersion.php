<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ConvenioVersion extends Model
{
    use HasFactory;
    protected $table = 'convenio_versiones';

    protected $fillable = [
        'convenio_id',
        'archivo',
        'descripcion',
    ];

    public function convenio()
    {
        return $this->belongsTo(Convenio::class);
    }
}