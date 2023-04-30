var imagem = 'image/virus.png'
var pega = [];
var pegaImagem = [];

for (var i = 1; i <= 101; i++) {
  fetch(`https://rickandmortyapi.com/api/character/${i}`)
    .then(response => response.json())
    .then(data => {
      var name = data.name;
      var image = data.image;
      pega.push(name)
      pegaImagem.push(image)
    })
    .catch(error => console.error(error));
}

function gerarGrafo() {
  var numNos = parseInt(document.getElementById('nos').value);
  var nos = new vis.DataSet();
  var arestas = new vis.DataSet();
  for (var i = 1; i <= numNos; i++) {
      nos.add({id: i, shape: 'circularImage', image: pegaImagem[i], label: pega[i]});
      console.log('Grafo gerado', 'Id:', i, 'pega', pega[i])
      if (i > 1) {
        var from = i;
        var to = Math.floor(Math.random() * (i - 1)) + 1;
        arestas.add({from: from, to: to});
      }
  }

  // Adiciona arestas aleatórias que formam ciclos
  for (var i = 0; i <= numNos; i++) {
    var from = i;
    var to = Math.floor(Math.random() * (numNos - 1)) + 1;
    if (to >= from) {
      to += 1;
    }
    arestas.add({from: from, to: to});
  }

  var infectado = 0;
  var infectadoNode;
  function onSelectNode(event) {
    var nodeId = event.nodes[0];
    var node = nos.get(nodeId);
    if(infectado === 0){
        node.image = imagem;
        nos.update(node);
        infectadoNode = node;
        infectado = 1;
        bfs(nodeId);
    }
  }


  function bfs(nodeId) {
    var queue = [nodeId];
    var visited = new Set();
    visited.add(nodeId);
    var iteration = 0;
    while (queue.length > 0) {
      var currentNodeId = queue.shift();
      var connectedNodes = network.getConnectedNodes(currentNodeId);
      for (var i = 0; i < connectedNodes.length; i++) {
          var node = nos.get(connectedNodes[i]);
          if (node.image !== imagem && !visited.has(connectedNodes[i]) && i === 0) {
              node.image = imagem;
              nos.update(node);
              visited.add(connectedNodes[i]);
              queue.push(connectedNodes[i]);
          }
      }
      console.log('Node visitado na iteração', iteration + 1, ':', nos.get(currentNodeId).label);
      iteration++;
    }
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
      color: '#ffffff'
    },
    physics: {
      enabled: false
    }
  };

  var container = document.getElementById('grafo');
  var network = new vis.Network(container, data, options);
  network.on("selectNode", onSelectNode);
}