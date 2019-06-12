const POKE_URL = 'http://localhost:3000/pokemon';
const POKE_ARRAY = [];

document.addEventListener('DOMContentLoaded', () => {
  const pokeContainer = document.querySelector('#pokemon-container');
  const searchForm = document.querySelector('#pokemon-search-input');
  fetchPokemon(pokeContainer);
  pokeContainer.prepend(createForm());

  let flip = false;

  ['click', 'submit', 'mouseover', 'mouseout'].forEach(event => pokeContainer.addEventListener(event, eventHandler, false));

  searchForm.addEventListener('input', function(e){
    const pokemon = document.querySelectorAll('.center-text');
    let input = e.target.value;

    pokemon.forEach(function(pokeName){
      pokeName.parentNode.parentNode.style.display = (pokeName.innerText.includes(input)) ? 'block' : 'none';
    })
  })
})

const eventHandler = function(e) {
  switch(e.type) {
    case 'mouseover': {
      if (e.target.className === 'pokemon-frame') {
        e.target.children[1].style.display = '';
        e.target.children[2].style.display = 'none';
      }
      break;
    }
    case 'mouseout': {
      if (e.target.className === 'pokemon-frame') {
        e.target.children[1].style.display = 'none';
        e.target.children[2].style.display = '';
      }
      break;
    }
    case 'click': {
      switch(e.target.className) {
        case 'toggle-sprite': toggleSprite(e); break;
        case 'del-pokemon': deletePokemon(e); break;
        case 'edit-pokemon': editPokemon(e); break;
      }
      break;
    }
  }
}

function findPokemon(id) {
  let index = Number(id);
  return POKE_ARRAY.find(function(poke) {
    return poke.id === index;
  })
}

function fetchPokemon(pokeContainer) {
  fetch(POKE_URL)
  .then(res => res.json())
  .then(function(json){
    //add all pokemon from json to the container
    let allPokemon = json.map(pokemon => createPokemon(pokemon));
    pokeContainer.innerHTML += allPokemon.join('')
    //render the amount of pokemon
    pokeContainer.getElementsByTagName('center')[0].innerText = `There are ${allPokemon.length} Pokémon here`;
  })
}

function createPokemon(pokemon) {
  POKE_ARRAY.push(pokemon);
  return `
  <div class='pokemon-card'>
    <div class="pokemon-frame">
      <h1 class="center-text"> ${pokemon.name} </h1>
      <div class='hover' style='display: none'> ${showStats(pokemon)} </div>
      <div class="pokemon-image">
          <img data-id="${pokemon.id}" data-action="flip" class="toggle-sprite" src="${pokemon.sprites.front}">
      </div>
      <button type='submit' data-id='${pokemon.id}' class='edit-pokemon'> edit </button>
      <button type='submit' data-id='${pokemon.id}' class='del-pokemon'> x </button>
    </div>
  </div>`;
}

function toggleSprite(e) {
  let pokemon = findPokemon(e.target.dataset.id);

  e.target.src = (e.target.src !== pokemon.sprites.back) ? pokemon.sprites.back : pokemon.sprites.front;
}

function createForm() {
  const form = document.createElement('form');
  form.className = 'form';
  form.id = 'new-pokemon-form';
  form.action = 'index.html';
  form.method = 'post';
  form.innerHTML = `
    <label for="name">NAME: </label>
    <input id="new-poke-name" type="text" name="name" value="">
    <label for="front-sprite">Front Image: </label>
    <input id="new-poke-front-sprite" type="text" name="front-sprite" value="">
    <label for="back-sprite">Back Sprite: </label>
    <input id="new-poke-back-sprite" type="text" name="back-sprite" value="">
    <button type="submit" name="button">Create That Pokemon!</button>
  `
  return form;
}

function createNewPokemon(e, pokeContainer) {
  debugger
  let name = e.target[0].value;
  let front = e.target[1].value;
  let back = e.target[2].value;

  fetch(POKE_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      name,
      sprites: {
        front,
        back
      }
    })
  })
  .then(resp => resp.json())
  .then(function(json) {
    pokeContainer.appendChild(pokeCard(json));
    POKE_ARRAY.push(json);
  })
  e.target.reset();
  alert(`Created ${name}!`);
}

function deletePokemon(e) {
  fetch(POKE_URL + '/' + e.target.dataset.id, {
    method: 'DELETE',
  })
  //remove from DOM and remove from array
  e.target.parentNode.parentNode.remove();
  let element = POKE_ARRAY.find(function(pokeElement) {
    return pokemon.id === pokeElement.id
  })
  element.remove();
}

function editPokemon(e) {
  let pokemon = findPokemon(e.target.dataset.id)
  let name = prompt('Edit Name:', pokemon.name);
  let front = prompt('Edit Front Image:', pokemon.sprites.front);
  let back = prompt('Edit Back Image', pokemon.sprites.back);

  fetch(POKE_URL + '/' + pokemon.id, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      name,
      sprites: {
        front,
        back
      }
    })
  }) 
  
  //update array
  let pokeElement = POKE_ARRAY.find(function(pokeElement) {
    return pokemon.id === pokeElement.id
  })
  pokeElement.sprites.front = front;
  pokeElement.sprites.back = back;

  //re-render DOM with editted stuff
  e.target.parentNode.getElementsByClassName('center-text')[0].innerText = name;
  e.target.parentNode.getElementsByClassName('pokemon-image')[0].firstChild.src = front;
}

function addImage(pokemon) {
  let image = document.createElement('div')
  image.className = 'pokemon-image';
  image.innerHTML = `
    <img data-id="${pokemon.id}" data-action="flip" class="toggle-sprite" src="${pokemon.sprites['front']}">
  `
  return image;
}

function showStats(pokemon) {
  let hp, atk, def, speed, spDef, spAtk;
  // check and see if the pokemon has stats in the json
  if(pokemon.stats) {
    for(let i = 0; i < pokemon.stats.length; i++) {
      switch(pokemon.stats[i]['name']) {
        case 'hp': hp = pokemon.stats[i]['value']; break;
        case 'attack': atk = pokemon.stats[i]['value']; break;
        case 'defense': def = pokemon.stats[i]['value']; break;
        case 'special-attack': spAtk = pokemon.stats[i]['value']; break;
        case 'special-defense': spDef = pokemon.stats[i]['value']; break;
        case 'speed': speed = pokemon.stats[i]['value']; break;
      }
    }
    return `
      <font size='2'> 
        <ul>
        <li> HP: ${hp} </li>
        <li> Attack: ${atk} </li>
        <li> Defense: ${def} </li>
        <li> Sp-Attack: ${spAtk} </li>
        <li> Sp-Defense: ${spDef} </li>
        <li> Speed: ${speed} </li>
        </ul>
      </font>
    `
  } else {
    return `<font size='3'> Does not have stats! </font>`
  }
}