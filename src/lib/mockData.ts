export type FoodCategory = 'Breakfast' | 'Lunch' | 'Dinner' | 'Snacks';
export type FoodType = 'Veg' | 'Non-veg' | 'Vegan';

export interface FoodItem {
  id: string;
  name: string;
  description: string;
  category: FoodCategory;
  price: number;
  calories: number;
  protein: number; // in grams
  carbs: number; // in grams
  fat: number; // in grams
  type: FoodType;
  image: string;
  isPopular?: boolean;
}

export const mockFoodItems: FoodItem[] = [
  {
    id: 'f1',
    name: 'Avocado Toast with Poached Egg',
    description: 'Whole grain toast topped with fresh avocado and a soft poached egg.',
    category: 'Breakfast',
    price: 350,
    calories: 350,
    protein: 14,
    carbs: 28,
    fat: 20,
    type: 'Non-veg',
    image: 'https://images.unsplash.com/photo-1525351484163-7529414344d8?w=800&q=80',
    isPopular: true
  },
  {
    id: 'f2',
    name: 'Vegan Protein Oat Bowl',
    description: 'Oats loaded with chia seeds, berries, and almond butter.',
    category: 'Breakfast',
    price: 250,
    calories: 420,
    protein: 20,
    carbs: 55,
    fat: 16,
    type: 'Vegan',
    image: 'https://images.unsplash.com/photo-1517673132405-a56a62b18caf?w=800&q=80'
  },
  {
    id: 'f3',
    name: 'Grilled Chicken Quinoa Salad',
    description: 'Lean chicken breast strips over a bed of quinoa, cherry tomatoes, and cucumber.',
    category: 'Lunch',
    price: 450,
    calories: 480,
    protein: 45,
    carbs: 40,
    fat: 15,
    type: 'Non-veg',
    image: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=800&q=80',
    isPopular: true
  },
  {
    id: 'f4',
    name: 'Lentil & Sweet Potato Curry',
    description: 'Rich, warming curry packed with plant-based protein and fiber.',
    category: 'Lunch',
    price: 390,
    calories: 410,
    protein: 18,
    carbs: 65,
    fat: 10,
    type: 'Vegan',
    image: 'https://images.unsplash.com/photo-1565557612666-ac563604e389?w=800&q=80'
  },
  {
    id: 'f5',
    name: 'Baked Salmon with Asparagus',
    description: 'Omega-3 rich salmon fillet baked with lemon and served with roasted asparagus.',
    category: 'Dinner',
    price: 890,
    calories: 450,
    protein: 42,
    carbs: 10,
    fat: 26,
    type: 'Non-veg',
    image: 'https://images.unsplash.com/photo-1467003909585-2f8a72700288?w=800&q=80',
    isPopular: true
  },
  {
    id: 'f6',
    name: 'Paneer Tikka Wrap',
    description: 'Whole wheat wrap featuring spiced grilled paneer, peppers, and mint chutney.',
    category: 'Snacks',
    price: 220,
    calories: 380,
    protein: 16,
    carbs: 35,
    fat: 20,
    type: 'Veg',
    image: 'https://images.unsplash.com/photo-1629814402631-01f1437198a2?w=800&q=80'
  },
  {
    id: 'f7',
    name: 'Protein Bliss Bites',
    description: 'Energy balls made from dates, nuts, and whey isolates.',
    category: 'Snacks',
    price: 150,
    calories: 220,
    protein: 12,
    carbs: 25,
    fat: 9,
    type: 'Veg',
    image: 'https://images.unsplash.com/photo-1528751014936-863e6e8a3ee2?w=800&q=80'
  }
];

export const mockUserProfile = {
  name: 'John Doe',
  age: 28,
  weight: 75, // kg
  height: 175, // cm
  goal: 'Weight Loss' as 'Weight Loss' | 'Muscle Gain' | 'Maintenance',
  dailyCaloriesLimit: 2200,
};

export interface Restaurant {
  id: string;
  name: string;
  rating: number;
  deliveryTime: string;
  tags: string[];
  image: string;
}

export const mockRestaurants: Restaurant[] = [
  {
    id: 'r1',
    name: 'Green Bowl Cloud Kitchen',
    rating: 4.8,
    deliveryTime: '20-30 min',
    tags: ['Healthy', 'Salads', 'Vegan'],
    image: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=800&q=80'
  },
  {
    id: 'r2',
    name: 'Protein Box Deli',
    rating: 4.6,
    deliveryTime: '25-40 min',
    tags: ['Keto', 'High Protein', 'Grill'],
    image: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=800&q=80'
  },
  {
    id: 'r3',
    name: 'Sprout & Spice',
    rating: 4.5,
    deliveryTime: '30-45 min',
    tags: ['Indian', 'Vegetarian', 'Curry'],
    image: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800&q=80'
  },
  {
    id: 'r4',
    name: 'FitBite Central',
    rating: 4.9,
    deliveryTime: '15-25 min',
    tags: ['Smoothies', 'Snacks', 'Breakfast'],
    image: 'https://images.unsplash.com/photo-1493770348161-369560ae357d?w=800&q=80'
  }
];
