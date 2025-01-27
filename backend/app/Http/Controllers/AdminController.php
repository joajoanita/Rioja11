<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Actividad;
use App\Models\Categoria;
use App\Models\Alumno;
use Illuminate\Support\Facades\Auth;
use Validator;

class AdminController extends Controller
{
    // Aquí irá lo que podrá hacer el admin:

    /*
        1. Indexar todas las matriculaciones con los datos de cada usuario.
        2. Crear actividades.
        3. Modificar actividades.
        4. Eliminar actividades.
        5. Añadir categorías.
        6. Modificar categorías.
        7. Eliminar categorías.
        8. Cambiar el estado de las actividades
    */


    //Errores que nos podemos encontrar:

    /*
        1. Error del $validator --> 400.
        2. Error not found --> 404.
        3. Error de que algo no existe (no una página) --> 500
    */

    // 1. Indexamos todas las matriculaciones

    public function indexActivities(){
        $activities = Actividad::all();
        //Cogemos cada actividad y le establecemos a $activity la función que recoge a los alumnos con el estado en "Aceptada" y lo cuenta.
        $activities->each(function ($activity) {
            $activity->acceptedCount = $activity->alumnos()->wherePivot('estado', 'Aceptada')->count();
        });
        
        return response()->json($activities, 200);

    }

    public function indexStudents(Request $request){
        $matriculation = Alumno::searchStudent($request->buscar);
        return response()->json($matriculation, 200);
    }

    // 2. Creamos actividades
    public function createActivity(Request $request){
     
        $validator = Validator::make($request->all(),[
            'titulo' => 'required|string|max:255',
            'descripcion' => 'required|string|max:500',
            'horario' => 'required|string|max:255',
            'etapaEducativa' => 'required|string|max:255',
            'cuota' => 'required|numeric|min:0.01',
            'imagenActividad' => 'nullable|image|mimes:jpg,jpeg,png|max:2048',
            'categorias' => 'required|array',  
            'categorias.*' => 'string|max:255',
        ]);

        if ($validator->fails()){
            return response()->json($validator->errors()->toJson(),400);
        }

        try{
            $image = null;
            if ($request->hasFile('imagenActividad')) {
                $image = time().'.'.$request->imagenActividad->extension();
                $request->imagenActividad->move(public_path('images/activities'), $image);
            }

            $admin = Auth::id();

            $activity = Actividad::create([
                'titulo' => $request->titulo,
                'descripcion' => $request->descripcion,
                'horario' => $request->horario,
                'etapaEducativa' => $request->etapaEducativa,
                'cuota' => $request->cuota,
                'imagenActividad' => $image,
                'id_user' => $admin,
            ]);
            
            /*
                Como tenemos una tabla pivote, tenemos que meter ahí también 
                    la información. Aquí lo que haremos es meter por campos 
                    el nombre de la actividad y buscaremos su id para asignarla
                    en la tabla de actividades_categorias.
            */

            if ($request->has('categorias')) {
                foreach ($request->categorias as $categoryName) {
                    // Buscamos según el nombre que hemos metido su id
                    $categoria = Categoria::where('nombre', $categoryName)->first();
                    
                    // Si existe la categoría, se lo asignamos
                    if($categoria){ 
                        $activity->categorias()->toggle($categoria->id);
                    } else {
                        // Sino, da error.
                        return response()->json(['message' => 'No existe la categoría'], 503);
                    }
                }
            }

            return response()->json(['message' => 'La actividad ha sido creada con éxito', 'actividad' => $activity ,200]);
        } catch (\Exception $exception) {
            return response()->json(['message' => 'No se ha podido crear la actividad', 'error' => $exception->getMessage()], 500);
        }
    }

    // 3. Modificamos las actividades
    public function updateActivity($id, Request $request){
        $activity = Actividad::find($id);
        
        if (!$activity) {
            return response()->json(['error' => 'Activity not found'], 404);
        }

        $activity->titulo = $request->titulo;
        $activity->descripcion = $request->descripcion;
        $activity->horario = $request->horario;
        $activity->etapaEducativa = $request->etapaEducativa;
        $activity->cuota = $request->cuota;
        $activity->imagenActividad = $request->imagenActividad;
        $activity->update();
    }

