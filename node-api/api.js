const express = require("express");
const bodyParser = require("body-parser");
const { events, spots } = require("./data");

const app = express();

app.use(bodyParser.json());

app.get("/events", async (req, res) => {
  return res.json(events);
});

app.get("/events/:eventId", async (req, res) => {
  return res.json({
    event: events.find((event) => event.id === parseInt(req.params.eventId)),
    spots: spots.filter(
      (spot) => spot.event_id === parseInt(req.params.eventId)
    ),
  });
});

app.post("/events/:eventId/reserve", async (req, res) => {
  const { spots: spotsNameToReserve } = req.body;
  const eventId = parseInt(req.params.eventId);
  console.log(spotsNameToReserve, eventId);
  spotsNameToReserve.forEach((spotNameToReserve) => {
    const spot = spots.find(
      (spot) =>
        spot.event_id === eventId && spot.name === spotNameToReserve
    );
    console.log(spot);
    if (spot) {
      spot.status = "sold";
      const event = events.find((event) => event.id === eventId);
      event.available_spots = event.available_spots - 1;
    }
  });
  await fetch(`http://localhost:3000/api/events/${eventId}/revalidate`, {
    method: "POST",
  });
  return res.json({
    message: "Spots reserved successfully",
  });
});

const port = 8000;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
