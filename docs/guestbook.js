/**
 * Web application
 */
const apiUrl = 'https://48d79a8b.eu-gb.apiconnect.appdomain.cloud/guestbook';
const guestbook = {
  // retrieve the existing guestbook entries
  get() {
    return $.ajax({
      type: 'GET',
      url: `${apiUrl}/entries`,
      dataType: 'json'
    });
  },
 
  modificarPreferencias(name, email, comment,_id,_rev) {
    console.log('Sending',name, email, comment,_id,_rev)
    return $.ajax({
      type: 'PUT',
      url: `${apiUrl}/modificarPreferencias`,
      contentType: 'application/json; charset=utf-8',
      data: JSON.stringify({
        name,
        email,
        comment,
	_id,
	_rev
      }),
      dataType: 'json',
    });
  },
  // add a single guestbood entry
  add(name, email, comment) {
    console.log('Sending', name, email, comment)
    return $.ajax({
      type: 'PUT',
      url: `${apiUrl}/entries`,
      contentType: 'application/json; charset=utf-8',
      data: JSON.stringify({
        name,
        email,
        comment,
      }),
      dataType: 'json',
    });
  }
};
 
(function() {
 
 /* let entriesTemplate;
 
  function prepareTemplates() {
    entriesTemplate = Handlebars.compile($('#entries-template').html());
  }*/
 
  // retrieve entries and update the UI
  function loadEntries() {
  //  console.log('Loading entries...');
  //  $('#entries').html('Loading entries...');
    guestbook.get().done(function(result) {
      if (!result.entries) {
        return;
      }
     contadorVotos(result.entries); 
 
    }).error(function(error) {
      $('#entries').html('No entries');
      console.log(error);
    });
  }
 
function refreshPage(){
window.location.href=window.location.href
}
 
  function contadorVotos(votos) {
    var votosTotales = votos.length;
    var v_D = 0;
    var v_S = 0;
    var v_A = 0;
 
    for (i = 0; i < votosTotales; i++) {
      if (votos[i].comment == "Deportes"){
        v_D++;
      } else if (votos[i].comment == "Shooter"){
        v_S++;
      } else{
        v_A++;
      }
    }
 
 /*var resultContador = {
  v_D: v_D,
  v_S: v_S,
  V_A: v_A,
};*/
 
//$('.resultsDeportes').html(v_D);
//$('.resultsShooter').html(v_S);
//$('.resultsAventuras').html(v_A);
 
new Chart(document.getElementById("pie-chart"), {
    type: 'pie',
    data: {
      labels: ["Deportes", "Shooters", "Aventuras"],
      datasets: [{
        label: "Votaciones",
        backgroundColor: ["#3e95cd", "#8e5ea2","#3cba9f"],
        data: [v_D,v_S,v_A]
      }]
    },
    options: {
      title: {
        display: true,
        text: 'Resultados de las votaciones'
      }
    }
});
 
 
//return resultContador;
  }
 
  // intercept the click on the submit button, add the guestbook entry and
  // reload entries on success
  $(document).on('submit', '#addEntry',  function(e) {
    e.preventDefault();
    var _id = "";
    var _rev = "";   
    //var doc = "";
	var checkDoc = false;
    guestbook.get().done(function(result) {
    if (!result.entries) {
        return;
    } 
    //TO DO: Se debería de crear una consulta a la bbdd buscando el mail
    if (result.entries.length > 0) {
          for (i = 0; i < result.entries.length; i++) {
	   //Comparar campo clave mail 
            if ($('#email').val().trim() == result.entries[i].email) {
              _id = result.entries[i]._id;
              _rev = result.entries[i]._rev;
              checkDoc = true;
              break;
            }
          }
        }   
	if (checkDoc) {
     guestbook.modificarPreferencias(
     $('#name').val().trim(),
     $('#email').val().trim(),
     $('input[name=comment]:checked').val(),
		_id,
		_rev
    ).done(function(result) {
    // reload entries
    loadEntries();
     }).error(function(error) {
      console.log(error);
     });
           
    } else {
		guestbook.add(
		$('#name').val().trim(),
		$('#email').val().trim(),
		$('input[name=comment]:checked').val()
		).done(function(result) {
      // reload entries
      loadEntries();    
          });
        }
      });
 
  });
 
  $(document).ready(function() {
    //prepareTemplates();
    loadEntries();
  });
})();
