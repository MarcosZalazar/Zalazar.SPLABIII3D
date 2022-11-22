export { getAll, createAnuncio, updateAnuncio,deleteAnuncio, anuncios};

let anuncios = [];

const URL="http://localhost:3000/anuncios";  
const divSpinner = document.getElementById("spinner");

const cargarSpinner=(div,src)=> {
  const img = document.createElement("img");
  img.setAttribute("src", src);
  img.setAttribute("alt", "spinner");
  div.appendChild(img);
};

const sacarSpinner = (div)=>{
  while(div.hasChildNodes()){
    div.removeChild(div.firstElementChild);
  }
};


const getAll = (callback) =>{
    
  cargarSpinner(divSpinner,"./imagenes/spinner.gif");
    const xhr = new XMLHttpRequest();  
    xhr.onreadystatechange = ()  => {
      if (xhr.readyState == 4){
        if (xhr.status >= 200 && xhr.status < 300) {
          const data = JSON.parse(xhr.responseText);
          anuncios = data;
          callback(anuncios);         
        } else {
          console.error(`Error: ${xhr.status} - ${xhr.statusText} `);          
        }
        sacarSpinner(divSpinner);   
      } 
    };
    
    xhr.open("GET", URL);
    xhr.send();
  };


function createAnuncio(anuncio){  

  cargarSpinner(divSpinner,"./imagenes/spinner.gif");
  const options={
      method: "POST",
      headers: {
          "Content-Type": "application/json"
      },
      body: JSON.stringify(anuncio)
  };   


  fetch(URL, options)
  .then(response => response.ok ? response.json() : Promise.reject(new Error(`Error: ${response.status} : ${response.statusText} `)))
  .then((data)=>{
      anuncios = data;  
  }) 
  .catch(error => {
      console.error(error);
      alert(error);
  })
  .finally(() => {
    sacarSpinner(divSpinner);
  });     
};


function deleteAnuncio(id){

  cargarSpinner(divSpinner,"./imagenes/spinner.gif");
  const options={
    method: "DELETE"        
  };   

  fetch(URL +"/" + id, options)
  .then(response => response.ok ? response.json() : Promise.reject(new Error(`Error: ${response.status} : ${response.statusText} `)))
  .then((data)=>{
    anuncios = data;
  }) 
  .catch(error => {
    alert(error);
  })
  .finally(() => {
    sacarSpinner(divSpinner);
  });  
};


function updateAnuncio(anuncio){

  cargarSpinner(divSpinner,"./imagenes/spinner.gif");
  const options={
    method: "PUT",
    headers: {
      "Content-Type": "application/json"
      },
    body: JSON.stringify(anuncio)
  };   

  fetch(URL +"/" + anuncio.id, options)
  .then(response => response.ok ? response.json() : Promise.reject(new Error(`Error: ${response.status} : ${response.statusText} `)))
  .then((data)=>{
    anuncios = data;
  }) 
  .catch(error => {
    console.error(error);
    alert(error);
  })
  .finally(() => {
    sacarSpinner(divSpinner);
  });       
};

