console.log("javascript loaded");

// // Age Modal
const ageForm = document.getElementById("age-form");
const errorMessage = document.querySelector("#error-message");
// Age calulation
ageForm.addEventListener("submit", function(event) {
  event.preventDefault();
  console.log("submitted");
  const month = document.querySelector("#month").value;
  const day = document.querySelector("#day").value;
  const year = document.querySelector("#year").value;
  const dob = month + " " + day + " , " + year;
  console.log(dob);

  let millisecondsBetweenDOBAnd1970 = Date.parse(dob);
  let millisecondsBetweenNowAnd1970 = Date.now();
  let ageInMilliseconds =
    millisecondsBetweenNowAnd1970 - millisecondsBetweenDOBAnd1970;
  //--We will leverage Date.parse and now method to calculate age in milliseconds refer here https://www.w3schools.com/jsref/jsref_parse.asp
  let milliseconds = ageInMilliseconds;
  let second = 1000;
  let minute = second * 60;
  let hour = minute * 60;
  let dayC = hour * 24;
  let monthC = day * 30;
  /*using 30 as base as months can have 28, 29, 30 or 31 days depending a month in a year it itself is a different piece of comuptation*/
  let yearC = dayC * 365;

  let ageValue = Math.round(milliseconds / yearC);

  console.log(ageValue);


  if (ageValue >= 100) {
    errorMessage.innerText = "Please enter a valid birth date";
  } else if (ageValue <= 17) {
    errorMessage.innerText = "*Sorry, You must be 18 or older to enter site";
  } else if (ageValue >= 18) {
    console.log("Old enough to enter site");
    document.querySelector(".modal-open").setAttribute("class", "keep-scroll");
    let modal = document.querySelector("#modal-container");
    modal.remove();
    let modalBg = document.querySelector(".modal-backdrop");
    modalBg.remove();
  } 
});
// End Age Modal

// Contact Form

(function() {
  // get all data in form and return object
  let gForm = document.querySelector("#gform");
  function getFormData(gForm) {
    var elements = gForm.elements;
    var honeypot;

    var fields = Object.keys(elements)
      .filter(function(k) {
        if (elements[k].name === "honeypot") {
          honeypot = elements[k].value;
          return false;
        }
        return true;
      })
      .map(function(k) {
        if (elements[k].name !== undefined) {
          return elements[k].name;
          // special case for Edge's html collection
        } else if (elements[k].length > 0) {
          return elements[k].item(0).name;
        }
      })
      .filter(function(item, pos, self) {
        return self.indexOf(item) === pos && item;
      });

    var formData = {};
    fields.forEach(function(name) {
      var element = elements[name];

      // singular form elements just have one value
      formData[name] = element.value;

      // when our element has multiple items, get their values
      if (element.length) {
        var data = [];
        for (var i = 0; i < element.length; i++) {
          var item = element.item(i);
          if (item.checked || item.selected) {
            data.push(item.value);
          }
        }
        formData[name] = data.join(", ");
      }
    });

    // add form-specific values into the data
    formData.formDataNameOrder = JSON.stringify(fields);
    formData.formGoogleSheetName = gForm.dataset.sheet || "responses"; // default sheet name
    formData.formGoogleSendEmail = gForm.dataset.email || ""; // no email by default

    return { data: formData, honeypot: honeypot };
  }

  function handleFormSubmit(event) {
    // handles form submit without any jquery
    event.preventDefault(); // we are submitting via xhr below
    var gForm = event.target;
    var formData = getFormData(gForm);
    var data = formData.data;

    // If a honeypot field is filled, assume it was done so by a spam bot.
    if (formData.honeypot) {
      return false;
    }

    disableAllButtons(gForm);
    var url = gForm.action;
    var xhr = new XMLHttpRequest();
    xhr.open("POST", url);
    // xhr.withCredentials = true;
    xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
    xhr.onreadystatechange = function() {
      if (xhr.readyState === 4 && xhr.status === 200) {
        gForm.reset();
        var formElements = gForm.querySelector(".form-elements");
        if (formElements) {
          formElements.style.display = "none"; // hide form
        }
        var thankYouMessage = gForm.querySelector(".thankyou_message");
        if (thankYouMessage) {
          thankYouMessage.style.display = "block";
        }
      }
    };
    // url encode form data for sending as post data
    var encoded = Object.keys(data)
      .map(function(k) {
        return encodeURIComponent(k) + "=" + encodeURIComponent(data[k]);
      })
      .join("&");
    xhr.send(encoded);
  }

  function loaded() {
    // bind to the submit event of our form
    var forms = document.querySelectorAll("form.gform");
    for (var i = 0; i < forms.length; i++) {
      forms[i].addEventListener("submit", handleFormSubmit, false);
    }
  }
  document.addEventListener("DOMContentLoaded", loaded, false);

  function disableAllButtons(gForm) {
    var buttons = gForm.querySelectorAll("button");
    for (var i = 0; i < buttons.length; i++) {
      buttons[i].disabled = true;
    }
  }
})();
