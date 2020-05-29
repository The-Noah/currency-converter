const BASE_URL = "https://api.exchangeratesapi.io/latest";

const currencyInputs = document.querySelectorAll("input");
const currencySelects = document.querySelectorAll("select");

let currencyOptions = [];
let fromCurrency;
let toCurrency;
let amount = 1;
let exchangeRate = 0;

currencyInputs[0].value = amount;

fetch(BASE_URL).then(function(res){return res.json()}).then(function(data){
  currencyOptions = [data.base, ...Object.keys(data.rates)].sort();
  exchangeRate = data.rates[currencyOptions[1]];

  for(const select of currencySelects){
    select.innerHTML = "";

    for(const currency of currencyOptions){
      const option = document.createElement("option");
      option.value = currency;
      option.innerText = currency;

      select.appendChild(option);
    }
  }

  fromCurrency = currencyOptions[0];
  toCurrency = currencyOptions[1];

  currencySelects[0].value = fromCurrency;
  currencySelects[1].value = toCurrency;

  convert(currencyInputs[0]);
});

for(const select of currencySelects){
  select.addEventListener("input", function(e){
    if(e.target === currencySelects[0]){
      fromCurrency = e.target.value;
    }else{
      toCurrency = e.target.value;
    }

    fetch(`${BASE_URL}?base=${fromCurrency}&symbols=${toCurrency}`).then(function(res){return res.json()}).then(function(data){
      exchangeRate = data.rates[toCurrency];
      convert(currencyInputs[0]);
    });
  });
}

for(const input of currencyInputs){
  input.addEventListener("input", function(e){
    convert(e.target);
  });
}

function convert(element){
  amount = element.value;
  let toAmount, fromAmount;

  if(element === currencyInputs[0]){
    fromAmount = amount;
    toAmount = amount * exchangeRate;
  }else{
    toAmount = amount;
    fromAmount = amount / exchangeRate;
  }

  currencyInputs[0].value = fromAmount;
  currencyInputs[1].value = toAmount;
}
