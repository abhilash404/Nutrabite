import Image from "next/image";

const testimonials = [
  {
    name: "Rahul Sharma",
    role: "Fitness Enthusiast",
    text: "Nutrabite completely changed my diet routine. The meals are perfectly balanced and I finally hit my fitness goals without compromising taste.",
  },
  {
    name: "Priya Verma",
    role: "Working Professional",
    text: "I don’t have time to cook, but Nutrabite makes eating healthy effortless. The delivery is super fast and food tastes amazing!",
  },
  {
    name: "Aman Patel",
    role: "Gym Trainer",
    text: "The macro tracking is insanely accurate. I recommend Nutrabite to all my clients who want clean and consistent nutrition.",
  },
  {
    name: "Sneha Das",
    role: "Weight Loss Journey",
    text: "I lost 8kg in 2 months just by following Nutrabite meals. It’s simple, healthy, and sustainable.",
  },
  {
    name: "Karan Mehta",
    role: "Startup Founder",
    text: "As a busy founder, Nutrabite saves me time and keeps me energized throughout the day. Worth every rupee!",
  },
  {
    name: "Anjali Singh",
    role: "Yoga Instructor",
    text: "Fresh ingredients, clean meals, and great taste. Nutrabite fits perfectly into my lifestyle.",
  },
];

const TestimonialSection = () => {
  return (
    <section className="py-24 bg-white dark:bg-neutral-950">
      <div className="max-w-7xl mx-auto px-5 sm:px-10 md:px-12 lg:px-5 space-y-16">
        
        {/* Heading */}
        <div className="text-center max-w-2xl mx-auto mb-10">
          <h2 className="font-bold text-3xl md:text-5xl text-neutral-900 dark:text-white mb-4">
            Loved by Healthy Eaters 💚
          </h2>
          <p className="text-neutral-600 dark:text-neutral-400 text-lg mb-2">
            Thousands of people are transforming their lifestyle with Nutrabite.
          </p>
        </div>

        {/* Testimonials Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8 mt-5">
          {testimonials.map((item, index) => (
            <div
              key={index}
              className="p-6 rounded-2xl bg-neutral-50 dark:bg-neutral-900 border border-neutral-100 dark:border-neutral-800 shadow-lg hover:shadow-xl transition"
            >
              {/* Text */}
              <p className="text-neutral-700 dark:text-neutral-200 leading-relaxed mb-6">
                “{item.text}”
              </p>

              {/* User */}
              <div className="flex items-center gap-4">
                <Image
                  src="/assets/avatar1.jpg"
                  width={50}
                  height={50}
                  alt="user"
                  className="rounded-full object-cover"
                />
                <div>
                  <h3 className="font-semibold text-neutral-900 dark:text-white">
                    {item.name}
                  </h3>
                  <p className="text-sm text-neutral-500">
                    {item.role}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};

export default TestimonialSection;