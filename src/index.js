const POKE_URL = 'http://localhost:3000/pokemon';
const POKE_ARRAY = [];

document.addEventListener('DOMContentLoaded', () => {
  const pokeContainer = document.querySelector('#pokemon-container')
  document.querySelector('center').remove();
  pokeContainer.prepend(createForm());

  fetchPokemon(pokeContainer);

  let flip = false;

  pokeContainer.addEventListener('click', function (e) {
    if (e.target.dataset.action === 'flip') {
      let pokemon = findPokemon(e.target.dataset.id);

      e.target.src = (!flip) ? pokemon.sprites.back : pokemon.sprites.front;
      flip = !flip;
    } else if (e.target.name === 'del-pokemon') {
      deletePokemon(e);
    } else if (e.target.name === 'edit-pokemon') {
      editPokemon(e);
    }
  })

  pokeContainer.addEventListener('submit', function (e) {
    e.preventDefault();

    if (e.target.id === 'new-pokemon-form')
      createNewPokemon(e, pokeContainer);
  })

  //hover over and show cool stuff
  pokeContainer.addEventListener('mouseover', function (e) {
    if (e.target.className === 'pokemon-frame') {
      let hoverText = document.createElement('div');
      let imageDiv = e.target.children[1];

      hoverText.innerHTML = showStats(findPokemon(imageDiv.firstElementChild.dataset.id));
      imageDiv.firstElementChild.style.opacity = 0;
      imageDiv.prepend(hoverText);
    }
  })

  pokeContainer.addEventListener('mouseout', function (e) {
    if (e.target.className === 'pokemon-frame') {
      let pokemonImage = e.target.children[1];
      pokemonImage.insertBefore(pokemonImage.children[1], pokemonImage.children[0])
      pokemonImage.children[0].style.opacity = 1;
      //delete that hover div
      pokemonImage.children[1].remove();
    }
  })

  //SEARCH 
  const search = document.querySelector('#pokemon-search-input');

  search.addEventListener('input', function (e) {
    const pokemon = document.querySelectorAll('.center-text');
    let input = e.target.value;

    pokemon.forEach(function (pokeName) {
      pokeName.parentNode.parentNode.style.display = (pokeName.innerText.includes(input)) ? 'block' : 'none';
    })
  })
})

function fetchPokemon(pokeContainer) {
  fetch(POKE_URL)
    .then(res => res.json())
    .then(function (json) {
      json.forEach(function (pokemon) {
        pokeContainer.appendChild(pokeCard(pokemon))
        POKE_ARRAY.push(pokemon);
      })
    })
}

function pokeCard(pokemon) {
  let card = document.createElement('div')
  card.className = 'pokemon-card'
  card.innerHTML = `
    <div class="pokemon-frame">
      <h1 class="center-text"> ${pokemon.name} </h1>
      <div class="pokemon-image">
          <img data-id="${pokemon.id}" data-action="flip" class="toggle-sprite" src="${pokemon.sprites.front}">
      </div>
      <button type='submit' data-id='${pokemon.id}' name='edit-pokemon'> edit </button>
      <button type='submit' data-id='${pokemon.id}' name='del-pokemon'> x </button>
    </div>`
  return card;
}

function findPokemon(id) {
  let index = Number(id);
  return POKE_ARRAY.find(function (poke) {
    return poke.id === index;
  })
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
  let name = e.target.children[1].value;
  let front = e.target.children[3].value;
  let back = e.target.children[5].value;

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
    .then(function (json) {
      pokeContainer.appendChild(pokeCard(json));
      POKE_ARRAY.push(json);
    })
  e.target.reset();
  alert(`Created ${name}!`);
}

function deletePokemon(e) {
  fetch(POKE_URL + '/' + e.target.dataset.id, {
    method: 'DELETE',
    headers: { 'Content-Type': 'application/json' }
  })
  //remove from DOM and remove from array
  e.target.parentNode.parentNode.remove();
  let element = POKE_ARRAY.find(function (pokeElement) {
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
  let pokeElement = POKE_ARRAY.find(function (pokeElement) {
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
  if (pokemon.stats) {
    for (let i = 0; i < pokemon.stats.length; i++) {
      switch (pokemon.stats[i]['name']) {
        case 'hp': hp = pokemon.stats[i]['value']; break;
        case 'attack': atk = pokemon.stats[i]['value']; break;
        case 'defense': def = pokemon.stats[i]['value']; break;
        case 'special-attack': spAtk = pokemon.stats[i]['value']; break;
        case 'special-defense': spDef = pokemon.stats[i]['value']; break;
        case 'speed': speed = pokemon.stats[i]['value']; break;
      }
    }
    return `
      <font size='0.5'> 
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
    return `<font size='2'> Does not have stats! </font>`
  }
}