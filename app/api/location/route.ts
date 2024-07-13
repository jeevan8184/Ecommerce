"use server";
import axios from 'axios';
import { NextResponse } from 'next/server';

export const POST = async (req:Request) => {
  try {
    const body = await req.json(); // Parse the request body
    const { lat, lng } = body;

    const response = await axios.get(`https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=${process.env.GOOGLE_API}`);
    
    console.log('response',response?.data,response?.status);
    if (response.data.results.length === 0) {
      return NextResponse.json({ error: 'No results found' }, { status: 404 });
    }

    console.log('response',response);
    const address = response.data.results[0].formatted_address;

    return NextResponse.json({ address });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Failed to fetch location data' }, { status: 500 });
  }
};
