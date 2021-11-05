<script type="text/javascript">
  /* ***** cytoscape.js ***** */
  const cy_style = [
  { selector: 'edge', style: { 'curve-style': 'bezier', 'width': 3, 'label': 'data(name)', 'opacity': '0.6', 'z-index': '0' } },
  { selector: 'node', style: { 'font-size': '22', 'font-weight': 'bold' , 'label': 'data(name)', 'text-wrap': 'wrap', 'text-max-width': '280', 'text-valign': 'center', 'text-halign': 'center', 'shape': 'round-rectangle', 'padding': '20', 'border-width': 3, 'border-color': 'black', 'border-style': 'solid', 'width': 'label', 'height': 'label' } },
  { selector: 'node[type="people_only"]', style: { 'background-color': '#97c2fc' } },
  { selector: 'node[type="people"]', style: { 'background-color': '#ffff80' } },
  { selector: 'node[type="juridical_persons"]', style: { 'background-color': '#ffb4b4' } },
  { selector: 'node[type="estates"]', style: { 'background-color': '#99ff99' } },
  { selector: 'node[type="places"]', style: { 'background-color': '#c2c2ff' } },
  { selector: 'edge[type="red"]', style: { 'line-color': 'red', 'target-arrow-color': 'red' } },
  { selector: 'edge[type="green"]', style: { 'line-color': 'green', 'target-arrow-color': 'green' } },
  { selector: 'edge[type="blue"]', style: { 'line-color': 'blue', 'target-arrow-color': 'blue' } },
  { selector: 'edge[type="orange"]', style: { 'line-color': 'orange', 'target-arrow-color': 'orange' } },
  { selector: 'edge[subtype="arrow"]', style: { 'target-arrow-shape': 'triangle' } },
  { selector: 'edge[cert="low"]', style: { 'line-style': 'dashed' } },
  
  {selector: 'node.searched', style: {'border-width': 10, 'border-color': 'red'} },
  {selector: '.hidden', style: {'display': 'none'} },
  {selector: '.hidden_label', style: {'label': ''} },
  {selector: 'node:selected', style: {'border-width': 10, 'border-color': 'orange', 'z-index': '99999', 'font-size': '80'} }
  ];
  
  var inputSearch = "inputSearch", inputVal = "#inputSearch", btnSearch = "#btnSearch", reset = "#reset";
  var toggle_people = "toggle_people", toggle_juridical_persons = "toggle_juridical_persons", toggle_estates = "toggle_estates", 
  toggle_places = "toggle_places", toggle_red = "toggle_red", toggle_green = "toggle_green", toggle_blue = "toggle_blue", 
  toggle_orange = "toggle_orange", toggle_labels = "toggle_labels", toggle_alleged = "toggle_alleged";
  
  const cy_layout = { name: 'fcose', animate: false, nodeRepulsion: 100000000, nodeSeparation: 100, randomize: true, idealEdgeLength: 300,  boxSelectionEnabled: true, selectionType: 'additive' };
  
  var cy = cytoscape({ container: document.getElementById(my_graph), elements: graph_items, style: cy_style, layout: cy_layout }).panzoom();      
  
  /*fullscreen*/
  var full = box;
  function openFullscreen() {
  if (document.getElementById(full).requestFullscreen) { document.getElementById(full).requestFullscreen(); } 
  else if (document.getElementById(full).webkitRequestFullscreen) { document.getElementById(full).webkitRequestFullscreen();} 
  else if (document.getElementById(full).msRequestFullscreen) { document.getElementById(full).msRequestFullscreen(); } } 
  
  /*toggle*/
  document.getElementById(toggle_people).addEventListener("click", function() { cy.$('[type="people"]').toggleClass('hidden'); });
  document.getElementById(toggle_juridical_persons).addEventListener("click", function() { cy.$('[type="juridical_persons"]').toggleClass('hidden'); });
  document.getElementById(toggle_estates).addEventListener("click", function() { cy.$('[type="estates"]').toggleClass('hidden'); });
  document.getElementById(toggle_places).addEventListener("click", function() { cy.$('[type="places"]').toggleClass('hidden'); });
  document.getElementById(toggle_red).addEventListener("click", function() { cy.$('[type="red"]').toggleClass('hidden'); });
  document.getElementById(toggle_alleged).addEventListener("click", function() { cy.$('[cert="low"]').toggleClass('hidden'); });
  document.getElementById(toggle_green).addEventListener("click", function() { cy.$('[type="green"]').toggleClass('hidden'); });
  document.getElementById(toggle_blue).addEventListener("click", function() { cy.$('[type="blue"]').toggleClass('hidden'); });
  document.getElementById(toggle_orange).addEventListener("click", function() { cy.$('[type="orange"]').toggleClass('hidden'); });
  document.getElementById(toggle_labels).addEventListener("click", function() { cy.edges().toggleClass('hidden_label'); }); 
  
  /*autocomplete + search + show only selected + reset*/
  autocomplete(document.getElementById(inputSearch), graph_labels);
  
  $(btnSearch).on('click',function () { 
  cy.elements().removeClass('searched').addClass('hidden');
  cy.$('[name =  "' + $(inputVal).val() + '"]').addClass('searched').removeClass('hidden').select(); 
  cy.$('[name =  "' + $(inputVal).val() + '"]').neighborhood().removeClass('hidden'); 
  cy.$(':selected').addClass('searched').removeClass('hidden');
  cy.$(':selected').neighborhood().removeClass('hidden');
  cy.fit(cy.$(':selected').closedNeighborhood(), 10);
  });
  
  cy.nodes().on('cxttap', function(e){
  e.target.addClass('searched').select(); 
  e.target.neighborhood().removeClass('hidden'); 
  cy.fit(cy.$('searched').closedNeighborhood(), 10);
  });
  
  $(reset).on('click',function () { 
  cy.elements().removeClass('searched').removeClass('hidden').unselect(); 
  cy.fit(cy.elements, 10);
  return $('#inputSearch').val('');
  });
</script>