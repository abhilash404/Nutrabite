import { Apple, Truck, Handshake } from "lucide-react";

const features = [
  {
    title: "Healthy Food",
    description:
      "We prioritize your nourishment with a thoughtful array of delicious, health-conscious options.",
    icon: <Apple className="w-8 h-8 text-white" />,
  },
  {
    title: "Fastest Delivery",
    description:
      "Experience unparalleled speed with our express delivery service. We prioritize your well being with the fastest delivery in town.",
    icon: <Truck className="w-8 h-8 text-white" />,
  },
  {
    title: "Most Trusted",
    description:
      "As the most trusted provider, we prioritize quality, transparency, and customer satisfaction in every healthy food we offer.",
    icon: <Handshake className="w-8 h-8 text-white" />,
  },
];

export default function FeaturesSection() {
  return (
    <section className="mt-16 md:mt-24 py-24 md:py-32 bg-white  dark:bg-neutral-950 ">
      <div id="1" className="text-center mb-16">
        <h2 className="text-3xl md:text-5xl font-bold text-neutral-900 dark:text-white mb-4">
          Why Choose Nutrabite?
        </h2>
        <p className="text-neutral-600 dark:text-neutral-400 max-w-2xl mx-auto text-lg">
          We bring you healthy, delicious meals with speed, quality, and trust
          you can rely on.
        </p>
      </div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 items-start">
          {features.map((feature, index) => (
            <div
              key={index}
              className="flex items-start space-x-10 gap-6 group"
            >
              {/* Icon Circle */}

              <div className="shrink-0">
                <div className="flex items-center justify-center w-16 h-16 rounded-full bg-green-600 transition-transform duration-300 group-hover:scale-110 shadow-lg shadow-green-200 dark:shadow-none">
                  {feature.icon}
                </div>
              </div>

              {/* Text Content */}
              <div className="flex flex-col space-y-2">
                <h3 className="text-2xl font-bold text-neutral-900 dark:text-white leading-tight">
                  {feature.title}
                </h3>
                <p className="text-neutral-600 dark:text-neutral-400 leading-relaxed text-sm lg:text-base">
                  {feature.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
