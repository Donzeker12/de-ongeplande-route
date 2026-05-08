<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Category;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Inertia\Inertia;
use Inertia\Response;

class CategoryController extends Controller
{
    public function index(Request $request): Response
    {
        $search = $request->query('search');

        $categories = Category::query()
            ->when($search, fn ($q) => $q->where('name', 'like', "%{$search}%"))
            ->withCount('outings')
            ->orderBy('sort_order')
            ->orderBy('name')
            ->paginate(30)
            ->withQueryString();

        return Inertia::render('Admin/Categories/Index', [
            'categories' => $categories,
            'filters' => ['search' => $search],
        ]);
    }

    public function create(): Response
    {
        return Inertia::render('Admin/Categories/Create');
    }

    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'name'        => 'required|string|max:100|unique:categories,name',
            'slug'        => 'nullable|string|max:100|unique:categories,slug',
            'emoji'       => 'nullable|string|max:10',
            'description' => 'nullable|string|max:500',
            'sort_order'  => 'integer|min:0',
        ]);

        if (empty($validated['slug'])) {
            $validated['slug'] = Str::slug($validated['name']);
        }

        $validated['emoji'] = $validated['emoji'] ?? '📍';

        Category::create($validated);

        return redirect()->route('admin.categories.index')
            ->with('success', "Categorie '{$validated['name']}' aangemaakt!");
    }

    public function edit(Category $category): Response
    {
        return Inertia::render('Admin/Categories/Edit', [
            'category' => $category,
        ]);
    }

    public function update(Request $request, Category $category): RedirectResponse
    {
        $validated = $request->validate([
            'name'        => "required|string|max:100|unique:categories,name,{$category->id}",
            'slug'        => "nullable|string|max:100|unique:categories,slug,{$category->id}",
            'emoji'       => 'nullable|string|max:10',
            'description' => 'nullable|string|max:500',
            'sort_order'  => 'integer|min:0',
        ]);

        if (empty($validated['slug'])) {
            $validated['slug'] = Str::slug($validated['name']);
        }

        $category->update($validated);

        return redirect()->route('admin.categories.index')
            ->with('success', "Categorie bijgewerkt!");
    }

    public function destroy(Category $category): RedirectResponse
    {
        $category->delete();

        return redirect()->route('admin.categories.index')
            ->with('success', "Categorie verwijderd!");
    }
}
