import { crearTabla } from './tablaDinamica.js'
import { Anuncio_Mascota } from './Anuncio_Mascota.js';
import { getAll, createAnuncio, deleteAnuncio, updateAnuncio, anuncios} from "./funcionesCrud.js";
import {
    validarCampoVacio,
    validarLongitud,
    validarLongitudDos,
    validarRango,
  } from "./validaciones.js";

const $spinner = document.getElementById("spinner");
const $divTabla=document.getElementById("divTabla");
const $selAnimal = document.getElementById("selAnimal");

document.addEventListener('DOMContentLoaded', function() {    
  getAll(actualizarTabla);
  restablecerFormulario();
}, false); 

const $formulario=document.forms[0];
const {btnGuardar, btnCancelar, btnEliminar, txtId, txtTitulo, txtDescripcion, rbtAnimal, txtPrecio,txtRaza, txtFechaNacimiento, txtVacuna } = $formulario;
const controles = $formulario.elements;

for (let i = 0; i < controles.length; i++){
  const control = controles.item(i);

  if (control.matches("input")){
    if (control.matches("[type=button]")){
      continue;
    }
    else{
      control.addEventListener("blur", validarCampoVacio);
    }
  }
  
  if(control.matches("#txtTitulo")){
    control.addEventListener("input", validarLongitud);
  }
  else if(control.matches("#txtDescripcion"))
  {
    control.addEventListener("input", validarLongitudDos)
  }
  else if(control.matches("#txtPrecio")){
    control.addEventListener("change", validarRango);
  }
  
}

window.addEventListener("click",(e)=>{
    if(e.target.matches("td")){
        console.log(e.target.parentElement.dataset.id);
        let id=e.target.parentElement.dataset.id;

        btnGuardar.innerHTML = "Modificar";
        btnEliminar.classList.remove("esconderBoton");
        btnEliminar.classList.add("mostrarBoton");

        cargarFormulario(anuncios.find((anuncio)=>anuncio.id==id));
    } 
    else if(e.target.matches("#btnEliminar")){
        handlerDelete(parseInt($formulario.txtId.value));
        restablecerFormulario();
    }  
});

function cargarFormulario(anuncio){
  
  txtId.value = anuncio.id;
  txtTitulo.value=anuncio.titulo;
  txtDescripcion.value=anuncio.descripcion;
  rbtAnimal.value=anuncio.animal;
  txtPrecio.value=anuncio.precio;
  txtRaza.value=anuncio.raza;
  txtFechaNacimiento.value=anuncio.fechaNacimiento;
  txtVacuna.value=anuncio.vacunado;
}

$formulario.addEventListener("submit",(e)=>{
    e.preventDefault();
     
    if(validarEnvio()&& !validarFormSinCompletar()){

        const formAnuncio =new Anuncio_Mascota(txtId.value,txtTitulo.value,txtDescripcion.value,txtPrecio.value,rbtAnimal.value,
                                               txtRaza.value,txtFechaNacimiento.value,txtVacuna.value);
    
        if(txtId.value === ''){
            formAnuncio.id=Date.now();
            handlerCreate(formAnuncio);
        }
        else{
            handlerUpdate(formAnuncio);
        }
        restablecerFormulario();
    }
    else{
        return;
    }
})

const handlerCreate = (nuevoAnuncio)=>{
  
  limpiarTabla();
  createAnuncio(nuevoAnuncio);
}

const handlerUpdate = (anuncioEditado) =>{

  limpiarTabla();
  updateAnuncio(anuncioEditado);
}

const handlerDelete = (id)=>{

  limpiarTabla();
  deleteAnuncio(id);
}

function actualizarTabla(data){
  $divTabla.appendChild(crearTabla(data));
  esconderColumnas();
};

function limpiarTabla(){
  while($divTabla.hasChildNodes()){
      $divTabla.removeChild($divTabla.firstChild);
  }
}

function esconderColumnas(){

  $("input:checkbox:not(:checked)").each(function() {
      let column = "table ." + $(this).attr("name");
      $(column).hide();
  });

  $("input:checkbox").click(function(){
      let column = "table ." + $(this).attr("name");
      $(column).toggle();
  });
}

btnCancelar.addEventListener("click", (e)=>{
  restablecerFormulario();
});

function restablecerFormulario(){
  $formulario.reset();

  const i = document.createElement("i");
  i.setAttribute("class", "fa-solid fa-floppy-disk");  
  btnGuardar.innerHTML = "";
  btnGuardar.appendChild(i);
  btnGuardar.appendChild(document.createTextNode("Guardar"));

  btnEliminar.classList.remove("mostrarBoton");
  btnEliminar.classList.add("esconderBoton");
  txtId.value = "";
}

function validarEnvio(){
    const controles = $formulario.elements;

    for (const control of controles) {
      if (control.classList.contains("inputError")) {
        return false;
      }
    }
    return true;
};
  
function validarFormSinCompletar(){
    if ($formulario.txtTitulo.value== "" ||
        $formulario.txtDescripcion.value== "" ||
        $formulario.txtPrecio.value== "" ||
        $formulario.txtRaza.value== "" ||
        $formulario.txtFechaNacimiento.value== ""){
        return true;
    }
    return false;
};

$selAnimal.addEventListener("change", (e)=>{
    
  const $valorSeleccionado = document.getElementById("selAnimal").value;
  
  if($valorSeleccionado == "todos")
  {
      document.getElementById("txtPromedio").value = "0";
  }
  else
  {
      let filtradoPorAnimal = anuncios.filter(x => x.animal ===  $valorSeleccionado).map(x => x);
      document.getElementById("txtPromedio").value = calcularPromedio(filtradoPorAnimal);      
  } 

});

function calcularPromedio(data){

  if(data.length > 0)
  {
    let suma = data.map(x=>x.precio).reduce((a,b)=>a+Number(b),0);
    return (suma / data.length).toFixed(2);
  }
  else
  {
    return 0;
  }
}