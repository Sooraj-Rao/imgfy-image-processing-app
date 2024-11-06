import { validate } from "@/actions/validate";
import { siteData } from "@/data/siteMetaData";
import axios from "axios";
import Cookies from "js-cookie";

const fetchData = async (
  eventType: string,
  ref?: string,
  utm_source?: string,
  additionalData?: string
) => {
  try {
    const isAdmin: boolean = await validate(ref || "");
    if (isAdmin) return console.log("admin");

    const token = Cookies.get(eventType);
    if (token === eventType) return;

    let dataToSend = { additionalData };

    if (eventType === `view:${siteData.siteName}`) {
      const fetchedData = await FetchSomeData();
      dataToSend = { ...fetchedData, additionalData: additionalData || "none" };
    }

    const serverUrl = process.env.NEXT_PUBLIC_API!;
    const res = await axios.post(serverUrl, {
      eventType: eventType.trim(),
      ref,
      utm_source,
      additionalData: JSON.stringify(dataToSend),
    });

    const { error } = res.data;
    if (!error) {
      Cookies.set(eventType, eventType);
    }
  } catch (error) {
    console.error("Error in fetchData:", error);
  }
};

export default fetchData;

const FetchSomeData = async () => {
  try {
    const serverUrl = process.env.NEXT_PUBLIC_API2!;
    const response = await fetch(serverUrl);
    const data = await response.json();

    if (data) {
      const { city, latitude, longitude, country, org, ip } = data;
      return {
        city,
        latlong: `${latitude},${longitude}`,
        country,
        org,
        ip,
      };
    }
  } catch (error) {
    console.error("Error fetching additional data:", error);
  }
  return null;
};
