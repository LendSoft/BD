import { useEffect, useRef } from 'react';
import '../../../assets/styles/MapPage.css';
import VectorSource from 'ol/source/Vector';
import { OSM } from 'ol/source';
import VectorLayer from 'ol/layer/Vector';
import { Feature, Overlay, View } from 'ol';
import { fromLonLat, toLonLat } from 'ol/proj';
import TileLayer from 'ol/layer/Tile';
import Map from "ol/Map.js";
import { Point } from 'ol/geom';
import { Icon, Style } from 'ol/style';
import RequestsStore from '../../../modules/Requests/store/store';
import { unByKey } from 'ol/Observable';
import { getIconByPriority } from '../utils/getIconByPriority';
import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:3001/api',
});

const MapPage = () => {
  const mapRef = useRef();
  const vectorSource = useRef(new VectorSource());
  const popupRef = useRef();

  useEffect(() => {
    const fetchRequests = async () => {
      try {
        const response = await api.get('/requests');
        RequestsStore.setRequests(response.data);
      } catch (err) {
        console.error('Ошибка загрузки заявок:', err);
        alert('Ошибка при загрузке заявок');
      }
    };
    fetchRequests();
  }, []);

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
        center: fromLonLat([50.1002, 53.1959]), // Самара
        zoom: 12,
      }),
    });

    const popup = new Overlay({
      element: popupRef.current,
    });
    map.addOverlay(popup);

    const addMarkers = () => {
      vectorSource.current.clear();
      RequestsStore.requests.forEach(req => {
        const marker = new Feature({
          geometry: new Point(fromLonLat([req.coords[1], req.coords[0]])),
        });

        const markerIcon = getIconByPriority(req.prioritet);

        marker.setStyle(new Style({
          image: new Icon({
            src: markerIcon,
            scale: 0.7,
          }),
        }));
        
        vectorSource.current.addFeature(marker);
      });
    };

    addMarkers();

    const handlePointerMove = (event) => {
      const pixel = map.getEventPixel(event.originalEvent);
      const feature = map.forEachFeatureAtPixel(pixel, (feature) => feature);

      if (feature) {
        const coordinates = feature.getGeometry().getCoordinates();
        popup.setPosition(coordinates);
        const featureLonLat = toLonLat(coordinates);
        const req = RequestsStore.requests.find(req => {
          const reqLonLat = toLonLat([req.coords[1], req.coords[0]]);
          return reqLonLat[0] === featureLonLat[0] && reqLonLat[1] === featureLonLat[1];
        });

        if (req) {
          popupRef.current.innerHTML = `
            <h3>Адрес: ${req.addres}</h3>
            <h3>Приоритет: ${req.prioritet}</h3>
            <h3>Происшествие: ${req.incident}</h3>
            <h3>Заявитель: ${req.applicant}</h3>`;
          popupRef.current.style.display = 'block';
        }
      } else {
        popupRef.current.style.display = 'none';
      }
    };

    map.on('pointermove', handlePointerMove);

    return () => {
      unByKey(map);
      map.setTarget(undefined);
    };
  }, [RequestsStore.requests]);

  return (
    <div>
      <div ref={mapRef} style={{ width: '95%', height: '555px', margin: "15px auto" }} />
      <div ref={popupRef} style={{
        width: 300,
        position: 'absolute',
        background: 'white',
        padding: '5px',
        border: '3px solid blueviolet',
        borderRadius: '4px',
        display: 'none'
      }} />
    </div>
  );
};

export default MapPage;