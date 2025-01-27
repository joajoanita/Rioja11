<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Categoria extends Model
{
    use HasFactory;
    protected $table = 'categorias';
    
    protected $fillable = [
        'nombre',
        'descripcion',
        'id_user',
    ];

    public function actividades(){
        return $this->belongsToMany(Actividad::class, 'actividades_categorias','id_categoria', 'id_actividad');
    }

    public function usuarios(){
        return $this->belongsTo(User::class, 'id_user');
    }

    public static function searchCategory($query= ''){
        if(!$query){
            return self::all();
        }
    
        return self::where('nombre', 'like', "%$query%")->get();
    }
}
