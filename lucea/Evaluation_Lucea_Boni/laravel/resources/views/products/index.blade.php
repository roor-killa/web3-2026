<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <title>Liste des produits</title>
    <style>
        body { font-family: Arial, sans-serif; margin: 20px; }
        table { border-collapse: collapse; width: 100%; }
        th, td { border: 1px solid #ccc; padding: 8px; text-align: left; }
        th { background-color: #f4f4f4; }
    </style>
</head>
<body>
    <h1>Liste des produits</h1>
    <table>
        <thead>
            <tr>
                <th>ID</th>
                <th>Titre</th>
                <th>Description</th>
                <th>Prix</th>
                <th>Date Création</th>
                <th>Date Update</th>
            </tr>
        </thead>
        <tbody>
            @foreach($products as $product)
            <tr>
                <td>{{ $product->id }}</td>
                <td>{{ $product->titre }}</td>
                <td>{{ $product->description }}</td>
                <td>{{ number_format($product->prix, 2, ',', ' ') }} €</td>
                <td>{{ $product->date_create }}</td>
                <td>{{ $product->date_update }}</td>
            </tr>
            @endforeach
        </tbody>
    </table>
</body>
</html>
