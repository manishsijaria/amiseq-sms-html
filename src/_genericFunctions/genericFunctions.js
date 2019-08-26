

/*
123 4567890
(123) 456-7890
(123)456-7890
123 456 7890
123.456.7890
(blank/null)
1234567890
*/
export const genericFunctions = {
  isANumber,
  formatPhoneNumber,
  isPhoneNumber,
  replaceSpecialCharsInPhoneNo,
}

function formatPhoneNumber(phoneNumberString) {
    var cleaned = ('' + phoneNumberString).replace(/\D/g, '')
    var match = cleaned.match(/^(1|)?(\d{3})(\d{3})(\d{4})$/)
    if (match) {
      var intlCode = '+1' //(match[1] ? '+1 ' : '')
      return [intlCode,  match[2],  match[3],  match[4]].join('')
    }
    return phoneNumberString
}

function isANumber(phoneNumberString) {
  //true if any character is a digit.
  return /\d/.test(phoneNumberString);
}

function isPhoneNumber(phoneNumberString) {
  let mob_no = formatPhoneNumber(phoneNumberString)
  if(mob_no.length === 12) {
    return true
  }
  return false
}

function replaceSpecialCharsInPhoneNo(phoneNumberString) {
  //replace "brackets, . , - , space" characters with ''
  var pattern = /[().-\s]/g;
  return phoneNumberString.replace(pattern,'')
}