<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;


class Convenio extends Model
{
    protected $fillable = [
        'titulo',
        'entidad_firmante',
        'fecha_firma',
        'fecha_vencimiento',
        'estado',
        'riesgo',
        'descripcion',
        'archivo',
    ];
    public function versiones()
    {
        return $this->hasMany(ConvenioVersion::class);
    }
}