


document.addEventListener('DOMContentLoaded', () => {
  console.log(
        "%c Easy Day",
        "font-weight: bold; font-size: 50px;color: red; text-shadow: 3px 3px 0 rgb(217,31,38) , 6px 6px 0 rgb(226,91,14) , 9px 9px 0 rgb(245,221,8) , 12px 12px 0 rgb(5,148,68) , 15px 15px 0 rgb(2,135,206) , 18px 18px 0 rgb(4,77,145) , 21px 21px 0 rgb(42,21,113)"
      );

  const POKEURL  = "http://localhost:3000/pokemon"
  const topPage = document.querySelector("#container")
  const pokeCon = document.querySelector("#pokemon-container")
  var pokeArr = []
  getPoke()
  addPokeButton()

  function addPokeButton(){
    topPage.children[3].innerHTML =`
      <center><button  id="add"  >Add a Pokemon</button></center>
      `
  }

  function renderAllpokemon(pokeArr){
    pokeCon.innerHTML = pokeArr.map(poke =>{
    return makeDatPoke(poke)
  }).join("")
 }

function getPoke(){
fetch(POKEURL)
  .then(r=>r.json())
  .then(pokemons =>{
    pokeArr = pokemons
    renderAllpokemon(pokeArr)
    topPage.querySelector('center').innerHTML =  `There are ${pokeArr.length} Pokemon  here`
    })
  }

function makeDatPoke(poke){
  return  `
  <div class="pokemon-card">
      <div class="pokemon-frame">
        <h1 class="center-text">${poke.name}</h1>
        <div class="pokemon-image">
          <img data-id="${poke.id}" data-action="flip" id="pic" class="toggle-sprite" src=${poke.sprites.front}>
          <button id="edit" >edit</button>   <button id="del" >delete</button>
        </div>
        <form data-id="${poke.id}" class="edit-pokemon-form" style="display:none">
         <h3>Edit this Pokemon!</h3>
         <input type="text" id ="name" value="" placeholder="Enter new Pokemon's name..." class="input-text">
         <br>
         <input type="text" id="frontImage" value="" placeholder="Enter new Pokemon's front URL..." class="input-text">
         <br>
         <input type="text" id="backImage" value="" placeholder="Enter new Pokemon's back URL..." class="input-text">
         <br>
         <input type="submit" id="edit-submit" name="submit" value="Edit This Pokemon">
       </form>
      </div>
    </div>
  `
}

document.querySelector("body").addEventListener("click", e=> {
  e.preventDefault()
  switch(e.target.id){
    case "add":
    renderCreateform(e)
    break
    case "create-submit":
    addPoke(e)
    break
    case "edit":
    renderEditform(e)
    break
    case "edit-submit":
    editPokemon(e)
    break
    case "del":
    delPokemon(e)
    break
    case "pic":
    flip(e)
    break
  }
})

function renderCreateform(e){
    topPage.children[3].innerHTML = `
    <center>
      <form class="edit-pokemon-form" style="">
     <h3>Add A Pokemon!</h3>
     <input type="text" id ="name" placeholder="Enter Pokemon's name..." class="input-text">
     <br>
     <input type="text" id="frontImage"  placeholder="Enter Pokemon's front URL..." class="input-text">
     <br>
     <input type="text" id="backImage" value="" placeholder="Enter Pokemon's back URL..." class="input-text">
     <br>
     <input type="submit" id="create-submit" name="submit" value="Create a Pokemon">
   </form>
   </center>
  `
}

function addPoke(e){
  name = e.target.parentElement.querySelector("#name").value
  front = e.target.parentElement.querySelector("#frontImage").value
  back = e.target.parentElement.querySelector("#backImage").value
  if (name === "" || front === "" || back === "") {
  alert("You can't leave Dat Pokemon Info blank")
  }
   else {
   fetch(POKEURL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json"
        },
        body: JSON.stringify({
                    name,
                    sprites: {
                      front,
                      back
                    }
        })
      })
      .then(r=>r.json())
      .then(newPoke=>{
      pokeArr.push(newPoke)
      renderAllpokemon(pokeArr)
      pokeCount(pokeArr)
      addPokeButton()
      })
    }
}

function renderEditform(e){
editStatus = e.target.parentNode.parentNode.querySelector("form")
  if (editStatus.style.display === "block" ){
      editStatus.style.display = "none"
    }
    else {
      editStatus.style.display = "block"
    }
}

function editPokemon(e){
  let pokeId = parseInt(e.target.parentElement.dataset.id)

  name = e.target.parentElement.querySelector("#name").value
  front = e.target.parentElement.querySelector("#frontImage").value
  back = e.target.parentElement.querySelector("#backImage").value

  if (name === "" || front === "" || back === "") {
  alert("You can't leave Dat Pokemon Info blank")
 }


  else{
  fetch(`http://localhost:3000/pokemon/${pokeId}`,{
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        "Accept": "application/json"
      },
      body: JSON.stringify({
        name,
        sprites:{
          front,
          back
        }
      })
    }).then(r=>r.json())
      .then(editedPoke=>{
        let oldPoke = pokeArr.find(poke=>{
        return poke.id === editedPoke.id})
        pokeArr[pokeArr.indexOf(oldPoke)] = editedPoke
        renderAllpokemon(pokeArr)
      })
    }
  }

function delPokemon(e){
  let pokeId = parseInt(e.target.parentElement.parentElement.children[1].children[0].dataset.id)

  fetch(`http://localhost:3000/pokemon/${pokeId}`,{
    method: "DELETE"
  })
  let foundPoke = pokeArr.find(poke=>{
  return poke.id === pokeId})
  pokeArr.splice([pokeArr.indexOf(foundPoke)], 1)
  pokeCon.innerHTML = pokeArr.map(poke=>{
  return makeDatPoke(poke)
  }).join("")
  }

  document.querySelector("body").addEventListener("input", e=>{
      if (e.target.id === "pokemon-search-input"){
          let input = e.target.value
          let filterPokes = pokeArr.filter(poke=>{
          return poke.name.includes(input)
        })
          pokeCount(filterPokes)
          pokeCon.innerHTML = filterPokes.map(poke=>{
           return makeDatPoke(poke)
        }).join("")
      }
      pokeCount()
  })

  function flip(e){
    if (!!event.target.dataset.id) {
          let pokemon = pokeArr.find(poke => poke.id == e.target.dataset.id)
          if (e.target.src === pokemon.sprites.front)
           {
            e.target.src = pokemon.sprites.back
          }
          else {
            e.target.src = pokemon.sprites.front
          }
      }
  }

  function pokeCount(filterPokes){
    if (filterPokes)
    topPage.querySelector('center').innerHTML =  `There are ${filterPokes.length} Pokemon  here`
  }

})
