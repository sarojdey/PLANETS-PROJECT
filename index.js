const { parse } = require("csv-parse"); // using object destructuring to import only parse() from csv-parse
const fs = require("fs");

const habitablePlanets = [];

function isHabitablePlanet(planet) {
  return (
    planet["koi_disposition"] === "CONFIRMED" &&
    planet["koi_insol"] > 0.36 &&  // returns boolean if a planet is habitable or not
    planet["koi_insol"] < 1.11 &&
    planet["koi_prad"] < 1.6
  );
}

fs.createReadStream("kepler_data.csv")  // fs.createReadStream to create a readable stream
  .pipe( // we directly pipe it into parse() because createReadStream() creates a buffer data for each line of csv file on by one
    parse({
      comment: "#",  // parsing the readable stream 
      columns: true,
    })
  )
  .on("data", (data) => {
    if (isHabitablePlanet(data)) {
      habitablePlanets.push(data);
    }
  })
  .on("end", () => {
    console.log(`no. of habitable planet is ${habitablePlanets.length}`);
    console.log(
      habitablePlanets.map((planet) => {
        return planet["kepler_name"]; // maping the result objects based only on their name
      })
    );
  })
  .on("error", (err) => {
    console.log(err);
  });
