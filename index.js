/*==================================================
=            Picture to Ascii Converter            =
==================================================*/

var KR = KR || {};

(function ($) {
  var preview = document.getElementById("image-preview");
  var imgCanvas = document.getElementById("image-canvas");
  var asciiCanvas = document.getElementById("ascii-canvas");
  var imageData = null;
  converter = function() {
    /*----------  Variables  ----------*/
    
    var numPixels = (imageData.data.length / 4);
    var numRows = (numPixels / imgCanvas.width);
    var numColumns = (numPixels / imgCanvas.height);
    var pixelDataCount = 0;
    var imgPixelInformation = [];

    /*----------  Create Pixel 2D Array  ----------*/
    for(var y = 0; y < numRows; y++ ) {
      imgPixelInformation.push([]);

      for(var x = 0; x < numColumns; x++) {
        pixelData = {
          r: imageData.data[0 + pixelDataCount],
          g: imageData.data[1 + pixelDataCount],
          b: imageData.data[2 + pixelDataCount],
          a: imageData.data[3 + pixelDataCount]
        };
        imgPixelInformation[y].push(pixelData);
        pixelDataCount += 4;
      }  
    }

    $.imgPixelInformation = imgPixelInformation;
    /*----------  Convert To ASCII  ----------*/
    for(var y = 0; y < numRows; y++ ) {
      asciiCanvas.innerHTML += "<br>";
      for(var x = 0; x < numColumns; x++) {
        var charColorSpan = document.createElement("span");
        var colorText = "rgba(" + imgPixelInformation[y][x].r + "," + imgPixelInformation[y][x].g + 
          "," + imgPixelInformation[y][x].b + "," + imgPixelInformation[y][x].a + ")";    
        charColorSpan.style.color =  colorText;
        var textNode = document.createTextNode("#");
        charColorSpan.appendChild(textNode);
        asciiCanvas.appendChild(charColorSpan);
      }  
    }
    console.log("Done");
  };
  $.imgLoad = function (event) {
    /*----------  Variables  ----------*/

    var img = new Image();
    var reader = new FileReader();
    /*----------  Render Image File  ----------*/
    
    reader.addEventListener('load', function() {
      preview.src = reader.result;
      img.src = preview.src;
      asciiCanvas.innerHTML = "";
      
      var context = imgCanvas.getContext("2d");
      context.clearRect(0,0, imgCanvas.width, imgCanvas.height);
      imgCanvas.width = img.width;
      imgCanvas.height = img.height;
      
      context.drawImage(img, 0, 0);
      //In order of RGBA [0, 1 , 2 , 3] <-- 1 pixel
      $.imageData = imageData = context.getImageData(0, 0, img.width, img.height);
      converter();
    });

    reader.readAsDataURL(event.target.files[0]);
  };
})(KR);