/*==================================================
=            Picture to Ascii Converter            =
==================================================*/

var KR = KR || {};

(function ($) {
  var preview = document.getElementById("image-preview");
  var imgCanvas = document.getElementById("image-canvas");
  var asciiCanvas = document.getElementById("ascii-canvas");
  var imageData = null;

    /*----------  Render Image File  ----------*/
  $.imgLoad = function (event) {
    var img = new Image();
    var reader = new FileReader();
    
    
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

  /*----------  Create Color Node  ----------*/
  
  function createColorNode(rgbObject) {
    var colorNode = document.createElement("span");
    colorNode.textContent = "#";
    var colorText = "rgb(" + rgbObject.r + "," + rgbObject.g + "," + rgbObject.b + ")";
    colorNode.style.color =  colorText;

    return colorNode;
  }

  /*----------  Average Color  ----------*/
  
  function averageColor(array) {
    var totalR = null;
    var totalG = null;
    var totalB = null;
    var averagedPixel = {};

    //Calculate average color
    for(var i = 0; i < array.length; i++) {
      if(array[i] !== undefined) {
        totalR += array[i].r;
        totalG += array[i].g;
        totalB += array[i].b;
      }
    }

    averagedPixel = {
      r: Math.floor(totalR / 20 ),
      g: Math.floor(totalG / 20) ,
      b: Math.floor(totalB / 20)
    };

    return averagedPixel;
  }
  
  /*----------  Flatten Pixel Information  ----------*/

  function flattenPixels(startX, startY, pixelMap) {
    var pixelColorsArray = [];
    var endX = startX + 4;
    var endY = startY + 5;

    for(; startY < endY; startY++) {
      for(; startX < endX; startX++) {
        if(pixelMap[startY] !== undefined) {
         pixelColorsArray.push(pixelMap[startY][startX]);
        }
      }
      startX -= 4;
    }

    return pixelColorsArray;
  }

  converter = function() {
    /*----------  Variables  ----------*/
    
    var numPixels = (imageData.data.length / 4);
    var numRows = (numPixels / imgCanvas.width);
    var numColumns = (numPixels / imgCanvas.height);
    var pixelDataCount = 0;
    var imgPixelInformation = [];
    var startX = 0;
    var startY = 0;
    asciiCanvas.style.display = "none";

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

    /*----------  Flatten Pixel Information  ----------*/
    for(var y2 = 0; y2 <= imgCanvas.height; y2 += 5) {
      asciiCanvas.innerHTML += "<br>";
      for(var x2 = 0; x2 <= imgCanvas.width; x2 += 4) {
        var tempArray = flattenPixels(x2, y2, imgPixelInformation);
        var colorNode = createColorNode(averageColor(tempArray));

        //Output pixel information to screen
        asciiCanvas.appendChild(colorNode);
      }
    }

    /*----------  Convert To ASCII  ----------*/

    asciiCanvas.style.display = "block";
  };


})(KR);