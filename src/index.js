document.addEventListener('DOMContentLoaded', () => {
  console.log("catch em!")

let pokArray = []
const pokeUrl = 'http://localhost:3000/pokemon'
const pokeBall = document.querySelector('#pokemon-container')
const pokeSearch = document.querySelector('#pokemon-search-input')
const createPoke = document.querySelector('#new-pokemon-form')
const deleteButton = document.getElementById('.close')


//show POKEMON
function fetchPokemon() {
  fetch(pokeUrl)
  .then(res => res.json())
  .then(data => {
    pokArray = data
    showPokemon(pokArray)
  })
}
fetchPokemon();

function showPokemon(pokemon) {
  pokemonHTML = renderPokemon(pokemon)
  pokeBall.innerHTML = pokemonHTML
}

//render POKEMON
function renderPokemon(pokemon) {
  return pokemon.map(poke => {
    return `
    <div class="pokemon-card">
      <div class="pokemon-frame">
      <button type="button" class="close" aria-label="Close" data-id="${poke.id}">
      X</button>
        <h1 class="center-text">${poke.name}</h1>
        <div class="pokemon-image">
          <img data-id="${poke.id}" data-action="flip" class="toggle-sprite" src="${poke.sprites["front"]}">
        </div>
        <button type="button" class="edit" data-id="${poke.id}">Edit</button>
      </div>
    </div>`
  }).join(" ")
}

//flip da pokeboi
pokeBall.addEventListener('click', event => {
  if (event.target.className === 'toggle-sprite') {
    id = parseInt(event.target.dataset.id)
    targetPoke = pokArray.find(poke => poke.id === id)
    if (event.target.src === targetPoke.sprites.front) {
        event.target.src = targetPoke.sprites.back
      } else {
        event.target.src = targetPoke.sprites.front
      }
  }
})

//filter search
pokeSearch.addEventListener('input', event => {
  let input = pokeSearch.value;
  let filterPokes = pokArray.filter(poke => {
    return poke.name.includes(input)
})
  showPokemon(filterPokes);
})

//create pokeboi
createPoke.addEventListener('submit', event => {
  event.preventDefault();

  form = event.target

  let name = form.querySelector('#new-poke-name').value
  let spriteBack = form.querySelector("#new-poke-back-sprite").value
  let spriteFront = form.querySelector("#new-poke-front-sprite").value

  const configObject = {
    method: "POST",
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify ({
      name: name,
      sprites: {
        front: spriteFront,
        back: spriteBack
      }
    })
  }

  fetch(pokeUrl, configObject)
    .then(res => res.json())
    .then(poke => {
      pokArray.push(poke);
      showPokemon(pokArray)
    })
})// end create listener


//listen for edit pokemon
pokeBall.addEventListener('click', event => {
  id = parseInt(event.target.dataset.id)
  editPoke = pokArray.find(poke => poke.id === id)
  if (event.target.className === 'edit') {
    editForm = event.target.parentNode
    editForm.innerHTML = `
    <form class="form" data-id="${id}" id="edit-pokemon-form" class="" action="index.html" method="post">
       <label for="name">NAME: </label>
       <input id="edit-poke-name" type="text" name="name" value=""><br />
       <label for="front-sprite">Front Image: </label>
       <input id="edit-poke-front-sprite" type="text" name="front-sprite" value=""><br />
       <label for="back-sprite">Back Sprite: </label>
       <input id="edit-poke-back-sprite" type="text" name="back-sprite" value="">
       <button type="submit" name="button">Edit That Pokemon!</button>
    </form>`
  }
})

//edit pokemon
pokeBall.addEventListener('submit', event => {
  event.preventDefault();

  editForm = event.target
  // debugger
  let name = editForm.querySelector('#edit-poke-name').value
  let spriteBack = editForm.querySelector("#edit-poke-back-sprite").value
  let spriteFront = editForm.querySelector("#edit-poke-front-sprite").value

  const configObject = {
    method: "PATCH",
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify ({
      name: name,
      sprites: {
        front: spriteFront,
        back: spriteBack
      }
    })
  }
  debugger
  fetch(`${pokeUrl}/${event.target.dataset.id}`, configObject)
  .then(response => response.json())
  .then(pokemonObj)
  showPokemon(pokArray)
})

// delete pokemon
pokeBall.addEventListener('click', event => {
  if (event.target.className === 'close') {
    event.target.parentNode.parentNode.remove()

    id = parseInt(event.target.dataset.id)
    fetch(`${pokeUrl}/${id}`, {
    method: "DELETE"})
    .then(console.log)
  }
})//end delete listener

})// end DOM listener
