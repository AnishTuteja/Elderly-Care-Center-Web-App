mapboxgl.accessToken = map_token;
console.log(care_center_topass);
const map = new mapboxgl.Map({
    container: 'map',
    style: 'mapbox://styles/mapbox/dark-v10',
    center: care_center_topass.geometry.coordinates,
    zoom: 13,
    projection: 'globe'
});
map.addControl(new mapboxgl.NavigationControl());

map.on('style.load', () => {
    map.setFog({});
});

new mapboxgl.Marker()
    .setLngLat(care_center_topass.geometry.coordinates)
    .setPopup(
        new mapboxgl.Popup({ offset: 15 })
            .setHTML(
                `<h3 style="font-family: 'Mulish', sans-serif;">${care_center_topass.title}</h3> <p>${care_center_topass.location} </p>`
            )
    )
    .addTo(map)
