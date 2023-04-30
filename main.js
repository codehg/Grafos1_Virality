// import { getCharacter } from 'rickmortyapi'

var pega = [];

for (var i = 1; i <= 41; i++) {
  fetch(`https://rickandmortyapi.com/api/character/${i}`)
    .then(response => response.json())
    .then(data => {
      var name = data.name;
      pega.push(name)
    })
    .catch(error => console.error(error));
}

function gerarGrafo() {
  var numNos = parseInt(document.getElementById('nos').value);
  var nos = new vis.DataSet();
  var arestas = new vis.DataSet();
  for (var i = 1; i <= numNos; i++) {
      nos.add({id: i, label: pega[i]});
      if (i > 1) {
        var from = i;
        var to = Math.floor(Math.random() * (i - 1)) + 1;
        arestas.add({from: from, to: to});
      }
  }

  // Adiciona arestas extras aleatórias que formam ciclos
  for (var i = 0; i <= numNos; i++) {
    var from = i;
    var to = Math.floor(Math.random() * (numNos - 1)) + 1;
    if (to >= from) {
      to += 1;
    }
    arestas.add({from: from, to: to});
  }
  var data = {
    nodes: nos,
    edges: arestas
  };
  var options = {
    layout: {
      hierarchical: false
    },
    edges: {
      arrows: { to: true, from: false },
      color: '#000000'
    },
    physics: {
      enabled: false
    }
  };

  var container = document.getElementById('grafo');
  var network = new vis.Network(container, data, options);

}