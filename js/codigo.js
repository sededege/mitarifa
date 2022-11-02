window.fn = {};
window.fn.open = function () {
    var menu = document.getElementById('menu');
    menu.open();
};
window.fn.load = function (page) {
    var content = document.getElementById('content');
    var menu = document.getElementById('menu');
    content.load(page)
            .then(menu.close.bind(menu));
};
document.addEventListener("init", iniciarPagina); /*funciona como un document ready, avisa cuando el documento esta listo*/

//Cuadros de dialogos
function createAlertDialogMatriculaVacia() {
    var dialog = document.getElementById('my-alert-dialog-matriculaVacia');
    if (dialog) {
        dialog.show();
    } else {
        ons.createElement('alert-dialog.html', {append: true})
                .then(function (dialog) {
                    dialog.show();
                });
    }
}
;
var hideAlertDialogVacia = function () {
    document.getElementById('my-alert-dialog-matriculaVacia').hide();
};

//ALERTA NUMERO POSIBLES
function createAlertDialogMaricula() {
    var dialog = document.getElementById('my-alert-dialog-matricula');
    if (dialog) {
        dialog.show();
    } else {
        ons.createElement('alert-dialog-matricula.html', {append: true})
                .then(function (dialog) {
                    dialog.show();
                });
    }
}
;
var hideAlertDialogMatricula = function () {
    document.getElementById('my-alert-dialog-matricula').hide();
};

var notify = function () {
    ons.notification.alert('This dialog was created with ons.notification');
};
function showToast() {
    ons.notification.toast('Matrícula agregada!', {
        timeout: 2000
    });
}
;
function showToastCompra() {
    ons.notification.toast('Compra exitosa!', {
        timeout: 2000
    });
}
;
var ons;
ons.ready(function () {
    var carousel = document.addEventListener('postchange', function (event) {
        var posicion = event.activeIndex;
        if (posicion === 0) {
            $("#indicadorUno").css("background-color", "#282828");
            $("#indicadorDos").css("background-color", "#909090");
            $("#indicadorTres").css("background-color", "#909090");
        }
        if (posicion === 1) {
            $("#indicadorUno").css("background-color", "#909090");
            $("#indicadorDos").css("background-color", "#282828");
            $("#indicadorTres").css("background-color", "#909090");
        }
        if (posicion === 2) {
            $("#indicadorUno").css("background-color", "#909090");
            $("#indicadorDos").css("background-color", "#909090");
            $("#indicadorTres").css("background-color", "#282828");
        }
    });
});


function showModal() {
    $('#modificarmatricula').show();
    $("#matriculaedit").keyup(validarMatriculaEdit);
}

function hideModal() {
    $('#modificarmatricula').hide();
}

var createAlertDialogBorrar = function () {
    var dialog = document.getElementById('borrarDatos');
    if (dialog) {
        dialog.show();
    } else {
        ons.createElement('borrar.html', {append: true})
                .then(function (dialog) {
                    dialog.show();
                });
    }
};
var hideAlertDialogBorrar = function () {
    document.getElementById('borrarDatos').hide();
};


function iniciarPagina(_evt) {
    ocultarLoader();
    switch (_evt.target.id) {
        case "home":
            corroborarHora();
            duracionReserva();
            $("#matricula").keyup(validarMatricula);
            $(".btn_agregar").click(guardar);
            if (listaLocal.matriculas.length === 0) {
                $('#agregarmatricula').show();
            } else {
                $('#agregarmatricula').hide();
            }
            cargarmatricula();
            cargarfecha();
            $('.comprar').click(comprar);
            setInterval(cargarhora);
            break;

        case "matriculas":
            console.log(listaLocal.matriculas);
            $('#matriculasfav').empty();
            $("#matricula").keyup(validarMatricula);
            for (var i = 0; i < listaLocal.matriculas.length; i++) {
                $("#matriculasfav").append("<ons-list-item><div class='center'><span class='list-item__title'>" + listaLocal.matriculas[i].nombre + "</span><span class='list-item__subtitle'>" + listaLocal.matriculas[i].numero + "</span></div><div class=right><i id-eli='" + listaLocal.matriculas[i].id + "' class='eliminar zmdi zmdi-delete'></i></div></ons-list-item>");
            }
//            $('.zmdi-edit').click(idmod);
            $('.zmdi-edit').click(showModal);
            $('.eliminar').click(eliminar);
//            $('#cerrar').click(modificar);
            $('#mostrar').click(agregarshow);
            $(".btn_agregar").click(guardar);
            break;
        case "historial":
            $('#historialr').empty();
            for (var i = 0; i < Historial.compras.length; i++) {
                $("#historialr").append("<ons-list-item><div><p>" + Historial.compras[i].numero + "</p><p>Duracion: " + Historial.compras[i].duracion + " min</p></div><div><hr><p class='horahis'>Hora: " + Historial.compras[i].hora + "</p><p class='fecha'>Fecha: " + Historial.compras[i].fecha + "</p></div></ons-list-item>");
            }
            break;
    }
}
;

