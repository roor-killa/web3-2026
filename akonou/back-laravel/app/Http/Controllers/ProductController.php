<?php

namespace App\Http\Controllers;

use App\Models\Product;
use Illuminate\Http\Request;

class ProductController extends Controller
{
    /**
     * Get all products
     */
    public function index()
    {
        return response()->json([
            'data' => Product::all(),
            'message' => 'Products retrieved successfully'
        ]);
    }

    /**
     * Get a single product by ID
     */
    public function show($id)
    {
        $product = Product::find($id);

        if (!$product) {
            return response()->json([
                'message' => 'Product not found'
            ], 404);
        }

        return response()->json([
            'data' => $product,
            'message' => 'Product retrieved successfully'
        ]);
    }

    /**
     * Create a new product
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
            'price' => 'required|numeric|min:0',
            'quantity' => 'nullable|integer|min:0',
            'sku' => 'nullable|string|unique:products',
        ]);

        $product = Product::create($validated);

        return response()->json([
            'data' => $product,
            'message' => 'Product created successfully'
        ], 201);
    }

    /**
     * Update a product
     */
    public function update(Request $request, $id)
    {
        $product = Product::find($id);

        if (!$product) {
            return response()->json([
                'message' => 'Product not found'
            ], 404);
        }

        $validated = $request->validate([
            'name' => 'sometimes|string|max:255',
            'description' => 'nullable|string',
            'price' => 'sometimes|numeric|min:0',
            'quantity' => 'nullable|integer|min:0',
            'sku' => 'nullable|string|unique:products,sku,' . $id,
        ]);

        $product->update($validated);

        return response()->json([
            'data' => $product,
            'message' => 'Product updated successfully'
        ]);
    }

    /**
     * Delete a product
     */
    public function destroy($id)
    {
        $product = Product::find($id);

        if (!$product) {
            return response()->json([
                'message' => 'Product not found'
            ], 404);
        }

        $product->delete();

        return response()->json([
            'message' => 'Product deleted successfully'
        ]);
    }
}
