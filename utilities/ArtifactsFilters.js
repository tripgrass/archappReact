const haversine = require('haversine')

export function containedWithin( point, center, distance ){
  const start = {
  latitude: 30.849635,
  longitude: -83.24559
}

const end = {
  latitude: 27.950575,
  longitude: -82.457178
}

//console.log(haversine(start, end))
//console.log(haversine(start, end, {unit: 'mile'}))
console.log(haversine(start, end, {threshold: 206, unit: 'mile'}))
} 