function  agregarshow() {
    $('#agregarmatricula').show();
}
function mostrarLoader() {
    $(".progress-bar").show();
}

function mostrarError() {

}

function ocultarLoader() {
    $(".progress-bar").hide();
}

//CREAR BASE DE DATOS
var listaLocal = localStorage.getItem("lista");
if (listaLocal === null) {
    var favoritos = {
        matriculas: [
        ]
    };
    localStorage.setItem("lista", JSON.stringify(favoritos));
}

listaLocal = JSON.parse(localStorage.getItem("lista"));


var Historial = localStorage.getItem("compras");
if (Historial === null) {
    var historial = {
        compras: [
        ]
    };
    localStorage.setItem("compras", JSON.stringify(historial));
}

Historial = JSON.parse(localStorage.getItem("compras"));

//GUARDAR DATOS
function guardar() {
            $(this).attr("class", "fav zmdi zmdi-favorite");
    var nombre = $("#nombre").val();
    var matricula = $("#matricula").val().toUpperCase();
    var id = listaLocal.matriculas.length;
    var posicionMatricula = listaLocal.matriculas.findIndex(e => e.numero === matricula);
    if (nombre !== "" && nombre !== " " && matricula !== "" && matricula !== " ") {
        if (posicionMatricula === -1)
        {
            listaLocal.matriculas.push({
                'nombre': nombre,
                'numero': matricula,
                'id': listaLocal.matriculas.length
            })
            showToast();
        }
        localStorage.setItem("lista", JSON.stringify(listaLocal));
        $('#agregarmatricula').hide();
        $("#content")[0].load("matriculas.html");
    } else {
        createAlertDialogMatriculaVacia();
    }
    ;
}

//ELIMINAR
function eliminar() {
    var ideli = Number($(this).attr('id-eli'));
    var resultadoIndex = listaLocal.matriculas.findIndex(e => e.id === ideli);
    if (resultadoIndex !== -1) {
        listaLocal.matriculas.splice(resultadoIndex, 1);
        localStorage.setItem("lista", JSON.stringify(listaLocal));
        $("#content")[0].load("matriculas.html");
    } else {
        alert("No lo encontro");
    }
}
;

//MODIFICAR
//var idmod;
//function idmod() {
//    idmod = Number($(this).attr('id-mod'));
//}
//function modificar() {
//    var nombre = $("#nombreedit").val();
//    var matricula = $("#matriculaedit").val().toUpperCase();
//    listaLocal.matriculas[idmod].numero = matricula;
//    listaLocal.matriculas[idmod].nombre = nombre;
//    localStorage.setItem("lista", JSON.stringify(listaLocal));
//    hideModal();
//}
//;

//VALIDAR MATRICULA
function validarMatricula() {
    var matricula = $("#matricula").val();
    if (matricula === '' || matricula === ' ') {
        $("#matricula").css("text-transform", "none");
    } else {
        $("#matricula").css("text-transform", "uppercase");
    }
    if (matricula.length > 7) {
        $("#matricula").val(matricula.substr(0, 7) + "");
        createAlertDialogMaricula();
    }
    if (matricula.substr(4, 7) === isNaN()) {
        alert('hola');
    }
}
function validarMatriculaEdit() {
    var matricula = $("#matriculaedit").val();
    if (matricula === '' || matricula === ' ') {
        $("#matriculaedit").css("text-transform", "none");
    } else {
        $("#matriculaedit").css("text-transform", "uppercase");
    }
    if (matricula.length > 7) {
        $("#matriculaedit").val(matricula.substr(0, 7) + "");
        createAlertDialogMaricula();
    }

}


//CARGAR MATRICULA
function cargarmatricula() {
    for (var i = 0; i < listaLocal.matriculas.length; i++) {
        $('.matriculasguardadas').append('<option alt="' + listaLocal.matriculas[i].nombre + '">' + listaLocal.matriculas[i].numero + '</option>');
    }
}

