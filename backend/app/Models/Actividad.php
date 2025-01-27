<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Actividad extends Model
{
    use HasFactory;
    protected $table = 'actividades'; 

    protected $fillable = [
        'titulo',
        'descripcion',
        'horario',
        'etapaEducativa',
        'cuota',
        'imagenActividad',
        'id_user',
    ];

    public function categorias(){
        return $this->belongsToMany(Categoria::class, 'actividades_categorias' ,'id_actividad', 'id_categoria');
    }

    public function alumnos(){
        return $this->belongsToMany(Alumno::class, 'actividades_alumnos', 'id_actividad', 'id_alumno')
                ->withPivot('estado', 'fecha');
    }

    public function usuarios(){
        return $this->belongsTo(User::class, 'id_user');
    }

    public static function search($query= ''){
        if(!$query){
            return self::all();
        }
        
        return self::where('titulo', 'like', "%$query%")
        ->orWhere('descripcion', 'like', "%$query%")
        ->orWhere('horario', 'like', "%$query%")
        ->orWhere('etapaEducativa', 'like', "%$query%")
        ->orWhere('cuota', 'like', "%$query%")
        ->get();
    }
}
