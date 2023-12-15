const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const cors = require('cors');
const { parseString } = require('xml2js');

const app = express();
const port = 3000;

app.use(cors());
app.use(bodyParser.json());

app.post('/getOutlet', (req, res) => {
  const { location } = req.body;
  const kmlData = fs.readFileSync('C:/Users/ASUS/Desktop/Geekstar/api/asset.kml', 'utf-8');

  parseString(kmlData, (err, result) => {
    if (err) {
      console.error('Error parsing KML file:', err);
      return res.status(500).json({ error: 'Internal Server Error' });
    }

    const kmlObject = result;
    const outletIdentifier = getOutletIdentifier(kmlObject, location);
    res.json({ outletIdentifier });
  });
});

function getCustLoc(placemarks, customerLocation) {
  for (const placemark of placemarks) {
   
    if (placemark.name[0] === customerLocation) {
      console.log(placemark.name, customerLocation);
      const point = placemark.Point && placemark.Point[0];
      const coordinates = point && point.coordinates && point.coordinates[0];
      console.log(coordinates);
      return coordinates;
    }
  }
}

function getOutletIdentifier(kmlObject, customerLocation) {
  const documents = kmlObject.kml.Document;

  if (!documents || documents.length === 0 || !documents[0].Placemark) {
    console.error('Invalid KML structure');
    return 'Unknown Outlet';
  }

  for (let i = 0; i < documents.length; i++) {
    const placemarks = documents[i].Placemark;

    let minDistance = Infinity;
    let nearestOutlet = null;

    for (const placemark of placemarks) {
      const name = placemark.name && placemark.name[0];
      const point = placemark.Point && placemark.Point[0];
      const coordinates = point && point.coordinates && point.coordinates[0];

      if (name && coordinates) {
        if (coordinates.includes(',')) {
          const [longitude, latitude, altitude] = coordinates.split(',');
          const custCord = getCustLoc(placemarks, customerLocation);

          if (custCord && custCord.includes(',')) {
            const [custLong, custLat, custAlt] = custCord.split(',');
            const long = Number(longitude);
            const lat = Number(latitude);
            const distance = Math.abs(long - custLong) + Math.abs(lat - custLat);

            if (distance < minDistance) {
              minDistance = distance;
              nearestOutlet = name;
            }
            console.log(distance);
          }
        }
        
      }
    }
   

    return nearestOutlet || 'Unknown Outlet';
  }
}

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
