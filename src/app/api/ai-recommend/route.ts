import { NextResponse } from 'next/server';
import { mockRestaurants, mockFoodItems } from '@/lib/mockData';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { remainingCalories, budgetInPaise, preference, mealType } = body;

    // Simulate AI algorithmic delay
    await new Promise(resolve => setTimeout(resolve, 1500));

    // Filter available foods based on specific meal category requested
    let available = mockFoodItems.filter(f => f.calories <= remainingCalories);
    
    // Exact category match
    if (mealType) {
      available = available.filter(f => f.category === mealType);
    }
    
    if (preference === 'Veg' || preference === 'Vegan') {
      available = available.filter(f => f.type === 'Veg' || f.type === 'Vegan');
    }

    if (available.length === 0) {
      return NextResponse.json({
        success: false,
        message: `No ${mealType || 'items'} found matching your criteria under ₹${budgetInPaise}.`
      });
    }

    // Sort by protein/calorie ratio logically
    available.sort((a, b) => (b.protein / b.calories) - (a.protein / a.calories));

    const recommendations = [];

    // Construct up to 3 diverse options
    for (let i = 0; i < Math.min(3, available.length); i++) {
        let rootItem = available[i];
        let combo = [rootItem];
        let currentCals = rootItem.calories;
        let currentTotal = rootItem.price;

        // Try adding a second item to the combo if it fits
        for (let j = 0; j < available.length; j++) {
            if (i !== j) {
                let secondItem = available[j];
                if (currentCals + secondItem.calories <= remainingCalories && currentTotal + secondItem.price <= budgetInPaise) {
                    combo.push(secondItem);
                    break; // Just pair it with one other item
                }
            }
        }

        const kitchen = mockRestaurants[Math.floor(Math.random() * mockRestaurants.length)];
        
        recommendations.push({
            id: `rec-${i}`,
            message: `Option ${i + 1}: High protein blend specifically optimized for ${mealType || 'your goal'}.`,
            kitchen: kitchen,
            items: combo,
            totalPrice: combo.reduce((acc, it) => acc + it.price, 0),
            totalCalories: combo.reduce((acc, it) => acc + it.calories, 0),
            macros: {
              protein: combo.reduce((acc, it) => acc + it.protein, 0),
              carbs: combo.reduce((acc, it) => acc + it.carbs, 0),
              fat: combo.reduce((acc, it) => acc + it.fat, 0)
            }
        });
    }

    return NextResponse.json({
      success: true,
      recommendations: recommendations
    });
  } catch (error) {
    return NextResponse.json({ success: false, message: "AI Error occurred" }, { status: 500 });
  }
}
