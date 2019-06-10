document.addEventListener('DOMContentLoaded', () => {
  // console.log(POKEMON)
  //YOUR CODE HERE

  var pokemonArray = []

  let pokemonContainer = document.querySelector('#pokemon-container')
  let searchBar = document.querySelector('#pokemon-search-input')

  function displayPokemon(data) {
    pokemonContainer.innerHTML = data.map(function(pokemon) {
      return `
        <div class="pokemon-card">
        <div class="pokemon-frame">
          <h1 class="center-text">${pokemon.name}</h1>
          <div class="pokemon-image">
            <img data-id="${pokemon.id}" data-action="flip" class="toggle-sprite" src="${pokemon.sprites.front}">
          </div>
        </div>
      </div>
      `
    }).join("")
  }

  pokemonContainer.addEventListener('click', event => {
    console.log(event.target.dataset.id)
    if (!!event.target.dataset.id) {
      console.log(event.target.src)
      let target = pokemonArray.find(pokemon => pokemon.id == event.target.dataset.id)
      console.log(target)
      if (event.target.src === target.sprites.front)
       {
        event.target.src = target.sprites.back
      }
      else {
        event.target.src = target.sprites.front
      }
    }
  })

 searchBar.addEventListener('keydown', event => {
    console.log(event)
    console.log(searchBar.value)
    filterPokemon(pokemonArray, searchBar.value)
  })
  
  function filterPokemon(pokemonArray, query) {
    let actuallyFilter = pokemonArray.filter(function(el) {
      return el.name.toLowerCase().indexOf(query.toLowerCase()) !== -1;
    })
    displayPokemon(actuallyFilter)
  }
  
  let pokemonList = fetch('http://localhost:3000/pokemon')
  .then(function(response) {
    return response.json();
  })
  .then(function(myJson) {
    console.log(JSON.stringify(myJson));
    pokemonArray = myJson
    displayPokemon(pokemonArray)
  });

})
