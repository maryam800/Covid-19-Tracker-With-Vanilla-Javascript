const baseUrl = "https://corona.lmao.ninja/v2";
let form = document.getElementById("form");
let search = document.getElementById("search");
let main = document.querySelector(".result-body");
let generalInfo = document.getElementById("general-info");

function getDataForAll() {
  axios
    .get(`${baseUrl}/all`)
    .then((res) => {
      let info = res.data;
      let content = `
                 <div>
                        <h3>${addCommas(info.updated)}</h3>
                        <p class="text-light">Total Confirmed</p>
                    </div>
                    <div>
                        <h3>${addCommas(info.deaths)}</h3>
                        <p class="text-light">Total Deaths</p>
                    </div>
                    <div>
                        <h3>${addCommas(info.recovered)}</h3>
                        <p class="text-light">Total Recovered</p>
                    </div>
                    <div>
                        <h3>${addCommas(info.cases)}</h3>
                        <p class="text-light">Active Case</p>
                    </div>

        `;
      generalInfo.innerHTML = content;
    })
    .catch((err) => {
      showAlert(err.response.data.message, "danger");
    });
}
getDataForAll();
function getDataForSpecifCountry(iso){

  axios
  .get(`${baseUrl}/countries/${iso}`)
  .then((res) => {
    let info = res.data;
    console.log(info)
    main.innerHTML=''
    let content=
    `
        <span>${info.country}</span>
        <span>${info.cases}</span>
        <span>${info.recovered}</span>
        <span>${info.deaths}</span>
    `
    main.innerHTML=content
    
  })
  .catch((err) => {
    showAlert(err.response.data.message, "danger");
  });

}




function getCountryIsoCode(country){
  let countryName=convertCountryToCapitalLetter(country)
  axios
    .get(`https://countrycode.dev/api/countries/${countryName}`)
    .then((res) => {
      let info = res.data[0].ISO2;
      getDataForSpecifCountry(info)
    })
    .catch((err) => {
      showAlert(err.response.data.message, "danger");
    });
}
form.addEventListener('submit' ,(e)=>{
  e.preventDefault()
  let country=search.value
  if(country){
    getCountryIsoCode(country)
      search.value=''
  }
})
//Convert user Input To First Capital Letter  
function convertCountryToCapitalLetter(country){
  let space=country.indexOf(' ')
  let countryName='';
  if(space === -1){
   countryName=country.charAt(0).toUpperCase() + country.slice(1);
  }
  else{
    let firstPart=country.substring(0,space);
    let secondPart=country.substring(space+1,country.length)
    console.log(firstPart)
    console.log(secondPart)
    countryName=(firstPart.charAt(0).toUpperCase()+firstPart.slice(1))+ " " +(secondPart.charAt(0).toUpperCase()+secondPart.slice(1))
    console.log(countryName)
  }
  return countryName;
}
 // Add Commas In Long Number 
function addCommas(n){
  var rx=  /(\d+)(\d{3})/;
  return String(n).replace(/^\d+/, function(w){
      while(rx.test(w)){
          w= w.replace(rx, '$1,$2');
      }
      return w;
  });
}
//show alert if somthing wrong happen with user
function showAlert(customMsg, type) {
  const alertPlaceholder = document.getElementById("show-alert");

  const alert = (message, type) => {
    const wrapper = document.createElement("div");
    wrapper.innerHTML = [
      `<div class="alert alert-${type} alert-dismissible" role="alert">`,
      `   <div>${message}</div>`,
      '   <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>',
      "</div>",
    ].join("");

    alertPlaceholder.append(wrapper);
  };
  alert(customMsg, type);

}