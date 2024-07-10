// Algoritmo de Luhn para validar el número de tarjeta
function luhnCheck(cardNumber) {
  let sum = 0;
  let shouldDouble = false;
  for (let i = cardNumber.length - 1; i >= 0; i--) {
    let digit = parseInt(cardNumber.charAt(i));

    if (shouldDouble) {
      if ((digit *= 2) > 9) digit -= 9;
    }

    sum += digit;
    shouldDouble = !shouldDouble;
  }
  return sum % 10 === 0;
}

// Validar el formato del número de tarjeta según el tipo de tarjeta
function validateCardNumber(cardNumber, cardType) {
  const cardNumberRegexes = {
    visa: /^4[0-9]{12}(?:[0-9]{3})?$/,
    mastercard: /^5[1-5][0-9]{14}$/,
    amex: /^3[47][0-9]{13}$/,
  };

  const regex = cardNumberRegexes[cardType.toLowerCase()];
  return regex ? regex.test(cardNumber) && luhnCheck(cardNumber) : false;
}

// Validar el formato de la fecha de expiración (MM/YY)
function validateExpiryDate(expiryDate) {
  const regex = /^(0[1-9]|1[0-2])\/\d{2}$/;
  if (!regex.test(expiryDate)) {
    return false;
  }
  const [month, year] = expiryDate.split("/").map((num) => parseInt(num));
  const currentYear = new Date().getFullYear() % 100;
  const currentMonth = new Date().getMonth() + 1;

  if (year < currentYear || (year === currentYear && month < currentMonth)) {
    return false;
  }

  return true;
}

// Validar el formato del CVV (3-4 dígitos)
function validateCVV(cvv, cardType) {
  const cvvRegex = cardType.toLowerCase() === "amex" ? /^\d{4}$/ : /^\d{3}$/;
  return cvvRegex.test(cvv);
}

// Validar el saldo actual (número positivo)
function validateBalance(balance) {
  return balance > 0;
}

// Validar la tarjeta completa
function validateCard() {
  const cardType = document.getElementById("cardTypeValidator").value;
  const cardCategory = document.getElementById("cardCategoryValidator").value;
  const cardNumber = document.getElementById("cardNumberValidator").value;
  const expiryDate = document.getElementById("expiryDateValidator").value;
  const cvv = document.getElementById("cvvValidator").value;
  const balance = parseFloat(document.getElementById("balanceValidator").value);

  // Validar que todos los campos estén completos
  if (
    !cardType ||
    !cardCategory ||
    !cardNumber ||
    !expiryDate ||
    !cvv ||
    isNaN(balance)
  ) {
    document.getElementById("validationResult").innerHTML =
      "<p>Por favor completa todos los campos.</p>";
    return;
  }

  // Validar el número de tarjeta según el tipo de tarjeta
  const isValidCardNumber = validateCardNumber(cardNumber, cardType);
  if (!isValidCardNumber) {
    document.getElementById("validationResult").innerHTML =
      "<p>El número de tarjeta no es válido para el tipo de tarjeta seleccionado.</p>";
    return;
  }

  // Validar la fecha de expiración
  const isValidExpiryDate = validateExpiryDate(expiryDate);
  if (!isValidExpiryDate) {
    document.getElementById("validationResult").innerHTML =
      "<p>La fecha de expiración no es válida.</p>";
    return;
  }

  // Validar el CVV
  const isValidCVV = validateCVV(cvv, cardType);
  if (!isValidCVV) {
    document.getElementById("validationResult").innerHTML =
      "<p>El CVV no es válido.</p>";
    return;
  }

  // Validar el saldo actual
  const isValidBalance = validateBalance(balance);
  if (!isValidBalance) {
    document.getElementById("validationResult").innerHTML =
      "<p>El saldo actual no es válido.</p>";
    return;
  }

  // Si todas las validaciones son correctas
  document.getElementById("validationResult").innerHTML =
    "<p>La tarjeta es válida.</p>";
}

function generateCard() {
  const cardType = document.getElementById("cardType").value;
  const cardCategory = document.getElementById("cardCategory").value;
  const balance = document.getElementById("balance").value;

  // Validar que los campos estén completos
  if (!cardType || !balance) {
    alert("Por favor selecciona un tipo de tarjeta y proporciona un saldo.");
    return;
  }

  const cardNumber = generateCardNumber(cardType);
  const expDate = generateExpDate();
  const cvv = generateCVV(cardType);

  const cardInfo = `
            <p>Tipo de Tarjeta: ${cardType}</p>
            <p>Categoría de Tarjeta: ${cardCategory}</p>
            <p>Número de Tarjeta: ${cardNumber}</p>
            <p>Fecha de Expiración: ${expDate}</p>
            <p>CVV: ${cvv}</p>
            <p>Fondos: ${balance}</p>
        `;

  document.getElementById("generatedCardInfo").innerHTML = cardInfo;
}

function generateCardNumber(type) {
  let prefix;
  let length;
  switch (type) {
    case "visa":
      prefix = "4";
      length = 16;
      break;
    case "mastercard":
      prefix = "5";
      length = 16;
      break;
    case "amex":
      prefix = "34";
      length = 15;
      break;
    default:
      prefix = "4";
      length = 16;
  }

  let number = prefix;
  while (number.length < length - 1) {
    number += Math.floor(Math.random() * 10);
  }

  number += getLuhnCheckDigit(number);
  return number;
}

function generateExpDate() {
  const month = ("0" + (Math.floor(Math.random() * 12) + 1)).slice(-2);
  const year = ("0" + (Math.floor(Math.random() * 5) + 24)).slice(-2);
  return `${month}/${year}`;
}

function generateCVV(cardType) {
  const length = cardType.toLowerCase() === "amex" ? 4 : 3;
  return ("0000" + Math.floor(Math.random() * Math.pow(10, length))).slice(
    -length
  );
}

function getLuhnCheckDigit(number) {
  let sum = 0;
  let shouldDouble = true;
  for (let i = number.length - 1; i >= 0; i--) {
    let digit = parseInt(number.charAt(i));
    if (shouldDouble) {
      digit *= 2;
      if (digit > 9) {
        digit -= 9;
      }
    }
    sum += digit;
    shouldDouble = !shouldDouble;
  }
  return (sum * 9) % 10;
}

document
  .getElementById("validateButton")
  .addEventListener("click", validateCard);
