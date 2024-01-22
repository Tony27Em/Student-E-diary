"use client"
import DG from '2gis-maps';
import { useEffect, FC } from 'react';
import mapIcon from '../../../public/map-logo.png';
import styles from '../../styles/contacts.module.scss';

const MyMap: FC = () => {
  const coords: number[] = [49.797957538683, 73.09045734480274];

  useEffect(() => {
    if (typeof window != 'undefined') {
      const map = DG.map('map-container', {
        center: coords,
        minZoom: 15,
        zoom: 20,
        fullscreenControl: false,
        inertia: true,
      });

      const icon = DG.icon({
        iconUrl: mapIcon.src,
        iconSize: [40, 40],
        popupAnchor: 100
      })

      const marker = DG.marker(coords, {
        icon,
        label: 'Академия ШАГ',
        anchorLabel: true,
      }).addTo(map);

      return () => map && map.remove();
    }
  }, []);

  return (
    <div id="map-container" className={styles.map_container}></div>
  )
}

export default MyMap;