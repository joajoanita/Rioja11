<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\AdminController;
use App\Http\Controllers\ActivityController;

Route::group([
    'middleware' => 'api',
    'prefix' => 'auth'
], function ($router) {
    Route::post('/login',       [AuthController::class, 'login']);
    Route::post('/register', [AuthController::class, 'register']); 
    Route::post('/logout',      [AuthController::class, 'logout']);
    Route::post('/refresh',     [AuthController::class, 'refresh']);
    Route::get('/userProfile', [AuthController::class, 'userProfile'])->middleware('auth:api');
});

Route::group([
    'middleware' => 'api',
    'prefix' => 'admin'
], function ($router) {
    Route::get('/indexActivities',                  [AdminController::class, 'indexActivities']);
    Route::get('/index',                            [AdminController::class, 'indexStudents']);
    Route::get('/indexMatriculations',              [AdminController::class, 'indexMatriculations']);
    Route::put('/index/{idActivity}/{idStudent}',   [AdminController::class, 'stateActivity']);
    Route::post('/createActivity',                  [AdminController::class, 'createActivity']);
    Route::put('/updateActivity/{id}',              [AdminController::class, 'updateActivity']);
    Route::delete('/deleteActivity/{id}',           [AdminController::class, 'deleteActivity']);
    Route::post('/createCategory',                  [AdminController::class, 'createCategory']);
    Route::put('/updateCategory/{id}',              [AdminController::class, 'updateCategory']);
    Route::delete('/deleteCategory/{id}',           [AdminController::class, 'deleteCategory']);
    Route::get('/indexCategories',                  [AdminController::class, 'indexCategory']);      
    Route::delete('/deleteStudents/{id}',           [AdminController::class, 'deleteStudents']);       
});

Route::group([
    'middleware' => 'api',
    'prefix' => 'user'
], function ($router) {
    Route::get('/indexActivities',                      [ActivityController::class, 'indexActivities']);
    Route::get('/activityDetail/{id}',                  [ActivityController::class, 'activityDetail']);
    Route::post('/matriculateActivity',                 [ActivityController::class, 'matriculateActivity']);
    Route::get('/showActivitiesCategory',               [ActivityController::class, 'showActivitiesCategory']);

});