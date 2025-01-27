<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Actividad;
use App\Models\Alumno;
use App\Models\Categoria;
use Carbon\Carbon;
use Validator;

class ActivityController extends Controller
{
    // Aquí irá todo lo que está relacionado con las actividades

    /*
        1. Indexar las actividades existentes
        2. Mostrar cada actividad detalladamente a los usuarios
        3. Solicitud de matricularse a las actividades mediante un formulario
    */

    // 1. Indexar TODAS las actividades existentes
    public function indexActivities(Request $request){
        $activities = Actividad::search($request->buscar);
        return response()->json($activities, 200);
    }

    // 2. Mostrar los detalless de cada actividad
    public function activityDetail($id){
        $activity = Actividad::with('categorias')->find($id);

        //Si no existe la actividad, nos dará un mensaje de que no ha sido encontrada
        if(!$activity){
            return response()->json(['message' => 'Actividad no encontrada'],404);
        } else {
            return response()->json($activity);
        }
    }

    // 3. Solicitar matricularse a las actividades
    public function matriculateActivity(Request $request){
        $validator = Validator::make($request->all(), [
            'nombre' => 'required|string|max:255',
            'apellidos' => 'required|string|max:255',
            'nombreAdultoResponsable' => 'required|string|max:255',
            'apellidoAdultoResponsable' => 'required|string|max:255',
            'telefonoAdultoResponsable' => 'required|digits_between:9,15',
            'emailAdultoResponsable' => 'required|email|max:255',
            'actividades' => 'required|integer|exists:actividades,id'
        ]);

        if ($validator->fails()){
            return response()->json($validator->errors()->toJson(), 400);
        }

        $student = Alumno::create([
            'nombre' => $request->nombre,
            'apellidos' => $request->apellidos,
            'nombreAdultoResponsable' => $request->nombreAdultoResponsable,
            'apellidoAdultoResponsable' => $request->apellidoAdultoResponsable,
            'telefonoAdultoResponsable' => $request->telefonoAdultoResponsable,
            'emailAdultoResponsable' => $request->emailAdultoResponsable,
        ]);
        
        if ($request->has('actividades')) {
            $date = Carbon::now()->isoFormat('dddd D \d\e MMMM \d\e\l Y');
    
            // Obtener el ID de la actividad (en lugar de un array, es un solo valor)
            $actividadId = $request->input('actividades');
    
            // Buscar la actividad con el ID recibido
            $activity = Actividad::find($actividadId);
    
            if ($activity) {
                // Asignamos la actividad al estudiante
                $student->actividades()->attach($activity->id, [
                    'estado' => 'Pendiente',
                    'fecha' => $date
                ]);
    
                return response()->json(['message' => 'Alumno inscrito con éxito'], 200);
            } else {
                // Si no existe la actividad, retornamos un error
                return response()->json(['message' => 'Actividad no encontrada'], 404);
            }
        }
    }

    public function showActivitiesCategory(Request $request){
        
        $request->validate([
            'buscar' => 'required|string'
        ]);

        $category = Categoria::where('nombre', $request->buscar)->first();
        
        if (!$category) {
            return response()->json([
                'message' => 'Categoría no encontrada.'
            ], 404);
        }

        $activities = $category->actividades;

        return response()->json([
            'category' => $category->nombre,
            'activities' => $activities
        ], 200);
    }
}

