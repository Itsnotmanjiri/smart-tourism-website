import { useState } from 'react';
import { Plane, Calendar, Users, DollarSign, MapPin, Sparkles } from 'lucide-react';

interface TripPlannerProps {
  onPlanGenerated?: (plan: any) => void;
}

export function TripPlannerAI({ onPlanGenerated }: TripPlannerProps) {
  const [step, setStep] = useState(1);
  const [tripData, setTripData] = useState({
    destination: '',
    duration: '',
    budget: '',
    travelers: '1',
    travelStyle: '',
    interests: [] as string[]
  });
  const [generatedPlan, setGeneratedPlan] = useState<any>(null);
  const [isGenerating, setIsGenerating] = useState(false);

  const destinations = [
    'Goa', 'Jaipur', 'Udaipur', 'Manali', 'Rishikesh',
    'Kerala', 'Varanasi', 'Agra', 'Delhi', 'Mumbai',
    'Bangalore'
  ];

  const travelStyles = [
    { id: 'luxury', name: 'Luxury', icon: '💎', desc: 'Premium hotels & experiences' },
    { id: 'adventure', name: 'Adventure', icon: '🏔️', desc: 'Trekking, sports, thrills' },
    { id: 'budget', name: 'Budget', icon: '💰', desc: 'Backpacker friendly' },
    { id: 'cultural', name: 'Cultural', icon: '🏛️', desc: 'Heritage & traditions' },
    { id: 'relaxation', name: 'Relaxation', icon: '🧘', desc: 'Spa, yoga, peace' },
    { id: 'party', name: 'Party', icon: '🎉', desc: 'Nightlife & social' }
  ];

  const interests = [
    'Food Tours', 'Photography', 'Yoga', 'Trekking', 'Water Sports',
    'Shopping', 'Wildlife', 'History', 'Beaches', 'Mountains',
    'Spirituality', 'Nightlife'
  ];

  const generateItinerary = () => {
    setIsGenerating(true);
    
    // Simulate AI processing
    setTimeout(() => {
      const plan = createSmartItinerary(tripData);
      setGeneratedPlan(plan);
      setIsGenerating(false);
      if (onPlanGenerated) onPlanGenerated(plan);
    }, 2000);
  };

  const createSmartItinerary = (data: any) => {
    const days = parseInt(data.duration) || 3;
    const budgetPerPerson = parseInt(data.budget) || 15000;
    const travelers = parseInt(data.travelers) || 1;
    const totalBudget = budgetPerPerson * travelers;

    // Smart budget allocation
    const allocation = {
      accommodation: Math.floor(totalBudget * 0.35),
      food: Math.floor(totalBudget * 0.25),
      activities: Math.floor(totalBudget * 0.25),
      transport: Math.floor(totalBudget * 0.15)
    };

    // Generate day-by-day itinerary based on destination
    const dayPlans = [];
    
    for (let i = 1; i <= days; i++) {
      dayPlans.push({
        day: i,
        title: i === 1 ? 'Arrival & Exploration' :
               i === days ? 'Departure' :
               `${data.destination} Adventures`,
        activities: getActivitiesForDay(data.destination, i, data.travelStyle, data.interests),
        meals: getMealSuggestions(data.destination, data.budget),
        accommodation: i < days ? getHotelSuggestion(data.destination, data.budget) : null
      });
    }

    return {
      destination: data.destination,
      duration: days,
      travelers: travelers,
      totalBudget,
      allocation,
      dayPlans,
      bestTime: getBestTimeToVisit(data.destination),
      packingList: getPackingList(data.destination, data.travelStyle),
      tips: getLocalTips(data.destination)
    };
  };

  const getActivitiesForDay = (dest: string, day: number, style: string, interests: string[]) => {
    const activities: any = {
      'Goa': [
        ['Fort Aguada sunrise', 'Breakfast at Baga Beach', 'Water sports'],
        ['Dudhsagar Falls trek', 'Spice plantation tour', 'Beach sunset'],
        ['Old Goa churches', 'Anjuna Flea Market', 'Beach party']
      ],
      'Jaipur': [
        ['Amber Fort elephant ride', 'City Palace tour', 'Jantar Mantar'],
        ['Hawa Mahal photoshoot', 'Johari Bazaar shopping', 'Chokhi Dhani dinner'],
        ['Nahargarh Fort sunset', 'Patrika Gate', 'Rooftop cafe']
      ],
      'Manali': [
        ['Solang Valley paragliding', 'River rafting', 'Cafe hopping'],
        ['Rohtang Pass snow activities', 'Photography', 'Local food'],
        ['Hadimba Temple', 'Old Manali walk', 'Mall Road shopping']
      ]
    };

    return activities[dest]?.[day - 1] || [
      'Local sightseeing',
      'Cultural experiences',
      'Food exploration'
    ];
  };

  const getMealSuggestions = (dest: string, budget: string) => {
    const budgetNum = parseInt(budget);
    if (budgetNum > 20000) {
      return { breakfast: 'Hotel buffet', lunch: 'Fine dining restaurant', dinner: 'Specialty cuisine' };
    } else if (budgetNum > 10000) {
      return { breakfast: 'Local cafe', lunch: 'Mid-range restaurant', dinner: 'Popular local spot' };
    } else {
      return { breakfast: 'Street food', lunch: 'Local dhaba', dinner: 'Budget restaurant' };
    }
  };

  const getHotelSuggestion = (dest: string, budget: string) => {
    const budgetNum = parseInt(budget);
    if (budgetNum > 20000) return 'Luxury 5-star hotel';
    if (budgetNum > 10000) return '4-star or boutique hotel';
    if (budgetNum > 5000) return '3-star or mid-range hotel';
    return 'Budget hotel or hostel';
  };

  const getBestTimeToVisit = (dest: string) => {
    const timing: any = {
      'Goa': 'November to February',
      'Jaipur': 'October to March',
      'Manali': 'October-February (snow) or April-June (pleasant)',
      'Kerala': 'September to March',
      'Varanasi': 'October to March'
    };
    return timing[dest] || 'October to March';
  };

  const getPackingList = (dest: string, style: string) => {
    const base = ['Comfortable shoes', 'Sunscreen', 'Camera', 'Power bank', 'Medications'];
    const extras: any = {
      'Goa': ['Swimwear', 'Beach towel', 'Sunglasses', 'Light clothes'],
      'Manali': ['Winter jacket', 'Gloves', 'Thermal wear', 'Trekking shoes'],
      'Jaipur': ['Light cotton clothes', 'Hat', 'Comfortable walking shoes']
    };
    return [...base, ...(extras[dest] || [])];
  };

  const getLocalTips = (dest: string) => {
    const tips: any = {
      'Goa': [
        'Rent a scooter for ₹300-500/day',
        'Try fish curry rice at beach shacks',
        'Visit on weekdays to avoid crowds'
      ],
      'Jaipur': [
        'Negotiate prices at markets',
        'Book Amber Fort tickets online',
        'Try Dal Baati Churma at LMB'
      ]
    };
    return tips[dest] || ['Stay hydrated', 'Try local food', 'Respect local customs'];
  };

  const handleNext = () => {
    if (step < 4) setStep(step + 1);
    else generateItinerary();
  };

  const handleBack = () => {
    if (step > 1) setStep(step - 1);
  };

  const toggleInterest = (interest: string) => {
    setTripData(prev => ({
      ...prev,
      interests: prev.interests.includes(interest)
        ? prev.interests.filter(i => i !== interest)
        : [...prev.interests, interest]
    }));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-purple-900 to-pink-900 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {!generatedPlan ? (
          <div className="backdrop-blur-xl bg-white/10 rounded-3xl border border-white/20 shadow-2xl p-8">
            {/* Header */}
            <div className="text-center mb-8">
              <div className="flex justify-center mb-4">
                <Sparkles className="w-16 h-16 text-yellow-300" />
              </div>
              <h1 className="text-4xl font-bold text-white mb-2">AI Trip Planner</h1>
              <p className="text-white/80">Create your perfect itinerary in minutes</p>
            </div>

            {/* Progress Bar */}
            <div className="flex justify-between mb-8">
              {[1, 2, 3, 4].map(s => (
                <div key={s} className="flex items-center flex-1">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold ${
                    step >= s ? 'bg-blue-500 text-white' : 'bg-white/20 text-white/50'
                  }`}>
                    {s}
                  </div>
                  {s < 4 && <div className={`flex-1 h-1 mx-2 ${step > s ? 'bg-blue-500' : 'bg-white/20'}`} />}
                </div>
              ))}
            </div>

            {/* Step 1: Destination & Duration */}
            {step === 1 && (
              <div className="space-y-6">
                <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                  <MapPin className="w-6 h-6" /> Where & When?
                </h2>
                
                <div>
                  <label className="block text-white mb-2">Destination</label>
                  <select
                    value={tripData.destination}
                    onChange={(e) => setTripData({ ...tripData, destination: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white focus:outline-none focus:border-blue-400"
                  >
                    <option value="">Select destination</option>
                    {destinations.map(d => (
                      <option key={d} value={d} className="text-gray-900">{d}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-white mb-2">How many days?</label>
                  <input
                    type="number"
                    min="1"
                    max="30"
                    value={tripData.duration}
                    onChange={(e) => setTripData({ ...tripData, duration: e.target.value })}
                    placeholder="e.g., 5"
                    className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white focus:outline-none focus:border-blue-400"
                  />
                </div>
              </div>
            )}

            {/* Step 2: Budget & Travelers */}
            {step === 2 && (
              <div className="space-y-6">
                <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                  <DollarSign className="w-6 h-6" /> Budget & Group Size
                </h2>

                <div>
                  <label className="block text-white mb-2">Budget per person (₹)</label>
                  <input
                    type="number"
                    min="1000"
                    value={tripData.budget}
                    onChange={(e) => setTripData({ ...tripData, budget: e.target.value })}
                    placeholder="e.g., 15000"
                    className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white focus:outline-none focus:border-blue-400"
                  />
                </div>

                <div>
                  <label className="block text-white mb-2">Number of travelers</label>
                  <input
                    type="number"
                    min="1"
                    max="20"
                    value={tripData.travelers}
                    onChange={(e) => setTripData({ ...tripData, travelers: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white focus:outline-none focus:border-blue-400"
                  />
                </div>
              </div>
            )}

            {/* Step 3: Travel Style */}
            {step === 3 && (
              <div className="space-y-6">
                <h2 className="text-2xl font-bold text-white">Travel Style</h2>
                
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {travelStyles.map(style => (
                    <button
                      key={style.id}
                      onClick={() => setTripData({ ...tripData, travelStyle: style.id })}
                      className={`p-4 rounded-xl border-2 transition-all ${
                        tripData.travelStyle === style.id
                          ? 'bg-blue-500 border-blue-400 scale-105'
                          : 'bg-white/10 border-white/20 hover:bg-white/20'
                      }`}
                    >
                      <div className="text-4xl mb-2">{style.icon}</div>
                      <div className="font-bold text-white">{style.name}</div>
                      <div className="text-xs text-white/70">{style.desc}</div>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Step 4: Interests */}
            {step === 4 && (
              <div className="space-y-6">
                <h2 className="text-2xl font-bold text-white">Your Interests</h2>
                <p className="text-white/70">Select all that apply</p>
                
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {interests.map(interest => (
                    <button
                      key={interest}
                      onClick={() => toggleInterest(interest)}
                      className={`px-4 py-3 rounded-xl border transition-all ${
                        tripData.interests.includes(interest)
                          ? 'bg-purple-500 border-purple-400'
                          : 'bg-white/10 border-white/20 hover:bg-white/20'
                      }`}
                    >
                      <span className="text-white">{interest}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Navigation Buttons */}
            <div className="flex justify-between mt-8">
              <button
                onClick={handleBack}
                disabled={step === 1}
                className="px-6 py-3 rounded-xl bg-white/10 text-white disabled:opacity-50 hover:bg-white/20 transition-all"
              >
                ← Back
              </button>
              <button
                onClick={handleNext}
                disabled={
                  (step === 1 && (!tripData.destination || !tripData.duration)) ||
                  (step === 2 && (!tripData.budget || !tripData.travelers)) ||
                  (step === 3 && !tripData.travelStyle)
                }
                className="px-6 py-3 rounded-xl bg-blue-500 text-white disabled:opacity-50 hover:bg-blue-600 transition-all flex items-center gap-2"
              >
                {step === 4 ? (
                  <>
                    <Sparkles className="w-5 h-5" />
                    Generate Itinerary
                  </>
                ) : (
                  'Next →'
                )}
              </button>
            </div>
          </div>
        ) : (
          /* Generated Itinerary Display */
          <div className="backdrop-blur-xl bg-white/10 rounded-3xl border border-white/20 shadow-2xl p-8 text-white">
            {isGenerating ? (
              <div className="text-center py-12">
                <Sparkles className="w-16 h-16 text-yellow-300 mx-auto mb-4 animate-spin" />
                <h2 className="text-2xl font-bold mb-2">Creating your perfect trip...</h2>
                <p className="text-white/70">Analyzing best attractions, hotels, and activities</p>
              </div>
            ) : (
              <div className="space-y-8">
                {/* Header */}
                <div className="text-center">
                  <h1 className="text-4xl font-bold mb-2">Your {generatedPlan.destination} Adventure!</h1>
                  <p className="text-white/80">{generatedPlan.duration} days • {generatedPlan.travelers} {generatedPlan.travelers > 1 ? 'travelers' : 'traveler'} • ₹{generatedPlan.totalBudget.toLocaleString()}</p>
                </div>

                {/* Budget Breakdown */}
                <div className="bg-white/5 rounded-2xl p-6">
                  <h3 className="font-bold text-xl mb-4">Budget Allocation</h3>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="bg-blue-500/20 p-4 rounded-xl">
                      <div className="text-sm text-white/70">Accommodation</div>
                      <div className="text-2xl font-bold">₹{generatedPlan.allocation.accommodation.toLocaleString()}</div>
                    </div>
                    <div className="bg-green-500/20 p-4 rounded-xl">
                      <div className="text-sm text-white/70">Food</div>
                      <div className="text-2xl font-bold">₹{generatedPlan.allocation.food.toLocaleString()}</div>
                    </div>
                    <div className="bg-purple-500/20 p-4 rounded-xl">
                      <div className="text-sm text-white/70">Activities</div>
                      <div className="text-2xl font-bold">₹{generatedPlan.allocation.activities.toLocaleString()}</div>
                    </div>
                    <div className="bg-orange-500/20 p-4 rounded-xl">
                      <div className="text-sm text-white/70">Transport</div>
                      <div className="text-2xl font-bold">₹{generatedPlan.allocation.transport.toLocaleString()}</div>
                    </div>
                  </div>
                </div>

                {/* Day-by-Day Itinerary */}
                <div>
                  <h3 className="font-bold text-2xl mb-4">Day-by-Day Itinerary</h3>
                  <div className="space-y-4">
                    {generatedPlan.dayPlans.map((day: any) => (
                      <div key={day.day} className="bg-white/5 rounded-2xl p-6">
                        <h4 className="font-bold text-lg mb-3">Day {day.day}: {day.title}</h4>
                        <div className="space-y-2">
                          {day.activities.map((activity: string, idx: number) => (
                            <div key={idx} className="flex items-center gap-2">
                              <div className="w-2 h-2 bg-blue-400 rounded-full" />
                              <span>{activity}</span>
                            </div>
                          ))}
                        </div>
                        {day.accommodation && (
                          <div className="mt-3 pt-3 border-t border-white/10">
                            <span className="text-sm text-white/70">Stay: </span>
                            <span>{day.accommodation}</span>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Packing List */}
                <div className="bg-white/5 rounded-2xl p-6">
                  <h3 className="font-bold text-xl mb-4">📦 Packing List</h3>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                    {generatedPlan.packingList.map((item: string, idx: number) => (
                      <div key={idx} className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-green-400 rounded-full" />
                        <span className="text-sm">{item}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Local Tips */}
                <div className="bg-yellow-500/10 rounded-2xl p-6 border border-yellow-500/20">
                  <h3 className="font-bold text-xl mb-4">💡 Local Tips</h3>
                  <div className="space-y-2">
                    {generatedPlan.tips.map((tip: string, idx: number) => (
                      <div key={idx} className="flex items-start gap-2">
                        <div className="w-2 h-2 bg-yellow-400 rounded-full mt-2" />
                        <span>{tip}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Actions */}
                <div className="flex gap-4">
                  <button
                    onClick={() => setGeneratedPlan(null)}
                    className="flex-1 px-6 py-3 rounded-xl bg-white/10 hover:bg-white/20 transition-all"
                  >
                    Create New Plan
                  </button>
                  <button
                    onClick={() => window.print()}
                    className="flex-1 px-6 py-3 rounded-xl bg-blue-500 hover:bg-blue-600 transition-all"
                  >
                    Download PDF
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
