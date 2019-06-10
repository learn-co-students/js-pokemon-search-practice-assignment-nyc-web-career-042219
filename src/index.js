const allPokeData = [];

const fetchPokemon = () => {
  const pokemonData = fetch('http://localhost:3000/pokemon').then(res => res.json());
  pokemonData.then(data => data.forEach(entry => allPokeData.push(entry)));
  return pokemonData;
};

const fetchSpecificPokemon = (pokemonId) => {
  const pokemonData = allPokeData.find(pokemonObj => pokemonObj.id === parseInt(pokemonId, 10));
  return pokemonData;
};

const makePokemonCards = (pokemonJson) => {
  const pokemonContainer = document.getElementById('pokemon-container');
  pokemonJson.then((data) => {
    data.forEach((pokemon) => {
      pokemonContainer.innerHTML += `
        <div class='pokemon-card'>
          <div class='pokemon-frame'>
            <h1 class='center-text'>${pokemon.name}</h1>
            <div class='pokemon-image'>
              <img data-id='${pokemon.id}' data-face='front' data-action='flip' class='toggle-sprite' src='${pokemon.sprites.front}'>
            </div>
            <button id='delete-${pokemon.id}'>Delete Pokemon</button>
            <button data-id='${pokemon.id}' data-action='edit'>Edit Pokemon</button>
          </div>
        </div>
      `;
    });
  });
};

const renderEditForm = (pokemonId) => {
  const pokemonObject = fetchSpecificPokemon(pokemonId);
  const form = `
    <form data-id='${pokemonId}' id='edit-pokemon-form' method='post'>
      <label for="name">NAME: </label>
      <input id="new-poke-name" type="text" name="name" value="${pokemonObject.name}">
      <label for="front-sprite">Front Image: </label>
      <input id="new-poke-front-sprite" type="text" name="front-sprite" value="${pokemonObject.sprites.front}">
      <label for="back-sprite">Back Sprite: </label>
      <input id="new-poke-back-sprite" type="text" name="back-sprite" value="${pokemonObject.sprites.back}">
      <button type="submit" name="edit-button">Edit That Pokemon!</button>
    </form>
  `;
  return form;
};

const pokemonData = fetchPokemon();
makePokemonCards(pokemonData);

const pokemonContainer = document.getElementById('pokemon-container');

pokemonContainer.addEventListener('click', (e) => {
  const pokemonId = e.target.dataset.id;
  const pokemonData = fetchSpecificPokemon(pokemonId);
  const pokemonImg = document.querySelector(`[data-id='${pokemonId}']`);
  if (e.target.dataset.face) {
    if (pokemonImg.dataset.face === 'front') {
      pokemonImg.src = pokemonData.sprites.back;
      pokemonImg.dataset.face = 'back';
    } else if (pokemonImg.dataset.face === 'back') {
      pokemonImg.src = pokemonData.sprites.front;
      pokemonImg.dataset.face = 'front';
    }
  }
  if (e.target.id.includes('delete')) {
    const pokemonObject = fetchSpecificPokemon(e.target.id.slice(7));
    e.target.parentElement.parentElement.remove();
    fetch(`http://localhost:3000/pokemon/${pokemonObject.id}`, {
      method: 'DELETE',
    }).then(res => res.json()).then(json => json);
  }
  if (e.target.dataset.action) {
    const form = renderEditForm(pokemonId);
    e.target.parentElement.innerHTML += form;
  }
});

/* Search */

const filterPokemon = (str) => {
  const filteredPokemon = allPokeData.filter(pokemonObject => pokemonObject.name.includes(str));
  return filteredPokemon;
};

