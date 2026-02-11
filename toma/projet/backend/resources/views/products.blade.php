
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Products Laravel Side</title>
</head>
<body>
    <h1>Les produits</h1>
    <div>
        <table>
            <thead>
                <tr>
                    <th>ID</th>
                    <th>Titre</th>
                    <th>Description</th>
                    <th>Prix</th>
                    <th>Created_at</th>
                    <th>Updated_at</th>
                </tr>
            </thead>
            
            <tbody id='table_content'>
                <tr>
                    <td>Idk</td>
                    <td>Idk</td>
                    <td>Idk</td>
                    <td>Idk</td>
                    <td>Idk</td>
                    <td>Idk</td>
                </tr>
            </tbody>
        </table>
    </div>


    <script>
        console.log("Test");
        let table_content = document.getElementById('table_content');
        fetch('/api/products').
        then(response => response.json())
        .then(data => {
            console.log(data)
            if (data) {
                for (let product of data) {
                    let new_row = document.createElement('tr')
                    for (let value of Object.values(product)) {
                        let new_td = document.createElement('td')
                        new_td.innerText = value
                        new_row.appendChild(new_td)
                    }
                    console.log(new_row)
                    table_content.appendChild(new_row)
                }
            }
        })
    </script>
</body>
</html>