// DURACION
var cuenta;
cuenta = 30;

function sumar() {
    cuenta = cuenta + 30;
    duracionReserva();
}
function restar() {
    cuenta = cuenta - 30;
    duracionReserva();
}
function duracionReserva() {
    if (cuenta <= 30) {
        cuenta = 30;
    }
    if (cuenta >= 360) {
        cuenta = 360;
    }
    $('.cuenta').text('' + cuenta + '');
    horaFinal();
}

//FERIADOS
var listaFeriados = ["7/2", "21/2", "14/3", "15/3", "11/4", "9/5", "10/5", "13/6", "11/7", "12/7", "8/8", "9/8", "12/9", "10/10", "7/11", "21/11", "5/12", "12/12", "4/3", "5/3", "18/4", "19/4", "22/4", "24/4", "1/5", "19/6", "18/7"];

//CARGAR TIEMPO
var d = new Date();
var day = d.getDate();
var mes = d.getMonth() + 1;
var anio = d.getFullYear();
var horas = d.getHours();
var mins = d.getMinutes();

function cargarhora() {
    var corrDia = day + "/" + mes;
    for (var i = 0; i < listaFeriados.length; i++) {
        if (corrDia !== listaFeriados[i]) {
            if (horas < 10 && mins < 10)
            {
                $('.hora').text('0' + horas + ' : 0' + mins + '  hrs');
                $('.horainput').attr('value', "0" + horas + ' : 0' + mins + "");

            } else if (horas < 10) {
                $('.hora').text('0' + horas + ' : ' + mins + '  hrs');
                $('.horainput').attr('value', "0" + horas + ' : ' + mins + "");

            } else if (mins < 10) {
                $('.hora').text('' + horas + ' : 0' + mins + '  hrs');
                $('.horainput').attr('value', "" + horas + ' : 0' + mins + "");
            } else {
                $('.hora').text('' + horas + ' : ' + mins + '  hrs');
                $('.horainput').attr('value', "" + horas + ' : ' + mins + "");
            }
        } else {
            alert('hola');
        }
    }
}

function corroborarHora() {
    if (horas < 10 || horas > 18) {
        $("#fueraHora").css("display", "block");
        document.querySelector('.comprar').setAttribute('disabled');
    }
}

function horaFinal() {
    var dF = new Date();
    dF.setMinutes(dF.getMinutes() + cuenta);
    var horaFinal = dF.getHours();
    var minsFinal = dF.getMinutes();
    if (horaFinal < 10 && minsFinal < 10) {
        $('#horaFin').text('0' + horaFinal + ' : 0' + minsFinal + 'hrs');

    } else if (horaFinal < 10) {
        $('#horaFin').text('0' + horaFinal + ' : ' + minsFinal + ' hrs');

    } else if (minsFinal < 10) {
        $('#horaFin').text('' + horaFinal + ' : 0' + minsFinal + 'hrs');
    } else {
        $('#horaFin').text('' + horaFinal + ' : ' + minsFinal + 'hrs');
    }

}

function cargarfecha() {
    if (day < 10 && mes < 10)
    {
        $('.fechainput').attr('value', "0" + day + '/0' + mes + "/" + anio + "");

    } else if (day < 10) {
        $('.fechainput').attr('value', "0" + day + '/' + mes + "/" + anio + "");

    } else if (mes < 10) {
        $('.fechainput').attr('value', "" + day + '/0' + mes + "/" + anio + "");
    }
}

//COMPRAR
function comprar() {
    showToastCompra();
    $("#content")[0].load("historial.html");
}

//HISTORIAL DE COMPRAS
function historialcompras() {
    var matricula = $(".matriculasguardadas").val();
    var hora = $('.horainput').val();
    var fecha = $('.fechainput').val();
    if (10 <= horas && horas <= 18) {
        Historial.compras.unshift({
            'numero': matricula,
            'hora': hora,
            'fecha': fecha,
            'duracion': cuenta
        });
    } else {
        alert('FUERA DE HORA');
    }
    localStorage.setItem("compras", JSON.stringify(Historial));
}

//ELIMINAR DATOS
var eliminarDatos = function () {
    localStorage.clear();
    location.reload();
    hideAlertDialogBorrar();
    $("#content")[0].load("home.html");
};