const rewritePokemonContainer = (filteredPokemonArray) => {
  let html = '';
  filteredPokemonArray.forEach((pokemonObject) => {
    html += `        
      <div class='pokemon-card'>
        <div class='pokemon-frame'>
          <h1 class='center-text'>${pokemonObject.name}</h1>
          <div class='pokemon-image'>
            <img data-id='${pokemonObject.id}' data-face='front' data-action='flip' class='toggle-sprite' src='${pokemonObject.sprites.front}'>
          </div>
          <button id='delete-${pokemonObject.id}'>Delete Pokemon</button>
          <button data-id='${pokemonObject.id}' data-action='edit'>Edit Pokemon</button>
        </div>
      </div>
    `;
  });
  pokemonContainer.innerHTML = html;
  return pokemonContainer;
};

const input = document.getElementById('pokemon-search-input');

input.addEventListener('input', (e) => {
  const { value } = e.target;
  const filteredPokemon = filterPokemon(value.toLowerCase());
  rewritePokemonContainer(filteredPokemon);
});

/* End Search */

/* Start dblclick */
pokemonContainer.addEventListener('dblclick', (e) => {
  const pokemonId = e.target.dataset.id;
  const pokemonData = fetchSpecificPokemon(pokemonId);
  if (pokemonData) {
    pokemonContainer.innerHTML = `
    <div class='pokemon-card'>
      <div class='pokemon-frame'>
        <h1 class='center-text'>${pokemonData.name}</h1>
        <div class='pokemon-image'>
          <img data-id='${pokemonData.id}' data-face='front' data-action='flip' class='toggle-sprite' src='${pokemonData.sprites.front}'>
        </div>
        <button id='delete-${pokemonData.id}'>Delete Pokemon</button>
        <button data-id='${pokemonData.id}' data-action='edit'>Edit Pokemon</button>
      </div>
    </div>
    `;
    pokemonData.stats.forEach((stat) => {
      pokemonContainer.innerHTML += `
      <p>${stat.name}: ${stat.value}</p>
      `;
    });
    pokemonData.types.forEach((type) => {
      pokemonContainer.innerHTML += `
      <p>${type}</p>
      `;
    });
    pokemonData.moves.forEach((move) => {
      pokemonContainer.innerHTML += `
      <p>${move}</p>`;
    });
    pokemonData.abilities.forEach((ability) => {
      pokemonContainer.innerHTML += `
      <p>${ability}</p>`;
    });
  }
});

/* End dblclick */

/* CRUD */

const newPokemonForm = document.getElementById('new-pokemon-form');
newPokemonForm.addEventListener('submit', (e) => {
  e.preventDefault();
  const newPokemon = {
    name: e.target[0].value,
    sprites: {
      front: e.target[1].value,
      back: e.target[2].value,
    },
  };
  fetch('http://localhost:3000/pokemon', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(newPokemon),
  }).then(res => res.json()).then((data) => {
    pokemonContainer.innerHTML += `
    <div class='pokemon-card'>
      <div class='pokemon-frame'>
        <h1 class='center-text'>${data.name}</h1>
        <div class='pokemon-image'>
          <img data-id='${data.id}' data-face='front' data-action='flip' class='toggle-sprite' src='${data.sprites.front}'>
        </div>
        <button id='delete-${data.id}'>Delete Pokemon</button>
        <button data-id='${data.id}' data-action='edit'>Edit Pokemon</button>
      </div>
    </div>
    `;
  });
});

pokemonContainer.addEventListener('submit', (e) => {
  e.preventDefault();
  const updatedPokemon = {
    name: e.target[0].value,
    sprites: {
      front: e.target[1].value,
      back: e.target[2].value,
    },
  };
  const pokemonId = e.target.dataset.id;
  fetch(`http://localhost:3000/pokemon/${pokemonId}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(updatedPokemon),
  }).then(res => res.json()).then((data) => {
    e.target.parentElement.innerHTML = `
      <div class='pokemon-frame'>
        <h1 class='center-text'>${data.name}</h1>
        <div class='pokemon-image'>
          <img data-id='${data.id}' data-face='front' data-action='flip' class='toggle-sprite' src='${data.sprites.front}'>
        </div>
        <button id='delete-${data.id}'>Delete Pokemon</button>
        <button data-id='${data.id}' data-action='edit'>Edit Pokemon</button>
      </div>
    `;
  });
});
