import axios from "axios";

class IpGeoService {
  // Get country service
  async getCountry(): Promise<string> {
    return await axios
      .get("https://ipwho.is")
      .then((response) => response.data.country);
  }
}

export const ipGeoService = new IpGeoService();
