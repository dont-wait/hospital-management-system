import axios from "axios";

class IpGeoService {
  // Get country service
  static async getCountry(): Promise<string> {
    try {
      const response = await axios.get("https://ipwho.is");
      if (
        response &&
        response.data &&
        typeof response.data.country === "string" &&
        response.data.country.length > 0
      ) {
        return response.data.country;
      } else {
        return "Vietnam";
      }
    } catch (error) {
      console.error("Failed to fetch country", error);
      return "Vietnam";
    }
  }
}

export default IpGeoService;
