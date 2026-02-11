<!DOCTYPE html>
<html>
<head>
    <title>Liste des Produits</title>
    <style>
        body { font-family: Arial, sans-serif; margin: 20px; }
        table { border-collapse: collapse; width: 100%; }
        th, td { border: 1px solid #ddd; padding: 12px; text-align: left; }
        th { background-color: #4CAF50; color: white; }
        tr:nth-child(even) { background-color: #f2f2f2; }
    </style>
</head>
<body>
    <h1>Liste des Produits</h1>
    
    @if($products->count() > 0)
        <table>
            <thead>
                <tr>
                    <th>ID</th>
                    <th>Nom</th>
                    <th>Prix</th>
                    <th>Description</th>
                </tr>
            </thead>
            <tbody>
                @foreach($products as $product)
                    <tr>
                        <td>{{ $product->id }}</td>
                        <td>{{ $product->name }}</td>
                        <td>{{ $product->price }}€</td>
                        <td>{{ $product->description }}</td>
                    </tr>
                @endforeach
            </tbody>
        </table>
    @else
        <p>Aucun produit trouvé.</p>
    @endif
</body>
</html>
