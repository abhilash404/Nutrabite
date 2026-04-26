import Link from 'next/link';

export default async function KitchensPage() {
  let restaurants: any[] = [];
  try {
    const res = await fetch('http://127.0.0.1:5000/api/kitchens', { cache: 'no-store' });
    if (res.ok) restaurants = await res.json();
  } catch (e) {
    console.error("Failed to fetch kitchens", e);
  }

  return (
    <div className="container mx-auto px-4 py-12 max-w-7xl">
      <div className="mb-10 text-center md:text-left">
        <h1 className="text-4xl font-extrabold text-neutral-900 dark:text-neutral-100 mb-4 tracking-tight">Cloud Kitchens & Partner Restaurants</h1>
        <p className="text-neutral-500 dark:text-neutral-400 text-lg max-w-2xl">
          Order directly from our verified partners focused on healthy, nutritious, and delicious meals, cooked fresh in pristine cloud kitchens.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
        {restaurants.map((restaurant) => (
          <div 
            key={restaurant.id} 
            className="group bg-white dark:bg-neutral-900 rounded-3xl border border-neutral-100 dark:border-neutral-800 shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden flex flex-col"
          >
            <div className="relative h-48 w-full overflow-hidden">
              <img 
                src={restaurant.image} 
                alt={restaurant.name} 
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute top-4 right-4 bg-slate-100 dark:bg-neutral-800/900 backdrop-blur tracking-tight px-2.5 py-1 rounded-full text-xs font-bold text-neutral-900 dark:text-neutral-100 shadow-sm flex items-center gap-1">
                ⭐ {restaurant.rating}
              </div>
            </div>

            <div className="p-6 flex-1 flex flex-col">
              <h2 className="text-xl font-bold text-neutral-900 dark:text-neutral-100 mb-2 truncate">
                {restaurant.name}
              </h2>
              
              <div className="flex flex-wrap gap-2 mb-4">
                {restaurant.tags.map(tag => (
                  <span 
                    key={tag} 
                    className="text-[10px] uppercase tracking-wider font-bold bg-neutral-100 text-neutral-600 px-2.5 py-1 rounded-md"
                  >
                    {tag}
                  </span>
                ))}
              </div>

              <div className="mt-auto pt-4 flex items-center justify-between border-t border-neutral-100 dark:border-neutral-800">
                <div className="flex items-center text-sm font-bold text-neutral-400">
                  <span className="mr-1">🕒</span>
                  {restaurant.deliveryTime}
                </div>
                
                <Link 
                  href="/menu" 
                  className="text-sm font-bold text-green-600 hover:text-green-700 bg-green-50 px-4 py-2 rounded-xl transition-colors"
                >
                  View Menu
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
