function hsl2rbg(h, s, l) {
  //hsl param as %
  var r = 0,
    g = 0,
    b = 0,
    t1 = 0,
    t2 = 0,
    tR = 0,
    tG = 0,
    tB = 0;
  //convert to floating point between 0-1
  s = s / 100;
  l = l / 100;
  //no saturation
  if (s === 0) {
    return [Math.round(l * 255), Math.round(l * 255), Math.round(l * 255), Math.round(l * 255)];
  }
  //there is saturation
  t1 = (l < .5 ? t1 = l * (1.0 + s) : t1 = l + s - l * s);
  t2 = 2 * l - t1;
  //hue
  h = h / 360;
  tR = h + 1 / 3;
  tB = h;
  tG = h - 1 / 3;

  function convertColor(color) {
    var result;
    if (color < 0) {
      color = color + 1;
    } else if (color > 1) {
      color = color - 1;
    }
    if (6 * color < 1) {
      result = t2 + (t1 - t2) * 6 * color;
    } else if (2 * color < 1) {
      result = t1;
    } else if (3 * color < 2) {
      result = t2 + (t1 - t2) * (0.666 - color) * 6;
    } else {
      result = t2;
    }
    return Math.round(result * 255);
  }
  r = convertColor(tR);
  g = convertColor(tB);
  b = convertColor(tG);
  return [r, g, b, 255];
}

function rgba2hslString(rgba) {
  return rgba2hsl(rgba).toString();
}

function rgba2hsl(rbg) {
  var r = rbg[0] / 255,
    g = rbg[1] / 255,
    b = rbg[2] / 255,
    max,
    min,
    h,
    s,
    l;
  max = Math.max(r, g, b);
  min = Math.min(r, g, b);
  l = (max + min) / 2;
  if (min == max) {
    s = 0;
  } else {
    s = (l < .5 ? s = (max - min) / (max + min) : (max - min) / (2.0 - max - min));
  }
  if (r == max) {
    h = (g - b) / (max - min);
  } else if (g == max) {
    h = 2.0 + (b - r) / (max - min);
  } else if (b == max) {
    h = 4.0 + (r - g) / (max - min);
  }
  h = h * 60;
  if (h < 0) {
    h = 0;
  } else if (h > 360) {
    h = 360;
  }
  h = Math.round(h);
  s = Math.round(s * 100);
  l = Math.round(l * 100);
  if (isNaN(h)) h = 0;
  if (isNaN(s)) s = 0;
  if (isNaN(l)) l = 0;
  return [h, s, l];
}

function rgbToHex(rgb) {
  function c(v) {
    var hex = v.toString(16);
    return hex.length === 1 ? "0" + hex : hex;
  }
  return "#" + c(rgb[0]) + c(rgb[1]) + c(rgb[2]);
}