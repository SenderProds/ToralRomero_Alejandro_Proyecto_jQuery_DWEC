$(() => {



    $("#btnPrincipal").click((e) => {
        console.log('Prueba');
    });

    let url = 'https://catfact.ninja/breeds';
    $.get(
        url,
        (respuesta, estado, xml) => {
          //console.log(estado, xml.status, xml.statusText);
          //console.log(xml.responseText);
          console.log(respuesta);
          respuesta.forEach((producto) => {
            console.log(producto.title);
            console.log(producto.price);
          });
        },
        "json"
      );


    

});