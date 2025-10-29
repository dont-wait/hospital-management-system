import axios from "axios";

export class IpGeoService {
  static async getCountry(): Promise<string> {
    try {
      const response = await axios.get("https://ipwho.is");
      const { country } = response.data;
      return typeof country === "string" && country ? country : "Vietnam";
    } catch (error) {
      console.error("Failed to fetch country", error);
      return "Vietnam";
    }
  }
}
