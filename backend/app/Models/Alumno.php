<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Alumno extends Model
{
    use HasFactory;
    protected $table = 'alumnos';
    
    protected $fillable = [
        'nombre',
        'apellidos',
        'nombreAdultoResponsable',
        'apellidoAdultoResponsable',
        'telefonoAdultoResponsable',
        'emailAdultoResponsable',
    ];

    public function actividades(){
        return  $this->belongsToMany(Actividad::class, 'actividades_alumnos' ,'id_alumno', 'id_actividad')
                ->withPivot('estado', 'fecha');
    }

    public static function searchStudent($query= ''){
        if(!$query){
            return self::all();
        }
        
        return self::where('nombre', 'like', "%$query%")
        ->orWhere('apellidos', 'like', "%$query%")
        ->orWhere('nombreAdultoResponsable', 'like', "%$query%")
        ->orWhere('apellidoAdultoResponsable', 'like', "%$query%")
        ->orWhere('emailAdultoResponsable', 'like', "%$query%")
        ->get();
    }
}
