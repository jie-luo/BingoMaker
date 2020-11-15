var BOARD_SIZE = 5

function getOptions() {
  return {
    width: 800,
    freeSpace: document.getElementById("freeSpaceForce").checked,
    randomize: document.getElementById("randomSelection").checked
  }
}

function generateBingoCard() {
  var options = getOptions()
  var items = document.getElementById("bingoItems").value.split("\n")
  items = items.filter(function (item) {
    return item != ""
  })
  if (options.randomize) {
    items = randomPick(items, BOARD_SIZE * BOARD_SIZE)
  }
  var WIDTH = options.width
  var HEIGHT = WIDTH * 1.25
  var X_MARGIN = 50
  var Y_MARGIN = (WIDTH * 0.25) + X_MARGIN / 2
  var BOX_SIZE = (WIDTH - X_MARGIN) / BOARD_SIZE
  var PADDING = 20
  var coords = []
  for (var j = 0; j < BOARD_SIZE; j += 1) {
    for (var i = 0; i < BOARD_SIZE; i += 1) {
      var x = X_MARGIN / 2 + i * BOX_SIZE
      var y = Y_MARGIN + j * BOX_SIZE
      coords.push([x, y])
    }
  }
  var canvas = document.getElementById("canvas")
  canvas.width = WIDTH
  canvas.height = HEIGHT
  var context = canvas.getContext("2d")
  context.clearRect(0, 0, canvas.width, canvas.height)
  drawBingoCardTemplate(context, coords, BOX_SIZE)
  var j = 0
  for (var i = 0; i < coords.length; i += 1) {
    if (i == Math.floor(BOARD_SIZE * BOARD_SIZE / 2) && options.freeSpace) {
      drawText(context, "Free Space", coords[i], BOX_SIZE - PADDING, BOX_SIZE - PADDING)
      continue
    }
    if (j >= items.length) {
      break
    }
    drawText(context, items[j].trim(), coords[i], BOX_SIZE - PADDING, BOX_SIZE - PADDING)
    j += 1
  }
  var title = document.getElementById("bingoTitle").value
  drawText(context, title, [0, 0], WIDTH, WIDTH * 0.25)
}

function download() {
  var link = document.createElement('a');
  link.download = 'bingo.png';
  link.href = document.getElementById("canvas").toDataURL()
  link.click();
}

function drawBingoCardTemplate(context, coords, size) {
  context.lineWidth = "5"
  context.strokeStyle = "black"
  context.fillStyle = "white"
  for (var i = 0; i < coords.length; i += 1) {
    context.beginPath()
    context.rect(coords[i][0], coords[i][1], size, size)
    context.stroke()
    context.fill()
  }
}

function drawText(context, corpus, coord, boxWidth, boxHeight) {
  var settings = fitToWidth(corpus, boxWidth, boxHeight)
  context.font = settings.fontSize + "px Arial"
  context.textAlign = "center"
  context.fillStyle = "#000000"
  var centerIndex = settings.text.length / 2
  for (var i = 0; i < settings.text.length; i += 1) {
    context.fillText(settings.text[i], coord[0] + (boxWidth)/2, coord[1] + (boxHeight)/2 + (i - centerIndex + 1) * settings.fontSize)
  }
}

function fitToWidth(corpus, boxWidth, boxHeight) {
  // i hate this
  var fontSizes = [0, 12, 14, 16, 18, 20, 24, 28, 36, 48, 56, 72]
  var test = document.getElementById("testWidth")
  var bestWidth = -1
  var bestHeight = -1
  var bestSettings = {}
  for (var i = 0; i < fontSizes.length; i += 1) {
    for (var j = 1; j <= Math.min(corpus.split(" ").length + 1, 4); j += 1) {
      test.style.fontSize = fontSizes[i] + "px"
      var txt = splitText(corpus, j)
      test.innerHTML = txt.join("<br />")
      var height = (test.clientHeight + 1)
      var width = (test.clientWidth + 1)
      if (height > boxHeight || width > boxWidth) {
        continue
      }
      if (height * width > bestWidth * bestHeight) {
        bestWidth = width
        bestHeight = height
        bestSettings = {
          "fontSize": fontSizes[i],
          "lines": j,
          "text": txt,
          "textWidth": width,
          "textHeight": height
        }
      }
    }
  }
  return bestSettings
}

function splitText(corpus, lines) {
  if (lines === 1) {
    return [corpus.trim()]
  }
  var length = corpus.length
  var t = corpus.split(" ")
  output = [""]
  for (var i = 0; i < t.length; i += 1) {
    output[output.length - 1] += t[i] + " "
    if (output[output.length - 1].length >= length / lines) {
      output[output.length - 1].trim()
      output.push("")
    }
  }
  if (output[output.length - 1] == "") {
    output.pop()
  }
  for (var i = 0; i < output.length; i += 1) {
    output[i].trim()
  }
  return output
}

function randomPick(list, amount) {
  var result = []
  while (result.length < amount && list.length > 0) {
    var index = Math.floor(Math.random() * list.length)
    result.push(list[index])
    list[index] = list[list.length - 1]
    list.pop()
  }
  return result
}
