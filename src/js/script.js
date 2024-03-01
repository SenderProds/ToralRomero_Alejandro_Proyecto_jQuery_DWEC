$(() => {
  let formInicioSesion = $("#iniciarSesion");
  let formRegistro = $("#registro");
  let btnIniciarSesion = $("#btnIniciarSesion");
  let btnCerrarSesion = $("#btnCerrarSesion");
  let btnPrincipal = $("#btnPrincipal");
  let btnRegistro = $("#btnRegistro");

  recargarPagina();

  function recargarPagina() {
    if (localStorage.getItem("sesion") == "true") {
      btnIniciarSesion.addClass("hidden");
      btnRegistro.addClass("hidden");
      btnPrincipal.removeClass("hidden");
      btnCerrarSesion.removeClass("hidden");
      formInicioSesion.addClass("hidden");

      generarListaRazas();
    }
  }

  async function generarListaRazas() {
    $("body").css("height", "100%");
    let razas = await obtenerRazas();

    let ulRazas = document.createElement("ul");
    ulRazas.classList.add("w-5/6", "mb-4");
    for (const objRaza of razas.data) {
      let liRaza = document.createElement("li");
      liRaza.classList.add("mb-4", "shadow-2xl", "py-4", "px-4", "rounded-xl", "text-center", "hover:scale-105", "hover:transition", "ease-linear", "duration-200");
      
      let nombreRaza = document.createElement("p");
      let imagenRaza = document.createElement("img");

      let divBotones = document.createElement('div');
      divBotones.classList.add("flex", "w-full", "h-full", "justify-around", "mt-10", "items-center", "py-4", "box-content");
  

      let btnMeGusta = document.createElement("button");
      let btnNoMeGusta = document.createElement("button");
      let btnFavorito = document.createElement("button");

      btnMeGusta.innerHTML = `<i class="bi bi-suit-heart text-2xl  "></i>`;
      btnMeGusta.classList.add("h-12", "w-12", "hover:bg-red-300", "hover:rounded-full");
      btnNoMeGusta.innerHTML = `<i class="bi bi-hand-thumbs-down text-2xl "></i>`;
      btnNoMeGusta.classList.add("h-12", "w-12", "hover:bg-slate-300", "hover:rounded-full");
      
      btnFavorito.innerHTML = `<i class="bi bi-bookmark-star text-2xl "></i>`;
      btnFavorito.classList.add("h-12", "w-12", "hover:bg-yellow-300", "hover:rounded-full");

      agregarHijos([btnMeGusta, btnNoMeGusta, btnFavorito], divBotones);


      nombreRaza.innerHTML = objRaza.breed;

      let url = await obtenerImagenRaza(objRaza.breed);

      if (url) {
        imagenRaza.src = url;
        imagenRaza.classList.add("rounded-xl");
        agregarHijos([nombreRaza, imagenRaza, divBotones], liRaza);

        ulRazas.appendChild(liRaza);
      }
    }

    console.log(ulRazas);
    $("#gatos").append(ulRazas);
  }

  function agregarHijos([...hijos], padre) {
    hijos.forEach((hijo) => {
      padre.appendChild(hijo);
    });
  }

  /**
   * Obtiene las razas
   * @returns Promesa de objeto con las distintas razas e informacion extra
   */
  async function obtenerRazas() {
    if (localStorage.getItem("razas")) {
      console.log("Obteniendo del almacenamiento");
      return JSON.parse(localStorage.getItem("razas"));
    } else {
      return new Promise((resultado, error) => {
        let url = "https://catfact.ninja/breeds?limit=12";
        $.get(url, "json")
          .done((data) => {
            localStorage.setItem("razas", JSON.stringify(data));
            resultado(data);
          })
          .fail((XHR, textStatus, errorThrown) => error(errorThrown));
      });
    }
  }

  async function obtenerImagenRaza(raza) {
    let raz = raza;
    let idraza = await obtenerIdRaza(raz);

    if (idraza) {
      let imagenRaza = await obtenerImagenRazaPorId(idraza);
      return imagenRaza;
    } else {
      return false;
    }
  }

  /**
   * Obtiene una imagen de ejemplo de una raza
   * @param {*} idRaza Id de la raza
   * @returns Promesa con url
   */
  async function obtenerImagenRazaPorId(idRaza) {
    let imagenRazaAlmacenado = JSON.parse(localStorage.getItem("razaImg"));

    if (!imagenRazaAlmacenado || imagenRazaAlmacenado[idRaza] == null) {
      return new Promise((resultado, error) => {
        $.ajax({
          url: `https://api.thecatapi.com/v1/images/search?breed_ids=${idRaza}`,
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            "x-api-key":
              "live_NAUN3TeRlzgerJIlkaqx3niboG07oFVNCLVe6X27VBKkbnK3QGuOLgbRmOX6A1Tn",
          },
          success: function (data) {
            let obj = {};
            if(imagenRazaAlmacenado){
              obj = imagenRazaAlmacenado; 
            }else{
              obj = {};
            }
             obj[idRaza] = data[0].url;
            localStorage.setItem('razaImg', JSON.stringify(obj));

            resultado(data[0].url);
          },
          error: function (XHR, textStatus, errorThrown) {
            error(errorThrown);
          },
        });
      });
    }else{
      return imagenRazaAlmacenado[idRaza];
    }
  }

  /**
   * Obtiene el id de una raza
   * @param {*} raza Nombre de la raza
   * @returns Promesa del id de la raza
   */
  async function obtenerIdRaza(raza) {
    let razaIdAlmacenado = JSON.parse(localStorage.getItem("razaId"));

    //console.log(razaIdAlmacenado[raza]);
    if (!razaIdAlmacenado || razaIdAlmacenado[raza] == null) {
      return new Promise((resultado, error) => {
        $.ajax({
          url: `https://api.thecatapi.com/v1/breeds/search?name=${raza}`,
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            "x-api-key":
              "live_NAUN3TeRlzgerJIlkaqx3niboG07oFVNCLVe6X27VBKkbnK3QGuOLgbRmOX6A1Tn",
          },
          success: function (data) {
            if (data.length > 0) {
              let obj = {};
              if (razaIdAlmacenado) {
                obj = razaIdAlmacenado;
              } else {
                obj = {};
              }

              obj[raza] = data[0].id;
              localStorage.setItem("razaId", JSON.stringify(obj));
              resultado(data[0].id);
            } else {
              resultado(false);
            }
          },
          error: function (XHR, textStatus, errorThrown) {
            error(errorThrown);
          },
        });
      });
    } else {
      return razaIdAlmacenado[raza];
    }
  }

  //Botón principal header
  $("#btnPrincipal").click((e) => {
    console.log("Prueba");
  });

  //Botón registro Header
  $("#btnRegistro").click((e) => {
    formRegistro.removeClass("hidden");
    formInicioSesion.addClass("hidden");
  });

  //Boton iniciar Sesion Header
  $("#btnIniciarSesion").click((e) => {
    formRegistro.addClass("hidden");
    formInicioSesion.removeClass("hidden");
  });

  //Boton cerrar Sesion Header
  $("#btnCerrarSesion").click((e) => {
    localStorage.setItem("sesion", false);
    btnIniciarSesion.removeClass("hidden");
    btnRegistro.removeClass("hidden");
    btnPrincipal.addClass("hidden");
    btnCerrarSesion.addClass("hidden");

    formRegistro.removeClass("hidden");
    formInicioSesion.addClass("hidden");
  });

  //Formulario Inicio Sesión
  formInicioSesion.submit((e) => {
    e.preventDefault();
    iniciarSesion();
  });

  //Formulario Registro
  formRegistro.submit(function (e) {
    e.preventDefault();
    registrarUsuario();
  });

  /**
   * Inicia la sesion
   */
  function iniciarSesion() {
    console.log("Iniciando Sesion");
    let usuario = $("#username").val();
    let password = $("#password").val();

    let usuarios = obtenerUsuarios();

    let sesion = usuarios.some((usr) => {
      return usr.usuario == usuario && usr.clave == password;
    });

    if (sesion) {
      localStorage.setItem("sesion", true);
      recargarPagina();
    }
  }

  /**
   * Registra un usuario en el Almacenamiento Local
   */
  function registrarUsuario() {
    let nombre = $("#nombre").val();
    let apellidos = $("#apellidos").val();
    let usuario = $("#usernameReg").val();
    let clave = $("#passwordReg").val();

    let objeto = {
      nombre: nombre,
      apellidos: apellidos,
      usuario: usuario,
      clave: clave,
    };

    let usuarios = obtenerUsuarios();
    if (usuarios) {
      usuarios.push(objeto);
    } else {
      usuarios = [];
      usuarios.push(objeto);
    }

    localStorage.setItem("usuarios", JSON.stringify(usuarios));
  }
});

/**
 * Obtiene los usuarios
 * @returns Devuelve un array con los usuarios
 */
function obtenerUsuarios() {
  return JSON.parse(localStorage.getItem("usuarios"));
}
