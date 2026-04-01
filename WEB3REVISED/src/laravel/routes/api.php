<?php

use App\Http\Controllers\ProductController;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application.
|
*/

// Product API Routes - RESTful
Route::apiResource('products', ProductController::class);

// This creates all these routes automatically:
// GET    /api/products       → index()   - List all products
// POST   /api/products       → store()   - Create new product
// GET    /api/products/{id}  → show()    - Show single product
// PUT    /api/products/{id}  → update()  - Update product
// DELETE /api/products/{id}  → destroy() - Delete product
