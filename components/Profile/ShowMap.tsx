import React, { Dispatch, SetStateAction, useEffect, useState } from 'react'
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import {MapContainer,TileLayer,Marker,Popup, useMapEvents} from 'react-leaflet'
import Loader from '../Cart/Loader';
import { MapPin } from 'lucide-react';
import { AddressParams } from '@/lib/constants/types';

L.Icon.Default.mergeOptions({
    iconRetinaUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png',
    iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
    shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
});

interface ShowMapParams {
    setAddressInitVals:Dispatch<SetStateAction<AddressParams>>
}

const ShowMap = ({setAddressInitVals}:ShowMapParams) => {

    const [isLoading, setIsLoading] = useState(false);
    const [coOrds, setCoOrds] = useState<{lat:number,lng:number}>({lat:17.3850,lng:78.4867});
    const [address, setAddress] = useState<any>(null);

    // if(typeof window !==undefined) {
    //     console.log("window is not defined");
    // }

    if(typeof window !==undefined) {
        console.log("window is not defined");
    }

    useEffect(() => {
      
        try {
            setIsLoading(true);
            if(navigator.geolocation) {
                navigator.geolocation.getCurrentPosition(async(position)=> {
                    const {latitude,longitude}=position.coords;
                    setCoOrds({lat:latitude,lng:longitude});
                    
                    const response = await fetch(
                        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&addressdetails=1`
                    );
                    const data = await response.json();
                    setAddress(data);
                    console.log("data",data);
                    
                    setAddressInitVals((prev)=> ({...prev,
                        state:data?.address.state,
                        pincode:data.address.postcode,
                        town:data.address.county,
                        area:data.address.suburb+","+data.address.county+","+data.address.state_district
                    }))
                })
            }
        } catch (error) {
            console.log(error);
        }finally{
            setIsLoading(false);
        }
    }, []);

    const LocationMarker=()=>{
        const [position, setPosition] = useState<{lat:number,lng:number} | null>(null);

        const map=useMapEvents({
            locationfound(e) {
                setPosition(e.latlng);
                map.flyTo(e.latlng,map.getZoom());
            }
        })

        useEffect(()=> {
            map.locate();
        },[map]);

        return position===null ? null : (
            <Marker position={position}>
                <Popup>You are here <br/> {address && address?.display_name}</Popup>
            </Marker>
        )
    }
    
  return (
    <div className=' h-full w-full -mx-2'>
        {isLoading ? (
            <Loader />
        ):(
            <div className=' h-full w-full'>
                <MapContainer center={[coOrds?.lat,coOrds?.lng]}  zoom={13} scrollWheelZoom={true} className=' z-10 rounded-md' style={{ height: "60vh", width: "98%" }}>
                <TileLayer
                    attribution='&copy; OpenStreetMap contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                    <LocationMarker />
                </MapContainer>
            </div>
        )}
    </div>
  )
}

export default ShowMap

