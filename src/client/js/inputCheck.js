function checkInput(sourceText, destinationText) {
    let urlRGEX = /^[a-zA-Z\s]{0,255}$/;
    if (urlRGEX.test(sourceText) && urlRGEX.test(destinationText)) {
      return
    } else {
      alert("kindly enter a valid name");
    }
  }
  
  export { checkInput }