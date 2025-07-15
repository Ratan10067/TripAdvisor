import React, { useState, useRef } from "react";
import {
  Send,
  Download,
  Loader2,
  MapPin,
  Train,
  Plane,
  Bus,
  Car,
  Hotel,
  Utensils,
  Calendar,
  DollarSign,
  Star,
  Clock,
  Globe,
  Camera,
  Navigation,
  Heart,
  Sparkles,
  Sun,
  Moon,
  Coffee,
  ChevronRight,
  Users,
  TrendingUp,
} from "lucide-react";
import { GoogleGenAI } from "@google/genai";

const TravelAssistant = () => {
  const [prompt, setPrompt] = useState("");
  const [response, setResponse] = useState(null);
  const [loading, setLoading] = useState(false);
  const [history, setHistory] = useState([]);
  const [activeTab, setActiveTab] = useState("overview");
  const responseRef = useRef(null);
  const ai = new GoogleGenAI({
    apiKey: import.meta.env.VITE_GEMINI_API_KEY,
  });

  const examplePrompts = [
    "Plan a 3-day budget trip to Goa from Delhi",
    "Best way to travel from Mumbai to Bangalore with fare estimates",
    "5-day luxury Paris itinerary with cost breakdown",
    "Weekend getaway to Manali from Delhi",
    "Cultural tour of Rajasthan for 7 days",
    "Beach vacation in Thailand for couples",
  ];

  const getActivityIcon = (activity) => {
    const lowerAct = activity.toLowerCase();
    if (lowerAct.includes("airport") || lowerAct.includes("flight"))
      return <Plane size={16} className="text-blue-500" />;
    if (lowerAct.includes("hotel") || lowerAct.includes("check-in"))
      return <Hotel size={16} className="text-purple-500" />;
    if (
      lowerAct.includes("eat") ||
      lowerAct.includes("dinner") ||
      lowerAct.includes("lunch") ||
      lowerAct.includes("restaurant")
    )
      return <Utensils size={16} className="text-orange-500" />;
    if (lowerAct.includes("car") || lowerAct.includes("drive"))
      return <Car size={16} className="text-green-500" />;
    if (lowerAct.includes("train") || lowerAct.includes("rail"))
      return <Train size={16} className="text-indigo-500" />;
    if (lowerAct.includes("bus"))
      return <Bus size={16} className="text-yellow-500" />;
    if (lowerAct.includes("beach") || lowerAct.includes("swim"))
      return <Sun size={16} className="text-yellow-500" />;
    if (lowerAct.includes("museum") || lowerAct.includes("gallery"))
      return <Camera size={16} className="text-red-500" />;
    if (lowerAct.includes("coffee") || lowerAct.includes("cafe"))
      return <Coffee size={16} className="text-amber-500" />;
    if (lowerAct.includes("evening") || lowerAct.includes("night"))
      return <Moon size={16} className="text-slate-500" />;
    return <Navigation size={16} className="text-emerald-500" />;
  };

  const getTimeIcon = (time) => {
    const lowerTime = time.toLowerCase();
    if (lowerTime.includes("morning"))
      return <Sun size={16} className="text-yellow-500" />;
    if (lowerTime.includes("afternoon"))
      return <Clock size={16} className="text-orange-500" />;
    if (lowerTime.includes("evening") || lowerTime.includes("night"))
      return <Moon size={16} className="text-purple-500" />;
    return <Clock size={16} className="text-blue-500" />;
  };

  // Fixed API call function
  const callGeminiAPI = async (userPrompt) => {
    try {
      const prompt = `You are TravelMate AI, an expert travel assistant. Provide detailed travel plans including:
        - Multiple transportation options with fare estimates
        - Daily itinerary with time-based activities
        - Accommodation options at different price points
        - Estimated total costs (budget/mid-range/luxury)
        - Practical travel tips
        
        IMPORTANT: Return response as valid JSON with these exact keys:
        {
          "destination": "string",
          "summary": "string",
          "itinerary": [
            {
              "day": number,
              "location": "string",
              "activities": [
                {
                  "time": "string",
                  "description": "string"
                }
              ]
            }
          ],
          "transportation": [
            {
              "mode": "string",
              "route": "string",
              "cost": "string",
              "duration": "string",
              "notes": "string"
            }
          ],
          "accommodation": [
            {
              "city": "string",
              "options": [
                {
                  "type": "string",
                  "price": "string",
                  "rating": number,
                  "example": "string"
                }
              ]
            }
          ],
          "estimatedTotal": {
            "budget": "string",
            "midRange": "string",
            "luxury": "string"
          },
          "tips": ["string"]
        }
        
        Current request: ${userPrompt}`;

      const result = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: prompt,
      });
      const text = result.text;

      console.log("Raw API Response:", text);

      // Try to extract JSON from the response
      let jsonMatch = text.match(/```json\n([\s\S]*?)\n```/);
      if (!jsonMatch) {
        // If no code block, try to find JSON in the text
        jsonMatch = text.match(/\{[\s\S]*\}/);
      }

      if (jsonMatch) {
        const jsonText = jsonMatch[1] || jsonMatch[0];
        return JSON.parse(jsonText);
      } else {
        // If no JSON found, create a structured response from the text
        return {
          destination: "Travel Plan",
          summary: text.substring(0, 200) + "...",
          itinerary: [],
          transportation: [],
          accommodation: [],
          estimatedTotal: {
            budget: "Contact for pricing",
            midRange: "Contact for pricing",
            luxury: "Contact for pricing",
          },
          tips: [text.substring(0, 100) + "..."],
        };
      }
    } catch (error) {
      console.error("Error parsing response:", error);
      throw error;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!prompt.trim()) return;

    setLoading(true);
    setResponse(null);

    try {
      const travelData = await callGeminiAPI(prompt);
      console.log("Parsed response:", travelData);
      setResponse(travelData);
      setHistory((prev) => [
        { prompt, response: travelData },
        ...prev.slice(0, 4),
      ]);
      setActiveTab("overview"); // Reset to overview tab
    } catch (error) {
      console.error("Error calling AI API:", error);
      setResponse({
        error: true,
        message: "Failed to get response. Please try again later.",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = () => {
    if (!response) return;

    const content = formatResponseForDownload(response);
    const blob = new Blob([content], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `TravelPlan_${
      response.destination?.replace(/[^a-zA-Z0-9]/g, "_") || "MyTrip"
    }.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const formatResponseForDownload = (data) => {
    let content = `=== TRAVEL PLAN FOR ${data.destination?.toUpperCase()} ===\n\n`;
    content += `${data.summary}\n\n`;

    if (data.itinerary && data.itinerary.length > 0) {
      content += "--- DETAILED ITINERARY ---\n";
      data.itinerary.forEach((day) => {
        content += `\nDAY ${day.day}: ${day.location}\n`;
        content += "=" + "=".repeat(day.location.length + 10) + "\n";
        if (day.activities && day.activities.length > 0) {
          day.activities.forEach((activity) => {
            content += `${activity.time}: ${activity.description}\n`;
          });
        }
      });
    }

    if (data.transportation && data.transportation.length > 0) {
      content += "\n--- TRANSPORTATION OPTIONS ---\n";
      data.transportation.forEach((trans) => {
        content += `\n${trans.mode}: ${trans.route}\n`;
        content += `Cost: ${trans.cost}\n`;
        content += `Duration: ${trans.duration}\n`;
        if (trans.notes) content += `Notes: ${trans.notes}\n`;
      });
    }

    if (data.accommodation && data.accommodation.length > 0) {
      content += "\n--- ACCOMMODATION OPTIONS ---\n";
      data.accommodation.forEach((city) => {
        content += `\n${city.city}:\n`;
        if (city.options && city.options.length > 0) {
          city.options.forEach((option) => {
            content += `  ${option.type}: ${option.price} (${option.rating}★) - ${option.example}\n`;
          });
        }
      });
    }

    if (data.estimatedTotal) {
      content += "\n--- ESTIMATED TOTAL COSTS ---\n";
      content += `Budget Option: ${data.estimatedTotal.budget}\n`;
      content += `Mid-Range Option: ${data.estimatedTotal.midRange}\n`;
      content += `Luxury Option: ${data.estimatedTotal.luxury}\n`;
    }

    if (data.tips && data.tips.length > 0) {
      content += "\n--- ESSENTIAL TRAVEL TIPS ---\n";
      data.tips.forEach((tip, i) => {
        content += `${i + 1}. ${tip}\n`;
      });
    }

    return content;
  };

  const TabButton = ({ id, label, icon, active, onClick }) => (
    <button
      onClick={onClick}
      className={`flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-all duration-200 ${
        active
          ? "bg-blue-600 text-white shadow-lg transform -translate-y-0.5"
          : "text-gray-600 hover:text-blue-600 hover:bg-blue-50"
      }`}
    >
      {icon}
      <span className="ml-2">{label}</span>
    </button>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-2 rounded-xl">
                <Globe className="h-8 w-8 text-white" />
              </div>
              <div className="ml-3">
                <h1 className="text-2xl font-bold text-gray-900">
                  TravelMate AI
                </h1>
                <p className="text-sm text-gray-600">
                  Your intelligent travel planning assistant
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex items-center bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm">
                <Sparkles className="h-4 w-4 mr-1" />
                AI Powered
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
              <h2 className="text-lg font-semibold mb-4 flex items-center">
                <TrendingUp className="h-5 w-5 mr-2 text-blue-600" />
                Popular Prompts
              </h2>
              <div className="space-y-3">
                {examplePrompts.map((example, i) => (
                  <button
                    key={i}
                    onClick={() => setPrompt(example)}
                    className="w-full text-left p-3 bg-gray-50 hover:bg-blue-50 rounded-lg text-sm border border-gray-200 transition-all duration-200 hover:border-blue-300 hover:shadow-md group"
                  >
                    <div className="flex items-center justify-between">
                      <span className="group-hover:text-blue-700">
                        {example}
                      </span>
                      <ChevronRight className="h-4 w-4 text-gray-400 group-hover:text-blue-600" />
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {history.length > 0 && (
              <div className="bg-white rounded-2xl shadow-lg p-6">
                <h2 className="text-lg font-semibold mb-4 flex items-center">
                  <Clock className="h-5 w-5 mr-2 text-purple-600" />
                  Recent Searches
                </h2>
                <div className="space-y-3">
                  {history.map((item, i) => (
                    <button
                      key={i}
                      onClick={() => {
                        setPrompt(item.prompt);
                        setResponse(item.response);
                      }}
                      className="w-full text-left p-3 bg-gray-50 hover:bg-purple-50 rounded-lg text-sm border border-gray-200 transition-all duration-200 hover:border-purple-300 hover:shadow-md group"
                      title={item.prompt}
                    >
                      <div className="flex items-center justify-between">
                        <span className="truncate group-hover:text-purple-700">
                          {item.prompt}
                        </span>
                        <ChevronRight className="h-4 w-4 text-gray-400 group-hover:text-purple-600" />
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            {/* Search Bar */}
            <form
              onSubmit={handleSubmit}
              className="bg-white rounded-2xl shadow-lg p-6 mb-8"
            >
              <div className="flex items-center space-x-4">
                <div className="flex-1 relative">
                  <input
                    type="text"
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    placeholder="Ask me anything about your travel plans... e.g., 'Plan a 5-day trip to Japan from India with budget breakdown'"
                    className="w-full p-4 pr-12 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-lg placeholder-gray-400"
                    disabled={loading}
                  />
                  <MapPin className="absolute right-4 top-4 h-6 w-6 text-gray-400" />
                </div>
                <button
                  type="submit"
                  disabled={loading || !prompt.trim()}
                  className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-4 rounded-xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center transition-all duration-200 transform hover:scale-105 shadow-lg"
                >
                  {loading ? (
                    <Loader2 className="h-5 w-5 animate-spin" />
                  ) : (
                    <>
                      <Send className="h-5 w-5 mr-2" />
                      Plan Trip
                    </>
                  )}
                </button>
              </div>
            </form>

            {/* Loading State */}
            {loading && (
              <div className="bg-white rounded-2xl shadow-lg p-12 text-center">
                <div className="flex flex-col items-center">
                  <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-4 rounded-full mb-4">
                    <Loader2 className="h-8 w-8 text-white animate-spin" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-800 mb-2">
                    Crafting Your Perfect Trip...
                  </h3>
                  <p className="text-gray-600">
                    Analyzing destinations, calculating costs, and creating your
                    personalized itinerary
                  </p>
                </div>
              </div>
            )}

            {/* Error State */}
            {response?.error && (
              <div className="bg-red-50 border border-red-200 rounded-2xl p-6 text-red-700">
                <div className="flex items-center">
                  <div className="bg-red-100 p-2 rounded-full mr-3">
                    <MapPin className="h-5 w-5 text-red-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold">
                      Oops! Something went wrong
                    </h3>
                    <p>{response.message}</p>
                  </div>
                </div>
              </div>
            )}

            {/* Results */}
            {response && !response.error && (
              <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
                {/* Header */}
                <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <h2 className="text-2xl font-bold mb-2">
                        {response.destination || "Your Travel Plan"}
                      </h2>
                      <p className="text-blue-100">
                        {response.summary ||
                          "Custom travel itinerary created for you"}
                      </p>
                    </div>
                    <button
                      onClick={handleDownload}
                      className="bg-white/20 hover:bg-white/30 text-white px-4 py-2 rounded-lg transition-colors duration-200 flex items-center"
                    >
                      <Download className="h-5 w-5 mr-2" />
                      Download
                    </button>
                  </div>
                </div>

                {/* Tabs */}
                <div className="border-b border-gray-200 bg-gray-50 px-6 py-4">
                  <div className="flex space-x-2 overflow-x-auto">
                    <TabButton
                      id="overview"
                      label="Overview"
                      icon={<Globe className="h-4 w-4" />}
                      active={activeTab === "overview"}
                      onClick={() => setActiveTab("overview")}
                    />
                    <TabButton
                      id="itinerary"
                      label="Itinerary"
                      icon={<Calendar className="h-4 w-4" />}
                      active={activeTab === "itinerary"}
                      onClick={() => setActiveTab("itinerary")}
                    />
                    <TabButton
                      id="transport"
                      label="Transport"
                      icon={<Plane className="h-4 w-4" />}
                      active={activeTab === "transport"}
                      onClick={() => setActiveTab("transport")}
                    />
                    <TabButton
                      id="accommodation"
                      label="Hotels"
                      icon={<Hotel className="h-4 w-4" />}
                      active={activeTab === "accommodation"}
                      onClick={() => setActiveTab("accommodation")}
                    />
                    <TabButton
                      id="budget"
                      label="Budget"
                      icon={<DollarSign className="h-4 w-4" />}
                      active={activeTab === "budget"}
                      onClick={() => setActiveTab("budget")}
                    />
                  </div>
                </div>

                {/* Tab Content */}
                <div className="p-6" ref={responseRef}>
                  {activeTab === "overview" && (
                    <div className="space-y-8">
                      {/* Quick Stats */}
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="bg-blue-50 rounded-xl p-6 text-center">
                          <Calendar className="h-8 w-8 text-blue-600 mx-auto mb-3" />
                          <h3 className="font-semibold text-blue-900">
                            Duration
                          </h3>
                          <p className="text-2xl font-bold text-blue-700">
                            {response.itinerary?.length || 0} Days
                          </p>
                        </div>
                        <div className="bg-green-50 rounded-xl p-6 text-center">
                          <DollarSign className="h-8 w-8 text-green-600 mx-auto mb-3" />
                          <h3 className="font-semibold text-green-900">
                            Budget Range
                          </h3>
                          <p className="text-lg font-bold text-green-700">
                            {response.estimatedTotal?.budget ||
                              "Contact for pricing"}
                          </p>
                        </div>
                        <div className="bg-purple-50 rounded-xl p-6 text-center">
                          <MapPin className="h-8 w-8 text-purple-600 mx-auto mb-3" />
                          <h3 className="font-semibold text-purple-900">
                            Destinations
                          </h3>
                          <p className="text-2xl font-bold text-purple-700">
                            {response.itinerary
                              ? new Set(
                                  response.itinerary.map((day) => day.location)
                                ).size
                              : 0}
                          </p>
                        </div>
                      </div>

                      {/* Top Tips */}
                      {response.tips && response.tips.length > 0 && (
                        <div className="bg-amber-50 rounded-xl p-6">
                          <h3 className="text-lg font-semibold text-amber-900 mb-4 flex items-center">
                            <Sparkles className="h-5 w-5 mr-2" />
                            Essential Travel Tips
                          </h3>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {response.tips.slice(0, 6).map((tip, i) => (
                              <div
                                key={i}
                                className="flex items-start space-x-3"
                              >
                                <span className="bg-amber-200 text-amber-800 rounded-full w-6 h-6 flex items-center justify-center text-sm font-medium flex-shrink-0">
                                  {i + 1}
                                </span>
                                <span className="text-amber-800">{tip}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Day Highlights */}
                      {response.itinerary && response.itinerary.length > 0 && (
                        <div>
                          <h3 className="text-lg font-semibold text-gray-900 mb-6">
                            Trip Highlights
                          </h3>
                          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {response.itinerary.map((day, i) => (
                              <div
                                key={i}
                                className="bg-gray-50 rounded-xl p-4 hover:bg-gray-100 transition-colors duration-200"
                              >
                                <div className="flex items-center justify-between mb-2">
                                  <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
                                    Day {day.day}
                                  </span>
                                  <MapPin className="h-4 w-4 text-gray-400" />
                                </div>
                                <h4 className="font-semibold text-gray-900">
                                  {day.location}
                                </h4>
                                <p className="text-sm text-gray-600 mt-1">
                                  {day.activities?.length || 0} activities
                                  planned
                                </p>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  )}

                  {activeTab === "itinerary" && (
                    <div className="space-y-6">
                      <h2 className="text-2xl font-bold text-gray-900">
                        Day-by-Day Itinerary
                      </h2>
                      {response.itinerary && response.itinerary.length > 0 ? (
                        response.itinerary.map((day, i) => (
                          <div
                            key={i}
                            className="border border-gray-200 rounded-xl overflow-hidden"
                          >
                            <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-4">
                              <div className="flex items-center justify-between">
                                <div>
                                  <h3 className="text-xl font-semibold">
                                    Day {day.day}
                                  </h3>
                                  <p className="text-blue-100">
                                    {day.location}
                                  </p>
                                </div>
                                <Calendar className="h-6 w-6 text-blue-200" />
                              </div>
                            </div>
                            <div className="p-6">
                              <div className="space-y-4">
                                {day.activities && day.activities.length > 0 ? (
                                  day.activities.map((activity, j) => (
                                    <div
                                      key={j}
                                      className="flex items-start space-x-4 p-4 bg-gray-50 rounded-lg"
                                    >
                                      <div className="flex items-center space-x-2">
                                        <div className="bg-white p-2 rounded-full shadow-sm">
                                          {getTimeIcon(activity.time)}
                                        </div>
                                        <div className="bg-white p-2 rounded-full shadow-sm">
                                          {getActivityIcon(
                                            activity.description
                                          )}
                                        </div>
                                      </div>
                                      <div className="flex-1">
                                        <h4 className="font-semibold text-gray-900">
                                          {activity.time}
                                        </h4>
                                        <p className="text-gray-700 mt-1">
                                          {activity.description}
                                        </p>
                                      </div>
                                    </div>
                                  ))
                                ) : (
                                  <p className="text-gray-500">
                                    No activities planned for this day
                                  </p>
                                )}
                              </div>
                            </div>
                          </div>
                        ))
                      ) : (
                        <p className="text-gray-500">No itinerary available</p>
                      )}
                    </div>
                  )}

                  {activeTab === "transport" && (
                    <div className="space-y-6">
                      <h2 className="text-2xl font-bold text-gray-900">
                        Transportation Options
                      </h2>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {response.transportation?.map((transport, i) => (
                          <div
                            key={i}
                            className="border border-gray-200 rounded-xl p-6 hover:shadow-lg transition-shadow duration-200"
                          >
                            <div className="flex items-center mb-4">
                              <div className="bg-blue-100 p-3 rounded-full mr-4">
                                {transport.mode === "Flight" ? (
                                  <Plane className="h-6 w-6 text-blue-600" />
                                ) : transport.mode === "Train" ? (
                                  <Train className="h-6 w-6 text-blue-600" />
                                ) : transport.mode === "Car Rental" ? (
                                  <Car className="h-6 w-6 text-blue-600" />
                                ) : (
                                  <Bus className="h-6 w-6 text-blue-600" />
                                )}
                              </div>
                              <div>
                                <h3 className="text-lg font-semibold text-gray-900">
                                  {transport.mode}
                                </h3>
                                <p className="text-gray-600">
                                  {transport.route}
                                </p>
                              </div>
                            </div>
                            <div className="space-y-2">
                              <div className="flex justify-between items-center">
                                <span className="text-gray-600">Cost:</span>
                                <span className="font-semibold text-green-600">
                                  {transport.cost}
                                </span>
                              </div>
                              <div className="flex justify-between items-center">
                                <span className="text-gray-600">Duration:</span>
                                <span className="font-semibold">
                                  {transport.duration}
                                </span>
                              </div>
                              {transport.notes && (
                                <div className="mt-3 p-3 bg-blue-50 rounded-lg">
                                  <p className="text-sm text-blue-800">
                                    {transport.notes}
                                  </p>
                                </div>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {activeTab === "accommodation" && (
                    <div className="space-y-6">
                      <h2 className="text-2xl font-bold text-gray-900">
                        Accommodation Options
                      </h2>
                      {response.accommodation?.map((city, i) => (
                        <div
                          key={i}
                          className="border border-gray-200 rounded-xl overflow-hidden"
                        >
                          <div className="bg-gray-100 px-6 py-4">
                            <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                              <MapPin className="h-5 w-5 mr-2 text-blue-600" />
                              {city.city}
                            </h3>
                          </div>
                          <div className="p-6">
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                              {city.options?.map((option, j) => (
                                <div
                                  key={j}
                                  className="border border-gray-200 rounded-lg p-5 hover:shadow-md transition-shadow duration-200"
                                >
                                  <div className="flex items-center justify-between mb-3">
                                    <span
                                      className={`px-3 py-1 rounded-full text-sm font-medium ${
                                        option.type === "Budget"
                                          ? "bg-green-100 text-green-800"
                                          : option.type === "Mid-Range"
                                          ? "bg-blue-100 text-blue-800"
                                          : "bg-purple-100 text-purple-800"
                                      }`}
                                    >
                                      {option.type}
                                    </span>
                                    <div className="flex items-center">
                                      {Array.from({
                                        length: option.rating,
                                      }).map((_, k) => (
                                        <Star
                                          key={k}
                                          className="h-4 w-4 text-yellow-400 fill-current"
                                        />
                                      ))}
                                    </div>
                                  </div>
                                  <h4 className="text-xl font-bold text-gray-900 mb-2">
                                    {option.price}
                                  </h4>
                                  <p className="text-gray-600 mb-4">
                                    {option.example}
                                  </p>
                                  <button className="w-full bg-blue-50 hover:bg-blue-100 text-blue-700 py-2 rounded-lg transition-colors duration-200 flex items-center justify-center">
                                    <Heart className="h-4 w-4 mr-2" />
                                    Save Option
                                  </button>
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  {activeTab === "budget" && (
                    <div className="space-y-6">
                      <h2 className="text-2xl font-bold text-gray-900">
                        Budget Breakdown
                      </h2>
                      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl p-6">
                        <div className="flex items-center justify-between mb-6">
                          <div>
                            <h3 className="text-xl font-semibold">
                              Estimated Total Costs
                            </h3>
                            <p className="text-blue-100">
                              For {response.itinerary?.length || 0} days
                            </p>
                          </div>
                          <DollarSign className="h-8 w-8 text-blue-200" />
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          <div className="bg-white/20 p-4 rounded-lg">
                            <h4 className="text-sm font-medium text-blue-100 mb-1">
                              Budget Option
                            </h4>
                            <p className="text-2xl font-bold">
                              {response.estimatedTotal?.budget}
                            </p>
                          </div>
                          <div className="bg-white/20 p-4 rounded-lg">
                            <h4 className="text-sm font-medium text-blue-100 mb-1">
                              Mid-Range
                            </h4>
                            <p className="text-2xl font-bold">
                              {response.estimatedTotal?.midRange}
                            </p>
                          </div>
                          <div className="bg-white/20 p-4 rounded-lg">
                            <h4 className="text-sm font-medium text-blue-100 mb-1">
                              Luxury
                            </h4>
                            <p className="text-2xl font-bold">
                              {response.estimatedTotal?.luxury}
                            </p>
                          </div>
                        </div>
                      </div>

                      <div className="bg-white border border-gray-200 rounded-xl p-6">
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">
                          Cost Components
                        </h3>
                        <div className="space-y-4">
                          <div>
                            <h4 className="font-medium text-gray-900 mb-2">
                              Transportation
                            </h4>
                            <div className="w-full bg-gray-200 rounded-full h-2.5">
                              <div
                                className="bg-blue-600 h-2.5 rounded-full"
                                style={{ width: "70%" }}
                              ></div>
                            </div>
                            <div className="flex justify-between text-sm text-gray-600 mt-1">
                              <span>
                                $
                                {Math.round(
                                  parseFloat(
                                    response.estimatedTotal?.midRange.replace(
                                      /[^0-9.]/g,
                                      ""
                                    )
                                  ) * 0.7
                                )}
                              </span>
                              <span>~70% of total</span>
                            </div>
                          </div>
                          <div>
                            <h4 className="font-medium text-gray-900 mb-2">
                              Accommodation
                            </h4>
                            <div className="w-full bg-gray-200 rounded-full h-2.5">
                              <div
                                className="bg-purple-600 h-2.5 rounded-full"
                                style={{ width: "20%" }}
                              ></div>
                            </div>
                            <div className="flex justify-between text-sm text-gray-600 mt-1">
                              <span>
                                $
                                {Math.round(
                                  parseFloat(
                                    response.estimatedTotal?.midRange.replace(
                                      /[^0-9.]/g,
                                      ""
                                    )
                                  ) * 0.2
                                )}
                              </span>
                              <span>~20% of total</span>
                            </div>
                          </div>
                          <div>
                            <h4 className="font-medium text-gray-900 mb-2">
                              Activities & Food
                            </h4>
                            <div className="w-full bg-gray-200 rounded-full h-2.5">
                              <div
                                className="bg-green-600 h-2.5 rounded-full"
                                style={{ width: "10%" }}
                              ></div>
                            </div>
                            <div className="flex justify-between text-sm text-gray-600 mt-1">
                              <span>
                                $
                                {Math.round(
                                  parseFloat(
                                    response.estimatedTotal?.midRange.replace(
                                      /[^0-9.]/g,
                                      ""
                                    )
                                  ) * 0.1
                                )}
                              </span>
                              <span>~10% of total</span>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-6">
                        <h3 className="text-lg font-semibold text-yellow-900 mb-3 flex items-center">
                          <DollarSign className="h-5 w-5 mr-2" />
                          Money Saving Tips
                        </h3>
                        <ul className="space-y-2">
                          <li className="flex items-start">
                            <span className="bg-yellow-200 text-yellow-800 rounded-full w-5 h-5 flex items-center justify-center text-xs font-medium mr-2 mt-0.5 flex-shrink-0">
                              1
                            </span>
                            <span className="text-yellow-800">
                              Book flights 2-3 months in advance for best prices
                            </span>
                          </li>
                          <li className="flex items-start">
                            <span className="bg-yellow-200 text-yellow-800 rounded-full w-5 h-5 flex items-center justify-center text-xs font-medium mr-2 mt-0.5 flex-shrink-0">
                              2
                            </span>
                            <span className="text-yellow-800">
                              Consider budget airlines for short domestic
                              flights
                            </span>
                          </li>
                          <li className="flex items-start">
                            <span className="bg-yellow-200 text-yellow-800 rounded-full w-5 h-5 flex items-center justify-center text-xs font-medium mr-2 mt-0.5 flex-shrink-0">
                              3
                            </span>
                            <span className="text-yellow-800">
                              Use public transportation instead of taxis when
                              possible
                            </span>
                          </li>
                          <li className="flex items-start">
                            <span className="bg-yellow-200 text-yellow-800 rounded-full w-5 h-5 flex items-center justify-center text-xs font-medium mr-2 mt-0.5 flex-shrink-0">
                              4
                            </span>
                            <span className="text-yellow-800">
                              Look for accommodations with kitchen facilities to
                              save on meals
                            </span>
                          </li>
                        </ul>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="bg-white border-t border-gray-200 mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="md:flex md:items-center md:justify-between">
            <div className="flex justify-center md:order-2 space-x-6">
              <a href="#" className="text-gray-400 hover:text-gray-500">
                <span className="sr-only">GitHub</span>
                <svg
                  className="h-6 w-6"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <path
                    fillRule="evenodd"
                    d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
                    clipRule="evenodd"
                  />
                </svg>
              </a>
            </div>
            <div className="mt-8 md:mt-0 md:order-1">
              <p className="text-center text-base text-gray-500">
                &copy; 2025 TravelMate AI. All rights reserved.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default TravelAssistant;