    // 4. Eliminamos las actividades
    public function deleteActivity($id){
        $activity = Actividad::find($id);

        if(!$activity){
            return response()->json(['error' => 'No se ha encontrado la actividad buscada'], 404);
        }

        /*
            Como queremos que al eliminar la actividad, se elimine de la
                base de datos también la imagen, tendremos que hacer lo
                siguiente:
        */

        //Le asignamos a la variable $image el valor de la imagen almacenada
        $image = $activity->imagenActividad;
        //Recogemos la ruta donde se está almacenando
        $imagePath = public_path('images/activities/' . $image);

        //Ahora tenemos que ver si existe para poder eliminarlo
        if($image && file_exists($imagePath)){
            if(!unlink($imagePath)){
                return response()->json(['message' => 'No se ha podido eliminar la imagen'], 500);
            }
        }

        $activity->delete();
        return response()->json(['message' => 'La actividad se ha eliminado con éxito'], 200);
    }

    // 5. Indexamos las categorías
    public function indexCategory(){
        $categories = Categoria::all();
        return response()->json($categories, 200);
    }

    // 6. Crear categorías
    public function createCategory(Request $request){
        $validator = Validator::make($request->all(),[
            'nombre' => 'required|string|max:255',
            'descripcion' => 'required|string|max:500',
        ]);

        if($validator->fails()){
            return response()->json($validator->errors()->toJson(),400);
        }

        $admin = Auth::id();

        $category = Categoria::create([
            'nombre' => $request->nombre,
            'descripcion' => $request->descripcion,
            'id_user' => $admin,
        ]);

        return response()->json(['message' => 'Categoría creada con éxito'], 200);
    }

    // 7. Modificar categorías
    public function updateCategory($id, Request $request){
        $category = Categoria::find($id);

        if(!$category){
            return response(['error' => 'No se ha encontrado la categoria'], 404);
        }

        $category->nombre = $request->nombre;
        $category->descripcion = $request->descripcion;
        $category->update();
        return response()->json(['message' => 'Categoría editada con éxito'], 200);
    }

    // 8. Eliminar categorías
    public function deleteCategory($id){
        $category = Categoria::find($id);

        if(!$category){
            return response(['error' => 'No se ha encontrado la categoria'], 500);
        }

        $category->delete();
        return response()->json(['message' => 'Categoría borrada con éxito'], 200);
    }

    // 9. Cambiar el estado de las actividades (Aceptadas o Denegadas)
    
    public function stateActivity(Request $request, $idActivity, $idStudent){
        
        $validator = Validator::make($request->all(),[
            'estado' => 'required|in:Aceptada,Rechazada',
        ]);

        if ($validator->fails()){
            return response()->json($validator->errors()->toJson(), 400);
        }

        $activity = Actividad::find($idActivity);
        $student = $activity->alumnos()->where('id', $idStudent)->first();

        if (!$student) {
            return response()->json(['message' => 'El alumno no está inscrito en esta actividad.'], 404);
        }

        if($request->estado === 'Aceptada'){
            $count = $activity->alumnos()->wherePivot('estado', 'Aceptada')->count();
            $this->acceptedCount = $count;

            if($count>= 15){
                return response()->json([
                    'message' => 'Solo puede haber 15 personas inscritas en esta actividad.'
                ], 400);
            }
        }

      

        $activity->alumnos()->updateExistingPivot($idStudent, ['estado' => $request->estado]);

        return response()->json([
            'message' => 'Estado actualizado con éxito',
            'actividad_id' => $idActivity,
            'alumno_id' => $idStudent,
            'estado' => $request->estado,
            'aceptados' => $request->estado === 'Aceptada' ? $count + 1 : $count,
        ]);
    }

    // 10. Indexar matriculaciones
    public function indexMatriculations(){
        $alumnos = Alumno::with('actividades')->get()->map(function($alumno) {
            return $alumno->actividades->map(function($actividad) {
                return $actividad->pivot; 
            });
        });

        return response()->json($alumnos);
    }

    // 11. Eliminar alumnos
    public function deleteStudents($id){
        $student = Alumno::find($id);
        $student->delete();
    }
}
