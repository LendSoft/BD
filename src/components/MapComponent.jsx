import React, { useEffect, useRef } from "react";
import Map from "ol/Map.js";
import OSM from "ol/source/OSM.js";
import TileLayer from "ol/layer/Tile.js";
import View from "ol/View.js";
import { fromLonLat } from "ol/proj";
import RequestFormStore from "../modules/RequestForm/store/store";
import { Feature } from "ol";
import { Point } from "ol/geom";
import { Style, Icon } from "ol/style";
import VectorSource from "ol/source/Vector";
import VectorLayer from "ol/layer/Vector";
import markerIcon from "../assets/marker.png"

const MapComponent = () => {
  const mapRef = useRef();
  const vectorSource = useRef(new VectorSource());

  useEffect(() => {
    const map = new Map({
      layers: [
        new TileLayer({
          source: new OSM({
            attributions: [],
          }),
        }),
        new VectorLayer({
          source: vectorSource.current,
        }),
      ],
      target: mapRef.current,
      view: new View({
        center: fromLonLat([39.70732721786235, 47.23260132167479]),
        zoom: 12,
      }),
    });

    map.on("click", (event) => {
      const coordinates = event.coordinate;

      RequestFormStore.setCoords(coordinates)

      const marker = new Feature({
        geometry: new Point(coordinates),
      });

      marker.setStyle(
        new Style({
          image: new Icon({
            src: markerIcon,
            scale: 0.7
          }),
        })
      );

      vectorSource.current.clear();
      vectorSource.current.addFeature(marker);
    });

    return () => map.setTarget(undefined);
  }, []);

  return (
    <div ref={mapRef} style={{ width: 400, height: 250 }}>

    </div>
  )
};

export default MapComponent;
