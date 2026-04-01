<!DOCTYPE html>
<html>
<head>
    <title>Produits</title>
</head>
<body>

<h1>Liste des produits</h1>

@foreach($products as $product)
    <div style="border:1px solid black; margin:10px; padding:10px;">
        <h2>{{ $product->name }}</h2>
        <p>Prix : {{ $product->price }} €</p>
    </div>
@endforeach

</body>
</html>
