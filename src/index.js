document.addEventListener('DOMContentLoaded', () => {
  const pokemonContainer = document.getElementById('pokemon-container')
  const pokemonSearch = document.getElementById('pokemon-search-form')
  const submitForm = document.querySelector('#new-pokemon-form')
  const editForm = document.querySelector('#edit-pokemon-form')
  let pokemons = []
  

  //renders a single pokemon with the appropriate HTML
  function renderPokemon(pokemon){
    return `<div class="pokemon-card" data-id="parentPokemon">
    <div class="pokemon-frame">
      <h1 class="center-text">${pokemon.name}</h1>
      <div class="pokemon-image">
        <img data-id="${pokemon.id}" data-action="flip" class="toggle-sprite" src="${pokemon.sprites.front}">
        <button id="edit" data-id=${pokemon.id}>edit</button>
        <button id="delete" data-id=${pokemon.id}>delete</button>
      </div>
    </div>
  </div>`
  }

  //displaying all pokemon with the approprite html
  function displayPokemon(pokemons){
    let pokemonHTML = pokemons.map(renderPokemon)
    return pokemonContainer.innerHTML = pokemonHTML.join('')
  }

  function renderEditForm(){
    return `
    <form class="form" id="edit-pokemon-form" class="" action="index.html" method="patch">
    <label for="name">NAME: </label>
      <input id="edit-poke-name" type="text" name="name" value="">
      <label for="front-sprite">Front Image: </label>
      <input id="edit-poke-front-sprite" type="text" name="front-sprite" value="">
      <label for="back-sprite">Back Sprite: </label>
      <input id="edit-poke-back-sprite" type="text" name="back-sprite" value="">
      <button type="submit" name="button">Create That Pokemon!</button>
  </form>`
  }


  fetch('http://localhost:3000/pokemon')
  .then(response => response.json())
  .then(pokemonData => {
    pokemons = pokemonData
    displayPokemon(pokemons)
  })

  pokemonContainer.addEventListener('click', (event) => {
    //if (event.target.dataset.action === 'flip')
    if (event.target.className === 'toggle-sprite') {
      //from the array of pokemon objects(pokemons), we want to "find" the pokemon  ID from our event target and our actual pokemon objects (pokemons) ID's. We  set that equal to make sure we are clicking and returning the associated ID's
      const targetedPokemon = pokemons.find(pokemonObject => pokemonObject.id ==  event.target.dataset.id)
      if (event.target.src === targetedPokemon.sprites.front) {
        event.target.src = targetedPokemon.sprites.back
      } else {
        event.target.src = targetedPokemon.sprites.front
      }
    }

    if (event.target.id === 'delete'){
      fetch('http://localhost:3000/pokemon'+ '/' + event.target.dataset.id, {
        method: 'DELETE'
      })
        event.target.parentNode.parentNode.remove()
    }

    if (event.target.id === 'edit'){
      event.target.parentElement.innerHTML += renderEditForm()
    }
  })

  pokemonSearch.addEventListener('input', (event) => {
    const filteredPokemon = pokemons.filter(pokeObject => pokeObject.name.includes(event.target.value.toLowerCase()))
    const filteredPokemonHTML = displayPokemon(filteredPokemon)
    pokemonContainer.innerHTML = filteredPokemonHTML
    // ? filteredPokemonHTML : `<p><center>There are no Pokémon here</center></p>`
  })

  submitForm.addEventListener('submit', (event) => {
    event.preventDefault()
    let name = document.getElementById('new-poke-name').value
    let frontSprite = document.getElementById('new-poke-front-sprite').value
    let backSprite = document.getElementById('new-poke-back-sprite').value
  
    fetch('http://localhost:3000/pokemon', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify({
        name: name,
        sprites: {
          front: frontSprite,
          back: backSprite 
        }
      })
    })
    .then(response => response.json())
    .then(data => {
      pokemons.push(data)
      displayPokemon(pokemons)
    })

  })

  pokemonContainer.addEventListener('submit', (event) =>{
    event.preventDefault()
    let editName = event.target.children[1].value
    let editFront = event.target.children[3].value
    let editBack = event.target.children[5].value
    let pokemonId = event.target.parentElement.firstElementChild.dataset.id
    
  
    fetch('http://localhost:3000/pokemon' + '/' + pokemonId, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify({
        name: editName,
        sprites: {
          front: editFront,
          back: editBack 
        }
      })
    })
    let targetPokemon = pokemons.find(pokemonObject => pokemonObject.id == pokemonId)
    targetPokemon.name = editName
    targetPokemon.front = editFront
    targetPokemon.front = editBack
    
    event.target.parentNode.parentNode.getElementsByClassName('center-text')[0].innerText = editName
    event.target.parentElement.children[0].src = editFront
    event.target.reset()
  })
  



})