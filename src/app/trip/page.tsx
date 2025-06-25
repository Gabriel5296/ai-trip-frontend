"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import axios from "axios";

export default function TripPlanner() {
  const [formData, setFormData] = useState({
    username: "",
    home_country: "",
    currency: "",
    trip_country: "",
    city: "",
    days: 1,
  });

  const [result, setResult] = useState("");
  const [photos, setPhotos] = useState<string[]>([]);
  const [weather, setWeather] = useState<any[]>([]);
  const [exchangeRate, setExchangeRate] = useState("");
  const [costs, setCosts] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const handleChange = (e: any) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const res = await axios.post("http://localhost:8000/trip-plan/", {
        ...formData,
        days: Number(formData.days),
      });

      setResult(res.data.summary);
      setPhotos(res.data.photos || []);
      setWeather(res.data.weather || []);
      setExchangeRate(res.data.exchange_rate || "");
      setCosts(res.data.estimated_costs || null);
    } catch (err) {
      setResult("❌ Failed to fetch trip plan. Check API or inputs.");
    }
    setLoading(false);
  };

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <h1 className="text-3xl font-bold">🌐 Smart Travel Designer</h1>

      {/* Form */}
      <div className="grid gap-4 grid-cols-1 md:grid-cols-2">
        <div className="space-y-2">
          <Label>Name</Label>
          <Input name="username" value={formData.username} onChange={handleChange} />
        </div>

        <div className="space-y-2">
          <Label>Home Country</Label>
          <Input name="home_country" value={formData.home_country} onChange={handleChange} />
        </div>

        <div className="space-y-2">
          <Label>Currency (e.g. USD, INR)</Label>
          <Input name="currency" value={formData.currency} onChange={handleChange} />
        </div>

        <div className="space-y-2">
          <Label>Trip Country</Label>
          <Input name="trip_country" value={formData.trip_country} onChange={handleChange} />
        </div>

        <div className="space-y-2">
          <Label>Trip City</Label>
          <Input name="city" value={formData.city} onChange={handleChange} />
        </div>

        <div className="space-y-2">
          <Label>Number of Days</Label>
          <Input
            type="number"
            name="days"
            value={formData.days}
            min="1"
            onChange={handleChange}
          />
        </div>
      </div>

      <Button onClick={handleSubmit} disabled={loading}>
        {loading ? "Generating..." : "Generate Trip Plan"}
      </Button>

      {/* Output */}
      {result && (
        <div className="space-y-4">
          <div>
            <Label className="text-lg">📋 Trip Plan</Label>
            <Textarea rows={10} value={result} readOnly />
          </div>

          {photos.length > 0 && (
            <div>
              <Label className="text-lg">📸 Highlights</Label>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mt-2">
                {photos.map((url, idx) => (
                  <img
                    key={idx}
                    src={url}
                    alt={`Trip Photo ${idx + 1}`}
                    className="rounded shadow-md"
                  />
                ))}
              </div>
            </div>
          )}

          {costs && (
            <div className="bg-gray-100 p-4 rounded">
              <h3 className="font-semibold mb-2">💰 Estimated Cost</h3>
              <p>
                Per Day: {costs.per_day} {costs.currency}
              </p>
              <p>
                Total for {formData.days} days: {costs.total} {costs.currency}
              </p>
            </div>
          )}

          {exchangeRate && (
            <div className="bg-gray-100 p-4 rounded">
              <h3 className="font-semibold mb-2">💱 Exchange Rate</h3>
              <p>{exchangeRate}</p>
            </div>
          )}

          {weather.length > 0 && (
            <div className="bg-gray-100 p-4 rounded">
              <h3 className="font-semibold mb-2">🌤️ Weather Forecast</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
                {weather.map((day, idx) => (
                  <div key={idx} className="p-2 bg-white rounded shadow">
                    <p className="font-semibold">{day.date}</p>
                    <p>Avg: {day.avg}°C</p>
                    <p>Min: {day.min}°C</p>
                    <p>Max: {day.max}°C</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
