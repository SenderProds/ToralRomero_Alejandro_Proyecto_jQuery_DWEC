$(() => {
  let formInicioSesion = $("#iniciarSesion");
  let formRegistro = $("#registro");
  let btnIniciarSesion = $("#btnIniciarSesion");
  let btnCerrarSesion = $("#btnCerrarSesion");
  let btnPrincipal = $("#btnPrincipal");
  let btnRegistro = $("#btnRegistro");

  let btnLista = $("#lista");
  let btnTabla = $("#tabla");
  let btnAsc = $("#asc");
  let btnDesc = $("#desc");

  recargarPagina();

  function recargarPagina() {
    if (localStorage.getItem("sesion") == "true") {
      btnIniciarSesion.addClass("hidden");
      btnRegistro.addClass("hidden");
      btnPrincipal.removeClass("hidden");
      btnCerrarSesion.removeClass("hidden");
      formInicioSesion.addClass("hidden");

      $("#razasCont").remove();
      $("#gatos").removeClass("hidden");
      $("#filtros").removeClass("hidden");
      cargarGatos();
      eventosVisualizacion();

      if ($("#detalle")) {
        $("#detalle").remove();
      }
    } else {
      $("#razasCont").remove();
    }
  }

  function eventosVisualizacion() {
    btnLista.off("click");
    btnLista.click((e) => {
      console.log(e.target);

      btnLista.addClass("bg-orange-300");
      btnLista.removeClass("bg-orange-200");

      btnTabla.removeClass("bg-orange-300");
      btnTabla.addClass("bg-orange-200");

      $("#gatos").attr("data-lista", "true");
      $("#gatos").removeAttr("data-tabla");

      cargarGatos();
    });

    btnTabla.off("click");
    btnTabla.click((e) => {
      console.log(e.target);

      btnLista.removeClass("bg-orange-300");
      btnLista.addClass("bg-orange-200");

      btnTabla.addClass("bg-orange-300");
      btnTabla.removeClass("bg-orange-200");

      $("#gatos").removeAttr("data-lista");
      $("#gatos").attr("data-tabla", "true");
      cargarGatos();
    });

    btnAsc.off();
    btnAsc.click((e) => {
      ordenarRazasAscendente();
      cargarGatos();
    });

    btnDesc.off();
    btnDesc.click((e) => {
      ordenarRazasDescendente();
      cargarGatos();
    });

    btnPrincipal.off();
    btnPrincipal.click((e) => {
      recargarPagina();
    });
  }

  /**
   * Se agrega el contenido segun las preferencias del usuario
   */
  function cargarGatos() {
    if ($("#gatos").attr("data-tabla")) {
      generarTablaRazas();
    } else {
      generarListaRazas();
    }
  }

  /**
   * Genera una lista de las razas
   */
  async function generarListaRazas() {
    $("body").css("height", "100%");
    $("#razasCont").remove();
    $("#cargando").removeClass("hidden");
    let razas = await obtenerRazas();

    let ulRazas = document.createElement("ul");
    ulRazas.id = "razasCont";
    ulRazas.classList.add("w-5/6", "mb-4", "md:w-2/6");
    for (const objRaza of razas) {
      let id = await obtenerIdRaza(objRaza.breed);

      let liRaza = document.createElement("li");
      liRaza.dataset.id = id;
      liRaza.classList.add(
        "mb-4",
        "shadow-2xl",
        "py-4",
        "px-4",
        "rounded-xl",
        "text-center",
        "hover:scale-105",
        "hover:transition",
        "ease-linear",
        "duration-200",
        "mt-7"
      );

      let nombreRaza = document.createElement("p");
      let imagenRaza = document.createElement("img");

      let divBotones = document.createElement("div");
      divBotones.classList.add(
        "flex",
        "w-full",
        "h-full",
        "justify-around",
        "mt-10",
        "items-center",
        "py-4",
        "box-content"
      );

      let btnMeGusta = document.createElement("button");
      let btnNoMeGusta = document.createElement("button");
      let btnFavorito = document.createElement("button");

      let contMeGusta = obtenerMeGustas(id);
      btnMeGusta.innerHTML = `<i class="bi bi-suit-heart text-2xl p-4 -mt-4 hover:relative"></i><span id="contMeGusta" class="-mt-5">${contMeGusta}</span>`;
      btnMeGusta.classList.add(
        "h-14",
        "w-14",
        "hover:bg-red-300",
        "hover:rounded-full",
        "flex",
        "flex-col",
        "justify-center",
        "items-center"
      );
      btnMeGusta.classList.add("btnMeGusta");
      btnMeGusta.dataset.id = id;

      let contNoMeGusta = obtenerNoMeGustas(id);
      btnNoMeGusta.innerHTML = `<i class="bi bi-hand-thumbs-down text-2xl p-4 -mt-4 hover:relative"></i><span class="-mt-5">${contNoMeGusta}</span>`;
      btnNoMeGusta.classList.add(
        "h-14",
        "w-14",
        "hover:bg-slate-300",
        "hover:rounded-full",
        "flex",
        "flex-col",
        "justify-center",
        "items-center"
      );
      btnNoMeGusta.classList.add("btnNoMeGusta");
      btnNoMeGusta.dataset.id = id;

      let contFavoritos = obtenerFavoritos(id);
      if (contFavoritos > 0) {
        btnFavorito.innerHTML = `<i class="bi bi-bookmark-star-fill text-2xl p-4 -mt-4 hover:relative"></i><span class="-mt-5">${contFavoritos}</span>`;
      } else {
        btnFavorito.innerHTML = `<i class="bi bi-bookmark-star text-2xl p-4 -mt-4 hover:relative"></i><span class="-mt-5">${contFavoritos}</span>`;
      }
      btnFavorito.classList.add(
        "h-14",
        "w-14",
        "hover:bg-yellow-300",
        "hover:rounded-full",
        "flex",
        "flex-col",
        "justify-center",
        "items-center"
      );
      btnFavorito.classList.add("btnFavorito");
      btnFavorito.dataset.id = id;

      agregarHijos([btnMeGusta, btnNoMeGusta, btnFavorito], divBotones);

      nombreRaza.innerHTML = objRaza.breed;

      let url = await obtenerImagenRazaPorId(id);

      if (url) {
        imagenRaza.src = url;
        imagenRaza.classList.add("rounded-xl");
        agregarHijos([nombreRaza, imagenRaza, divBotones], liRaza);

        ulRazas.appendChild(liRaza);
      }
    }

    $("#cargando").addClass("hidden");
    $("#gatos").append(ulRazas);

    eventoMeGusta();
    eventoNoMeGusta();
    eventoFavorito();
    eventoDetalle();
    desplazamientoInfinito();
  }

  function desplazamientoInfinito() {
    $(window).off("scroll");
    $(window).on("scroll", (e) => {
      if (
        window.scrollY + window.innerHeight >
        document.documentElement.scrollHeight - 50
      ) {
        let elementos = $("#razasCont").find("li").clone();
        console.log("Hay");
        $("#razasCont").append(elementos);

        eventoFavorito();
        eventoMeGusta();
        eventoNoMeGusta();
        eventoDetalle();
      }
    });
  }

  /**
   * Genera una lista de las razas
   */
  async function generarTablaRazas() {
    $("body").css("height", "100%");
    $("#razasCont").remove();
    let razas = await obtenerRazas();

    let ulRazas = document.createElement("ul");
    ulRazas.id = "razasCont";
    ulRazas.classList.add(
      "w-5/6",
      "mb-4",
      "md:w-5/6",
      "grid",
      "grid-cols-2",
      "gap-2"
    );
    for (const objRaza of razas) {
      let id = await obtenerIdRaza(objRaza.breed);

      let liRaza = document.createElement("li");
      liRaza.dataset.id = id;
      liRaza.classList.add(
        "mb-4",
        "shadow-2xl",
        "py-4",
        "px-4",
        "rounded-xl",
        "text-center",
        "hover:scale-105",
        "hover:transition",
        "ease-linear",
        "duration-200",
        "mt-7"
      );

      let nombreRaza = document.createElement("p");
      let imagenRaza = document.createElement("img");

      let divBotones = document.createElement("div");
      divBotones.classList.add(
        "md:flex",
        "w-full",
        "justify-around",
        "items-center",
        "py-4",
        "box-content",
        "hidden"
      );

      let btnMeGusta = document.createElement("button");
      let btnNoMeGusta = document.createElement("button");
      let btnFavorito = document.createElement("button");

      let contMeGusta = obtenerMeGustas(id);
      btnMeGusta.innerHTML = `<i class="bi bi-suit-heart text-2xl p-4 -mt-4"></i><span id="contMeGusta" class="-mt-5">${contMeGusta}</span>`;
      btnMeGusta.classList.add(
        "h-14",
        "w-14",
        "hover:bg-red-300",
        "hover:rounded-full",
        "flex",
        "flex-col",
        "justify-center",
        "items-center"
      );
      btnMeGusta.classList.add("btnMeGusta");
      btnMeGusta.dataset.id = id;

      let contNoMeGusta = obtenerNoMeGustas(id);
      btnNoMeGusta.innerHTML = `<i class="bi bi-hand-thumbs-down text-2xl p-4 -mt-4 hover:relative"></i><span class="-mt-5">${contNoMeGusta}</span>`;
      btnNoMeGusta.classList.add(
        "h-14",
        "w-14",
        "hover:bg-slate-300",
        "hover:rounded-full",
        "flex",
        "flex-col",
        "justify-center",
        "items-center"
      );
      btnNoMeGusta.classList.add("btnNoMeGusta");
      btnNoMeGusta.dataset.id = id;

      let contFavoritos = obtenerFavoritos(id);
      if (contFavoritos > 0) {
        btnFavorito.innerHTML = `<i class="bi bi-bookmark-star-fill text-2xl p-4 -mt-4 hover:relative"></i><span class="-mt-5">${contFavoritos}</span>`;
      } else {
        btnFavorito.innerHTML = `<i class="bi bi-bookmark-star text-2xl p-4 -mt-4 hover:relative"></i><span class="-mt-5">${contFavoritos}</span>`;
      }
      btnFavorito.classList.add(
        "h-14",
        "w-14",
        "hover:bg-yellow-300",
        "hover:rounded-full",
        "flex",
        "flex-col",
        "justify-center",
        "items-center"
      );
      btnFavorito.classList.add("btnFavorito");
      btnFavorito.dataset.id = id;

      agregarHijos([btnMeGusta, btnNoMeGusta, btnFavorito], divBotones);

      nombreRaza.innerHTML = objRaza.breed;

      let url = await obtenerImagenRazaPorId(id);

      if (url) {
        imagenRaza.src = url;
        imagenRaza.classList.add("rounded-xl");
        agregarHijos([nombreRaza, imagenRaza, divBotones], liRaza);

        ulRazas.appendChild(liRaza);
      }
    }

    $("#gatos").append(ulRazas);

    eventoMeGusta();
    eventoNoMeGusta();
    eventoFavorito();
    eventoDetalle();
  }

  function eventoDetalle() {
    $("#razasCont").find("li").off();
    $("#razasCont")
      .find("li")
      .click((e) => {
        if (e.target.tagName != "I") {
          console.log(e.target.parentNode.dataset.id);
          console.log("Esto es una prueba");
          generaDetalleRaza(e.target.parentNode.dataset.id);
          $("#filtros").addClass("hidden");
          $("#razasCont").addClass("hidden");
        }
      });
  }

  async function generaDetalleRaza(id) {
    let info = await obtenerInformacionRaza(id);
    let seccionDetalle = document.createElement("section");
    seccionDetalle.classList.add(
      "flex",
      "flex-col",
      "items-center",
      "jusfity-center",
      "text-center"
    );
    seccionDetalle.id = "detalle";

    /*.add(
      "w-5/6",
      "mb-4",
      "md:w-5/6",
      "grid",
      "grid-cols-2",
      "gap-2"
    );*/
    let imagenes = await obtenerImagenesRaza(id);
    let h1 = document.createElement("h1");
    let contenedorImagenes = document.createElement("div");
    contenedorImagenes.classList.add(
      "w-5/6",
      "mb-4",
      "md:w-5/6",
      "grid",
      "grid-cols-max",
      "gap-2",
      "items-center",
      "justify-center"
    );
    let descripcion = document.createElement("p");

    if ($("#detalle")) {
      $("#detalle").remove();
    }

    h1.innerHTML = info.name;

    imagenes.forEach((elemento) => {
      let img = document.createElement("img");
      console.log(elemento);
      img.classList.add("rounded-xl");
      img.src = elemento.url;

      contenedorImagenes.appendChild(img);
    });
    descripcion.innerHTML = info.description;

    agregarHijos([h1, contenedorImagenes, descripcion], seccionDetalle);

    $("#contenido").append(seccionDetalle);
  }

  async function obtenerImagenesRaza(razaId) {
    return new Promise((resultado, error) => {
      $.ajax({
        url: `https://api.thecatapi.com/v1/images/search?breed_id=${razaId}&limit=5`,
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "x-api-key":
            "live_NAUN3TeRlzgerJIlkaqx3niboG07oFVNCLVe6X27VBKkbnK3QGuOLgbRmOX6A1Tn",
        },
        success: function (data) {
          resultado(data);
        },
        error: function (XHR, textStatus, errorThrown) {
          error(errorThrown);
        },
      });
    });
  }

  async function obtenerInformacionRaza(idRaza) {
    return new Promise((resultado, error) => {
      $.ajax({
        url: `https://api.thecatapi.com/v1/breeds/${idRaza}`,
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "x-api-key":
            "live_NAUN3TeRlzgerJIlkaqx3niboG07oFVNCLVe6X27VBKkbnK3QGuOLgbRmOX6A1Tn",
        },
        success: function (data) {
          resultado(data);
        },
        error: function (XHR, textStatus, errorThrown) {
          error(errorThrown);
        },
      });
    });
  }

  /**
   * Agrega el evento a los botones de Me Gusta
   */
  function eventoMeGusta() {
    $(".btnMeGusta").click((e) => {
      if ($(e.target).prop("tagName") == "I") {
        $(e.target).addClass("bi-suit-heart-fill");
        $(e.target).removeClass("bi-suit-heart");

        let contador = agregarMeGusta($(e.target).parent().data("id"));
        let span = $(e.target).parent().find("span");

        span.text(contador);
      }
    });
  }

  /**
   * Agrega un Me Gusta a la raza
   * @param {*} id Id de la raza
   * @returns Cantidad de Me Gusta
   */
  function agregarMeGusta(id) {
    let objMeGusta = JSON.parse(localStorage.getItem("meGustas"));
    let obj = {};
    if (objMeGusta) {
      obj = objMeGusta;
      if (obj[id]) {
        obj[id]++;
      } else {
        obj[id] = 1;
      }
    } else {
      obj[id] = 1;
    }
    localStorage.setItem("meGustas", JSON.stringify(obj));

    return obj[id];
  }

  /**
   * Devuelve la cantidad de Me Gusta
   * @param {*} id Id de la raza
   * @returns Numero de Me Gusta
   */
  function obtenerMeGustas(id) {
    let objMeGusta = JSON.parse(localStorage.getItem("meGustas"));

    if (objMeGusta) {
      if (objMeGusta[id]) {
        return objMeGusta[id];
      }
    }

    return 0;
  }

  /**
   * Crear el evento de los botones de No Me Gusta
   */
  function eventoNoMeGusta() {
    $(".btnNoMeGusta").click((e) => {
      if ($(e.target).prop("tagName") == "I") {
        $(e.target).removeClass("bi-hand-thumbs-down");
        $(e.target).addClass("bi-hand-thumbs-down-fill");

        let contador = agregarNoMeGusta($(e.target).parent().data("id"));
        let span = $(e.target).parent().find("span");

        span.text(contador);
      }
    });
  }

  /**
   * Agrega No Me Gusta a la raza
   * @param {*} id Id de la Raza
   * @returns Numero de No Me Gusta
   */
  function agregarNoMeGusta(id) {
    let objNoMeGusta = JSON.parse(localStorage.getItem("noMeGustas"));
    let obj = {};
    if (objNoMeGusta) {
      obj = objNoMeGusta;
      if (obj[id]) {
        obj[id]++;
      } else {
        obj[id] = 1;
      }
    } else {
      obj[id] = 1;
    }
    localStorage.setItem("noMeGustas", JSON.stringify(obj));

    return obj[id];
  }

  /**
   * Obtiene el numero de No Me Gusta
   * @param {*} id Id de la raza
   * @returns Numero de No Me Gusta
   */
  function obtenerNoMeGustas(id) {
    let objNoMeGusta = JSON.parse(localStorage.getItem("noMeGustas"));

    if (objNoMeGusta) {
      if (objNoMeGusta[id]) {
        return objNoMeGusta[id];
      }
    }

    return 0;
  }

  /**
   * Crea el evento de los botones de favorito
   */
  function eventoFavorito() {
    $(".btnFavorito").click((e) => {
      if ($(e.target).prop("tagName") == "I") {
        $(e.target).toggleClass("bi-bookmark-star");
        $(e.target).toggleClass("bi-bookmark-star-fill");

        let favoritos = alternarFavoritos($(e.target).parent().data("id"));

        let span = $(e.target).parent().find("span");

        span.text(favoritos);
      }
    });
  }

  /**
   * Alterna Las Clases de el Boton de Favorito
   * ya que un solo usuario solo puede darle una vez
   * @param {*} id Id de la raza
   * @returns Numero de Favoritos
   */
  function alternarFavoritos(id) {
    let favoritos = JSON.parse(localStorage.getItem("favoritos"));
    let cont = 0;

    if (favoritos) {
      if (favoritos[id]) {
        delete favoritos[id];
      } else {
        favoritos[id] = 1;
        cont++;
      }
    } else {
      favoritos = {};
      favoritos[id] = 1;
      cont++;
    }

    localStorage.setItem("favoritos", JSON.stringify(favoritos));

    return cont;
  }

  /**
   * Obtiene el numero de Favoritos
   * @param {*} id Id de la Raza
   * @returns Numero Favoritos
   */
  function obtenerFavoritos(id) {
    let favoritos = JSON.parse(localStorage.getItem("favoritos"));
    if (favoritos) {
      if (favoritos[id]) {
        return favoritos[id];
      }
    }

    return 0;
  }

  /**
   * Funcion para agregar varios hijos a un padre
   * @param {*} param0 Array de hijos
   * @param {*} padre Elemento Padre
   */
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
        let url = "https://catfact.ninja/breeds?limit=13";
        $.get(url, "json")
          .done((data) => {
            localStorage.setItem("razas", JSON.stringify(data.data));
            console.log(data.data);
            resultado(data.data);
          })
          .fail((XHR, textStatus, errorThrown) => error(errorThrown));
      });
    }
  }

  function ordenarRazasAscendente() {
    let razas = JSON.parse(localStorage.getItem("razas"));
    razas.sort((a, b) => a.breed.localeCompare(b.breed));
    localStorage.setItem("razas", JSON.stringify(razas));
  }

  function ordenarRazasDescendente() {
    let razas = JSON.parse(localStorage.getItem("razas"));
    razas.sort((a, b) => b.breed.localeCompare(a.breed));
    localStorage.setItem("razas", JSON.stringify(razas));
  }
  /**
   * Obtiene una imagen de ejemplo de una raza
   * @param {*} idRaza Id de la raza
   * @returns Promesa con url
   */
  async function obtenerImagenRazaPorId(idRaza) {
    let imagenRazaAlmacenado = JSON.parse(localStorage.getItem("razaImg"));

    //console.log(!imagenRazaAlmacenado);
    //console.log(!imagenRazaAlmacenado.idRaza);

    if (!imagenRazaAlmacenado || imagenRazaAlmacenado[idRaza] == null) {
      console.log("Obteniendo imagen por API");
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
            if (imagenRazaAlmacenado) {
              obj = imagenRazaAlmacenado;
            } else {
              obj = {};
            }

            if (data[0]?.url) {
              obj[idRaza] = data[0].url;
              localStorage.setItem("razaImg", JSON.stringify(obj));
              resultado(data[0].url);
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

    if (!razaIdAlmacenado || razaIdAlmacenado[raza] == null) {
      return new Promise((resultado, error) => {
        console.log("Obteniendo Id de Raza por API");
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
              quitarRaza(raza);
              resultado(false);
            }
          },
          error: function (XHR, textStatus, errorThrown) {
            error(errorThrown);
          },
        });
      });
    } else {
      console.log("Obteniendo Id de Raza por Almacenamiento");
      return razaIdAlmacenado[raza];
    }
  }
  function quitarRaza(raza) {
    console.log("Eliminando raza " + raza);
    let razas = JSON.parse(localStorage.getItem("razas"));
    //delete razas.data.breed[raza];

    razas = razas.filter((raz) => {
      return raz.breed != raza;
    });
    console.log(razas);
    localStorage.setItem("razas", JSON.stringify(razas));
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
    $("#filtros").addClass("hidden");
    $("body").css("height", "100vh");

    //$("#razasCont")

    console.log($("#razasCont"));
    console.log("Cerrando Sesion");
    recargarPagina();
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

    if (usuarios) {
      let sesion = usuarios.some((usr) => {
        return usr.usuario == usuario && usr.clave == password;
      });

      if (sesion) {
        localStorage.setItem("sesion", true);
        recargarPagina();
      } else {
        $("#loginIncorrecto").removeClass("hidden");

        setTimeout(function () {
          $("#loginIncorrecto").addClass("hidden");
        }, 5000);
      }
    } else {
      $("#loginIncorrecto").removeClass("hidden");
      setTimeout(function () {
        $("#loginIncorrecto").addClass("hidden");
      }, 5000);
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
    formRegistro.addClass("hidden");
    formInicioSesion.removeClass("hidden");
    $("#usuarioRegistrado").removeClass("hidden");
    setTimeout(function () {
      $("#usuarioRegistrado").addClass("hidden");
    }, 5000);
  }
});

/**
 * Obtiene los usuarios
 * @returns Devuelve un array con los usuarios
 */
function obtenerUsuarios() {
  return JSON.parse(localStorage.getItem("usuarios"));
}
